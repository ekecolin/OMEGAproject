// https://react.dev/reference/react/useState
// https://legacy.reactjs.org/docs/hooks-effect.html
import { useEffect, useState } from "react";

// Custome hook to dectect if the browser is Chrome
const useIsChrome = (): boolean => {
  const [isChrome, setIsChrome] = useState(false);

  // Checks if the browser is Brave.
  const isBrave = async (): Promise<boolean> => {
    try {
      const isBrave = await (window.navigator as any).brave?.isBrave();
      return !!isBrave;
    } catch (error) {
      return false;
    }
  };

  // https://react.dev/reference/react/useEffect
  useEffect(() => {
    // Async function to determine if the browser is Chrome
    const checkBrowser = async () => {
      const userAgent = window.navigator.userAgent.toLowerCase();
      // Checks if the current browser is Brave.
      const isBraveBrowser = await isBrave();
      // Checks if the userAgent contains 'chrome', but not 'edge', 'opr' (Opera), and isn't Brave.
      const isChrome =
        userAgent.indexOf("chrome") > -1 &&
        userAgent.indexOf("edge") === -1 &&
        userAgent.indexOf("opr") === -1 &&
        !isBraveBrowser;

      // Update the state based on the detection
      setIsChrome(isChrome);
    };

    checkBrowser();
  }, []);

  return isChrome;
};

export default useIsChrome;
