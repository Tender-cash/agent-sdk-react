/* -------------------------------------------------------------------------- */
/*                             Styles Converter                               */
/* -------------------------------------------------------------------------- */
/**
 * Converts CSS imports into a single inline style string for shadow DOM injection
 * This ensures all styles are bundled and injected only into the shadow root
 */

import widgetCSS from '../styles/index.css?inline';

/**
 * Get the complete CSS string for shadow DOM injection
 * This combines all stylesheets into a single string
 * 
 * @returns {string} Complete CSS string ready for shadow DOM injection
 */
export const getWidgetStyles = (): string => {
  // The ?inline import already gives us the compiled CSS as a string
  // This includes Tailwind CSS, custom styles, fonts, etc.
  return widgetCSS || '';
};

/**
 * Inject styles into shadow DOM
 * Creates a style element with all widget styles and appends it to the shadow root
 * 
 * @param {ShadowRoot} shadowRoot - The shadow root to inject styles into
 * @returns {HTMLStyleElement} The created style element
 */
export const injectStylesIntoShadow = (shadowRoot: ShadowRoot): HTMLStyleElement => {
  // Check if styles are already injected
  const existingStyle = shadowRoot.querySelector('style[data-tender-sdk-styles]');
  if (existingStyle) {
    return existingStyle as HTMLStyleElement;
  }

  // Create style element
  const styleElement = document.createElement('style');
  styleElement.setAttribute('data-tender-sdk-styles', 'true');
  
  // Get the complete CSS string
  const cssText = getWidgetStyles();
  
  // Inject CSS into shadow DOM
  styleElement.textContent = cssText;
  shadowRoot.appendChild(styleElement);

  return styleElement;
};

/**
 * Create a style element with widget styles (for manual injection)
 * 
 * @returns {HTMLStyleElement} Style element with widget CSS
 */
export const createWidgetStyleElement = (): HTMLStyleElement => {
  const styleElement = document.createElement('style');
  styleElement.setAttribute('data-tender-sdk-styles', 'true');
  styleElement.textContent = getWidgetStyles();
  return styleElement;
};

