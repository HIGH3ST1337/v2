// Header customization - removes search and favorites, repositions account and cart
(function() {
  function customizeHeader() {
    const header = document.querySelector('header nav')
    if (!header) return

    // Find all links and buttons in the header
    const links = Array.from(header.querySelectorAll('a, button'))
    
    links.forEach(link => {
      const href = (link.href || '').toLowerCase()
      const text = link.textContent.trim().toUpperCase()
      const ariaLabel = (link.getAttribute('aria-label') || '').toLowerCase()
      const className = (link.className || '').toLowerCase()
      
      // Hide search button - look for search in href, text, aria-label, or class
      if (href.includes('search') || text.includes('SEARCH') || 
          ariaLabel.includes('search') || className.includes('search')) {
        link.style.display = 'none'
        link.style.visibility = 'hidden'
        link.setAttribute('hidden', 'hidden')
        // Also hide parent container if it only contains search
        if (link.parentElement) {
          const siblings = Array.from(link.parentElement.children).filter(el => 
            el.style.display !== 'none' && !el.hasAttribute('hidden')
          )
          if (siblings.length === 1 && siblings[0] === link) {
            link.parentElement.style.display = 'none'
          }
        }
      }
      
      // Hide wishlist/favorite/heart button
      if (href.includes('wishlist') || href.includes('favorite') || 
          text.includes('WISHLIST') || text.includes('FAVORITE') || text.includes('HEART') ||
          ariaLabel.includes('wishlist') || ariaLabel.includes('favorite') || 
          ariaLabel.includes('heart') || className.includes('wishlist') || 
          className.includes('favorite')) {
        link.style.display = 'none'
        link.style.visibility = 'hidden'
        link.setAttribute('hidden', 'hidden')
        if (link.parentElement) {
          const siblings = Array.from(link.parentElement.children).filter(el => 
            el.style.display !== 'none' && !el.hasAttribute('hidden')
          )
          if (siblings.length === 1 && siblings[0] === link) {
            link.parentElement.style.display = 'none'
          }
        }
      }
    })

    // Find account and cart links
    const accountLink = links.find(link => {
      const href = (link.href || '').toLowerCase()
      const ariaLabel = (link.getAttribute('aria-label') || '').toLowerCase()
      const text = link.textContent.trim().toLowerCase()
      return href.includes('/account') || href.includes('/user') || 
             href.includes('/login') || ariaLabel.includes('account') || 
             ariaLabel.includes('user') || ariaLabel.includes('login') ||
             text.includes('account') || text.includes('login')
    })

    const cartLink = links.find(link => {
      const href = (link.href || '').toLowerCase()
      const ariaLabel = (link.getAttribute('aria-label') || '').toLowerCase()
      const text = link.textContent.trim().toLowerCase()
      return href.includes('/cart') || href.includes('/bag') || 
             ariaLabel.includes('cart') || ariaLabel.includes('bag') ||
             text.includes('cart') || text.includes('bag')
    })

    // Reposition account and cart
    if (accountLink && cartLink) {
      // Find their common container (flex container)
      let container = accountLink.parentElement
      
      // Walk up the tree to find a flex container that contains both
      while (container && container !== document.body) {
        if (container.contains(cartLink)) {
          break
        }
        container = container.parentElement
      }
      
      // If we didn't find a common container, look for flex containers
      if (!container || container === document.body) {
        const flexContainers = header.querySelectorAll('.flex, [class*="flex"], .page-container > div')
        container = Array.from(flexContainers).find(el => 
          el.contains(accountLink) && el.contains(cartLink)
        )
      }

      if (container) {
        container.style.display = 'flex'
        container.style.justifyContent = 'space-between'
        container.style.width = '100%'
        container.style.alignItems = 'center'
        
        // Position account on left
        accountLink.style.order = '-1'
        accountLink.style.marginRight = 'auto'
        accountLink.style.cssFloat = 'left'
        
        // Position cart on right
        cartLink.style.order = '999'
        cartLink.style.marginLeft = 'auto'
        cartLink.style.cssFloat = 'right'
      }
    }
  }

  // Run on page load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', customizeHeader)
  } else {
    customizeHeader()
  }

  // Also run after Turbo navigations
  if (typeof Turbo !== 'undefined') {
    document.addEventListener('turbo:load', customizeHeader)
    document.addEventListener('turbo:frame-load', customizeHeader)
  }
})()

