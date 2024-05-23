import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  colors: {
    primary: "hsl(262, 100%, 59%)", // Your primary color
    secondary: "hsl(93, 50%, 48%)", // Your secondary color
    accent: "hsl(273, 72%, 50%)", // Your accent color
    background: "hsl(228, 6%, 8%)",
    text: "hsl(228, 8%, 70%)",
    // Define other colors from your CSS variables here
  },
  fonts: {
    body: "Montserrat, sans-serif",
    heading: "Montserrat, sans-serif",
    // Add any other font specifications here
  },
  components: {
    // Define custom component styles here if needed
  },
  styles: {
    global: {
      "html, body": {
        backgroundColor: "hsl(228, 6%, 8%)", // Use your desired background color
        color: "white", // Adjust text color as needed
        minHeight: "100vh", // Ensure min height covers the full viewport height
        margin: 0, // Remove default margins
        padding: 0, // Remove default paddings
      },
    },
  },
  // Include other theme customizations here
});

export default theme;
