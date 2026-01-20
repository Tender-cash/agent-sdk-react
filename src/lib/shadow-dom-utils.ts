/* -------------------------------------------------------------------------- */
/*                             Shadow DOM Utilities                           */
/* -------------------------------------------------------------------------- */
/**
 * Utilities for working with elements inside Shadow DOM
 * Since document.getElementById() doesn't search inside shadow roots,
 * we need custom functions to find elements across shadow boundaries
 */

/**
 * Find an element by ID, including searching inside shadow roots
 * 
 * @param {string} id - The element ID to search for
 * @returns {HTMLElement | null} The found element or null
 */
export const findElementInShadowDOM = (id: string): HTMLElement | null => {
  // First try standard document.getElementById (for elements not in shadow DOM)
  const standardElement = document.getElementById(id);
  if (standardElement) {
    return standardElement;
  }

  // Search for shadow hosts and check their shadow roots
  const shadowHosts = document.querySelectorAll('[data-tender-sdk-shadow-host]');
  
  for (const host of shadowHosts) {
    if (host.shadowRoot) {
      const shadowElement = host.shadowRoot.getElementById(id);
      if (shadowElement) {
        return shadowElement;
      }
    }
  }

  // Also check all shadow roots in the document (more thorough search)
  const allElements = document.querySelectorAll('*');
  for (const element of allElements) {
    if (element.shadowRoot) {
      const shadowElement = element.shadowRoot.getElementById(id);
      if (shadowElement) {
        return shadowElement;
      }
    }
  }

  return null;
};

/**
 * Get the shadow root that contains an element with the given ID
 * 
 * @param {string} id - The element ID to search for
 * @returns {ShadowRoot | null} The shadow root containing the element, or null
 */
export const getShadowRootForElement = (id: string): ShadowRoot | null => {
  const shadowHosts = document.querySelectorAll('[data-tender-sdk-shadow-host]');
  
  for (const host of shadowHosts) {
    if (host.shadowRoot) {
      const shadowElement = host.shadowRoot.getElementById(id);
      if (shadowElement) {
        return host.shadowRoot;
      }
    }
  }

  // Also check all shadow roots in the document
  const allElements = document.querySelectorAll('*');
  for (const element of allElements) {
    if (element.shadowRoot) {
      const shadowElement = element.shadowRoot.getElementById(id);
      if (shadowElement) {
        return element.shadowRoot;
      }
    }
  }

  return null;
};

/**
 * Check if an element is inside a shadow DOM
 * 
 * @param {HTMLElement} element - The element to check
 * @returns {boolean} True if the element is inside a shadow root
 */
export const isInShadowDOM = (element: HTMLElement): boolean => {
  return element.getRootNode() instanceof ShadowRoot;
};

