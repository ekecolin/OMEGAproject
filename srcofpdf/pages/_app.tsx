import type { AppProps } from "next/app";
import { ChakraProvider } from "@chakra-ui/react";
import theme from '../style/theme';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider theme={theme}>
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/remixicon/4.1.0/remixicon.min.css" />
      <Component {...pageProps} />
    </ChakraProvider>
  );
}
