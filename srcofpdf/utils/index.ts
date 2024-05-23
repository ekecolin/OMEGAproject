// Import the KeyboardEvent type from the React library to type the event parameter - https://www.newline.co/@bespoyasov/how-to-handle-keyboard-input-events-in-react-typescript-application--9b21764e
import { KeyboardEvent } from "react";

/**
 * Creates a function to handle the Enter key press event.
 * 
 * @param {Function} f The function to be executed when the Enter key is pressed.
 * @return {Function} A function that takes a keyboard event and checks if the Enter key was pressed.
 */
export function handleEnterKeyPress<T = Element>(f: () => void) {
  // Utilize the more general handleKeyPress function specifying "Enter" as the key to listen for
  return handleKeyPress<T>(f, "Enter");
}

/**
 * Creates a generic function to handle keyboard press events for a specific key.
 * 
 * @param {Function} f The function to be executed when the specified key is pressed.
 * @param {string} key The name of the key to listen for keyboard events.
 * @return {Function} A function that takes a keyboard event and checks if the specified key was pressed.
 */
export function handleKeyPress<T = Element>(f: () => void, key: string) {
  // Returns a function that will be called with a KeyboardEvent
  return (e: KeyboardEvent<T>) => {
    // Check if the pressed key matches the specified key
    if (e.key === key) {
      // Execute the passed function f if the keys match
      f();
    }
  };
}
