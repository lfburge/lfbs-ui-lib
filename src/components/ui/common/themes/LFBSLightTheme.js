import {
    createTheme,
  } from '@material-ui/core/styles'
  
  import { 
    red, 
    pink, 
    blue
  } from '@mui/material/colors';
    
  const LFBSLightTheme = createTheme({
    palette: {
      type: 'light',
      primary: blue,
      secondary: pink,
      error: { main: red[600] },
      background: { default: "FFFFFF" },
    }
  })
    
  export default LFBSLightTheme
  
