import { Html, Head, Main, NextScript } from 'next/document'

// This function customizes the HTML document structure of a Next.js application.
// It defines the root HTML element and specifies what should be included in the head and body of the page.
export default function Document() {
  return (
    <Html>
      <Head>
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700&display=swap" rel="stylesheet" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}