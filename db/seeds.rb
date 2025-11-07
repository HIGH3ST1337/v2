# This file should ensure the existence of records required to run the application in every environment (production,
# development, test). The code here should be idempotent so that it can be executed at any point in every environment.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Example:
#
#   ["Action", "Comedy", "Drama", "Horror"].each do |genre_name|
#     MovieGenre.find_or_create_by!(name: genre_name)
#   end

# Load Spree core seeds
Spree::Core::Engine.load_seed if defined?(Spree::Core)

# Update admin user with environment variable credentials
# This runs after Spree seeds to ensure the admin user uses configured credentials
load(Rails.root.join('db/seeds/update_admin.rb'))
