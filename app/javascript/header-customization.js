// Header customization - removes search, repositions account to left of logo
(function() {
  function customizeHeader() {
    console.log('Header customization running...');
    
    // Hide wishlist form
    const wishlistForm = document.querySelector('header form[action="/account/wishlist"], header form[action*="/wishlist"]');
    if (wishlistForm) {
      wishlistForm.style.cssText = 'display: none !important; visibility: hidden !important;';
    }
    
    // Hide wishlist button
    const wishlistButton = document.querySelector('header #wishlist-icon');
    if (wishlistButton) {
      wishlistButton.style.cssText = 'display: none !important; visibility: hidden !important;';
    }

    // Find the main header container
    const mainContainer = document.querySelector('header nav .page-container > .flex.items-center, header nav .page-container > .flex');
    if (!mainContainer) {
      console.log('Main container not found');
      return;
    }

    // Hide search - hide first child of main container (this is the search button container)
    const firstChild = mainContainer.children[0];
    if (firstChild) {
      const firstChildText = firstChild.textContent.trim().toUpperCase();
      const hasSearch = firstChildText.includes('SEARCH');
      const hasAccount = firstChild.querySelector('button[data-action*="slideover-account"]') !== null;
      
      // Hide first child if it has search but NOT account button
      if (hasSearch && !hasAccount) {
        firstChild.style.cssText = 'display: none !important; visibility: hidden !important; opacity: 0 !important; width: 0 !important; height: 0 !important; overflow: hidden !important;';
        console.log('Hiding search container (first child)');
      }
    }
    
    // Hide any search buttons/links anywhere in header
    const allElements = mainContainer.querySelectorAll('a, button, div');
    allElements.forEach(el => {
      const text = el.textContent.trim().toUpperCase();
      const dataAction = el.getAttribute('data-action') || '';
      const className = el.className || '';
      
      // Check if element contains SEARCH text or has search-related attributes
      if (text === 'SEARCH' || (text.includes('SEARCH') && el.tagName === 'A')) {
        if (!el.closest('button[data-action*="slideover-account"]')) {
          el.style.cssText = 'display: none !important; visibility: hidden !important;';
          console.log('Hiding search element:', el);
        }
      }
      
      if (dataAction.includes('search') && !dataAction.includes('account')) {
        el.style.cssText = 'display: none !important; visibility: hidden !important;';
        console.log('Hiding search button by data-action');
      }
    });

    // Setup flexbox layout with relative positioning
    mainContainer.style.cssText = 'display: flex !important; justify-content: space-between !important; width: 100% !important; align-items: center !important; position: relative !important;';
    
    // Find and position account button on the LEFT (absolute positioning)
    const accountButton = document.querySelector('header button[data-action*="slideover-account"]');
    if (accountButton) {
      console.log('Found account button, moving to left');
      accountButton.style.cssText = 'display: flex !important; visibility: visible !important;';
      
      // Find account button's parent container and position it on the left
      let accountContainer = accountButton.closest('.flex.items-center.gap-4');
      if (!accountContainer) {
        accountContainer = accountButton.parentElement;
      }
      
      if (accountContainer && accountContainer !== mainContainer) {
        accountContainer.style.cssText = 'display: flex !important; visibility: visible !important; position: absolute !important; left: 0 !important; z-index: 10 !important;';
        console.log('Moved account container to left');
      }
    }
    
    // Find and position cart button on the RIGHT (absolute positioning)
    const cartButton = document.querySelector('header button[data-action*="cart"], header button[data-action*="slideover-cart"]');
    if (cartButton) {
      cartButton.style.cssText = 'display: flex !important; visibility: visible !important;';
      
      let cartContainer = cartButton.closest('.flex.items-center.gap-4');
      if (!cartContainer) {
        cartContainer = cartButton.parentElement;
      }
      
      if (cartContainer && cartContainer !== mainContainer) {
        cartContainer.style.cssText = 'position: absolute !important; right: 0 !important; z-index: 10 !important;';
        console.log('Moved cart container to right');
      }
    }
    
    // Center logo/nav container (absolute positioning with transform)
    const logoContainer = mainContainer.querySelector('.flex.items-center.flex-col.header-nav-container, .flex.items-center.flex-col');
    if (logoContainer) {
      logoContainer.style.cssText = 'position: absolute !important; left: 50% !important; transform: translateX(-50%) !important; z-index: 5 !important; padding-top: 1rem !important;';
      console.log('Centered logo container with padding');
    }
  }

  // Run immediately
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', customizeHeader);
  } else {
    customizeHeader();
  }

  // Run multiple times to catch late-loading elements
  setTimeout(customizeHeader, 100);
  setTimeout(customizeHeader, 300);
  setTimeout(customizeHeader, 500);
  setTimeout(customizeHeader, 1000);
  setTimeout(customizeHeader, 2000);

  // Turbo events
  if (typeof Turbo !== 'undefined') {
    document.addEventListener('turbo:load', customizeHeader);
    document.addEventListener('turbo:frame-load', customizeHeader);
  }
})()
