// theme/createAppTheme.js
import { createTheme } from '@mui/material/styles';

const createAppTheme = (darkMode) => {
  return createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
      // You can add more customization to the theme here.
      // For example, primary and secondary colors, typography, etc.
    },
    // Add other theme customizations here.
  });
};

export default createAppTheme;
