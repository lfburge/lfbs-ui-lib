import React from 'react'
import {
  LinearProgress,
  Box,
} from '@mui/material'

import { withStyles } from '@material-ui/core/styles'

const styles = theme => ({
  progress: { 
    margin: '2px',
    alignText: 'center'
  },
})

const LFBSMaybeLoading = ({isLoading,classes}) => {
  return (
            // <Stack alignItems="center">
            //   <CircularProgress className={styles.progress} /> 
            // </Stack>

            <Box sx={{ width: '100%' }}>
              <LinearProgress />
            </Box>            
         )



}

export default withStyles(styles)(LFBSMaybeLoading)
