import { KeyboardEvent } from "react";

/**
 * 
 * 
 * @param {Function} f 
 * @return {Function} 
 */
export function handleEnterKeyPress<T = Element>(f: () => void) {
  return handleKeyPress<T>(f, "Enter");
}

/**
 *
 * 
 * @param {Function} f 
 * @param {string} key 
 * @return {Function} 
 */
export function handleKeyPress<T = Element>(f: () => void, key: string) {
  return (e: KeyboardEvent<T>) => {
    if (e.key === key) {
      f();
    }
  };
}
