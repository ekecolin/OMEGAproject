// https://chakra-ui.com/
import type { AppProps } from "next/app";
import { ChakraProvider } from "@chakra-ui/react";
import theme from '../style/theme';

// This is the main App component that wraps the entire Next.js application.
// ChakraProvider is used to inject the Chakra UI theme into the app.
export default function App({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider theme={theme}>
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/remixicon/4.1.0/remixicon.min.css" />
      <Component {...pageProps} />
    </ChakraProvider>
  );
}
