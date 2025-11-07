# Update or create admin user with credentials from environment variables
# This ensures the admin user uses the configured ADMIN_EMAIL and ADMIN_PASSWORD

puts "========================================="
puts "Admin User Configuration Script"
puts "========================================="
puts "ADMIN_EMAIL env var: #{ENV['ADMIN_EMAIL'].present? ? ENV['ADMIN_EMAIL'] : '[NOT SET]'}"
puts "ADMIN_PASSWORD env var: #{ENV['ADMIN_PASSWORD'].present? ? '[SET]' : '[NOT SET]'}"
puts ""

if ENV['ADMIN_EMAIL'].present? && ENV['ADMIN_PASSWORD'].present?
  puts "Configuring admin user..."

  # IMPORTANT: Admins are stored in spree_admin_users table (Spree::AdminUser model)
  # NOT in the regular spree_users table!

  # Find the primary admin user by checking:
  # 1. Default spree@example.com (from initial Spree setup)
  # 2. Current configured email from ENV
  # 3. ANY existing admin user (handles email changes)
  admin_user = Spree::AdminUser.find_by(email: 'spree@example.com') ||
               Spree::AdminUser.find_by(email: ENV['ADMIN_EMAIL']) ||
               Spree::AdminUser.first

  if admin_user
    # Update existing admin user
    old_email = admin_user.email

    if old_email != ENV['ADMIN_EMAIL']
      puts "  Found admin user: #{old_email}"
      puts "  Updating email to: #{ENV['ADMIN_EMAIL']}"
      admin_user.update!(
        email: ENV['ADMIN_EMAIL'],
        password: ENV['ADMIN_PASSWORD'],
        password_confirmation: ENV['ADMIN_PASSWORD']
      )
      puts "  ✓ Admin user updated successfully (email changed: #{old_email} → #{ENV['ADMIN_EMAIL']})"
    else
      puts "  Found admin user: #{admin_user.email}"
      # Email is the same, just update password in case it changed
      admin_user.update!(
        password: ENV['ADMIN_PASSWORD'],
        password_confirmation: ENV['ADMIN_PASSWORD']
      )
      puts "  ✓ Admin password updated"
    end
  else
    # Create new admin user (should only happen on very first deployment)
    puts "  No existing admin user found"
    puts "  Creating new admin user: #{ENV['ADMIN_EMAIL']}"
    admin_user = Spree::AdminUser.create!(
      email: ENV['ADMIN_EMAIL'],
      password: ENV['ADMIN_PASSWORD'],
      password_confirmation: ENV['ADMIN_PASSWORD']
    )

    puts "  ✓ Admin user created successfully"
  end

  puts "========================================="
else
  puts "❌ ERROR: ADMIN_EMAIL and/or ADMIN_PASSWORD not set!"
  puts "Admin user will remain as default: spree@example.com / spree123"
  puts ""
  puts "To fix this, set these environment variables in Railway:"
  puts "  - ADMIN_EMAIL=your-email@example.com"
  puts "  - ADMIN_PASSWORD=your-secure-password"
  puts ""
  puts "Then redeploy to update the admin user."
  puts "========================================="
end
