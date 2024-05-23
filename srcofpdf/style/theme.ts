import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  colors: {
    primary: "hsl(262, 100%, 59%)", 
    secondary: "hsl(93, 50%, 48%)", 
    accent: "hsl(273, 72%, 50%)", 
    background: "hsl(228, 6%, 8%)",
    text: "hsl(228, 8%, 70%)",
    
  },
  fonts: {
    body: "Montserrat, sans-serif",
    heading: "Montserrat, sans-serif",
    
  },
  components: {
    
  },
  styles: {
    global: {
      "html, body": {
        backgroundColor: "hsl(228, 6%, 8%)", 
        color: "white", 
        minHeight: "100vh",
        margin: 0, 
        padding: 0, 
      },
    },
  },
});

export default theme;
