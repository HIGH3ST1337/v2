# Update or create admin user with credentials from environment variables
# This ensures the admin user uses the configured ADMIN_EMAIL and ADMIN_PASSWORD

if ENV['ADMIN_EMAIL'].present? && ENV['ADMIN_PASSWORD'].present?
  puts "Configuring admin user..."

  # Find the primary admin user by checking:
  # 1. Default spree@example.com (from initial Spree setup)
  # 2. Current configured email from ENV
  # 3. ANY user with admin role (handles email changes)
  admin_role = Spree::Role.find_or_create_by!(name: 'admin')

  admin_user = Spree::User.find_by(email: 'spree@example.com') ||
               Spree::User.find_by(email: ENV['ADMIN_EMAIL']) ||
               admin_role.users.first

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

    # Ensure admin role is assigned
    admin_user.spree_roles << admin_role unless admin_user.spree_roles.include?(admin_role)
  else
    # Create new admin user (should only happen on very first deployment)
    puts "  No existing admin user found"
    puts "  Creating new admin user: #{ENV['ADMIN_EMAIL']}"
    admin_user = Spree::User.create!(
      email: ENV['ADMIN_EMAIL'],
      password: ENV['ADMIN_PASSWORD'],
      password_confirmation: ENV['ADMIN_PASSWORD']
    )

    # Assign admin role
    admin_user.spree_roles << admin_role

    puts "  ✓ Admin user created successfully"
  end
else
  puts "Warning: ADMIN_EMAIL and ADMIN_PASSWORD not set. Skipping admin user configuration."
end
