// Header customization script
// This script removes search and favorites buttons, and repositions account and cart icons

document.addEventListener('DOMContentLoaded', function() {
  // Find and hide search button
  const searchLinks = document.querySelectorAll('header nav a[href*="/search"], header nav a[href*="search"]');
  searchLinks.forEach(link => {
    // Check if it's the search link by checking text content or nearby elements
    const linkText = link.textContent.trim().toUpperCase();
    const parent = link.closest('div, nav, header');
    if (linkText.includes('SEARCH') || link.href.includes('search')) {
      link.style.display = 'none';
      // Also hide parent if it only contains search
      if (parent && parent.children.length === 1) {
        parent.style.display = 'none';
      }
    }
  });

  // Find and hide wishlist/favorites button
  const wishlistLinks = document.querySelectorAll('header nav a[href*="/wishlist"], header nav a[href*="wishlist"], header nav a[href*="/favorites"], header nav a[href*="favorites"]');
  wishlistLinks.forEach(link => {
    link.style.display = 'none';
  });

  // Find account and cart links
  const accountLink = document.querySelector('header nav a[href*="/account"], header nav a[href*="/user"]');
  const cartLink = document.querySelector('header nav a[href*="/cart"]');

  // Reposition them
  if (accountLink && cartLink) {
    const container = accountLink.closest('.flex, [class*="flex"], nav .page-container > div');
    if (container) {
      container.style.display = 'flex';
      container.style.justifyContent = 'space-between';
      container.style.width = '100%';
      
      // Create wrapper divs if needed for positioning
      if (accountLink.parentElement === container) {
        accountLink.style.marginRight = 'auto';
        accountLink.style.order = '-1';
      }
      if (cartLink.parentElement === container) {
        cartLink.style.marginLeft = 'auto';
        cartLink.style.order = '999';
      }
    }
  }
});

// Also run after Turbo navigation
document.addEventListener('turbo:load', function() {
  // Re-run the same logic
  document.dispatchEvent(new Event('DOMContentLoaded'));
});

