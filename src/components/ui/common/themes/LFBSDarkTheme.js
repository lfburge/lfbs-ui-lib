import {
  createTheme,
} from '@material-ui/core/styles'

import { 
  red, 
  pink, 
  blue
} from '@mui/material/colors';

const LFBSDarkTheme = createTheme({
  palette: {
    type: 'dark',
    primary: blue,
    secondary: pink,
    error: { main: red[600] },
    background: { primary: "#333333" },
  }
})

export default LFBSDarkTheme
