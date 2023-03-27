import React, {useState} from 'react'
import Snackbar from '@material-ui/core/Snackbar'
import { withStyles } from '@material-ui/core/styles'
import { LFBSAppProps } from 'lfbs-common-lib'
import { LFBSConst } from 'lfbs-common-lib'

const styles = theme => ({
    info: {
      color: 'white',
      backgroundColor: 'blue'
    },
    success: {
      color: 'white',
      backgroundColor: 'green'
    },
    warning: {
      color: 'black',
      backgroundColor: 'rgb(229, 233, 170)'
    },
    error: {
      color: 'white',
      backgroundColor: 'red'
    },
  })

const LFBSNotifyUser = ({lfbsUserMessage,hideUserMessage,classes}) => {

  const appProps = new LFBSAppProps()
  const lfbsConst = new LFBSConst()

  const snackPosition = { vertical: 'bottom',
                          horizontal: 'center',
                        }    

  const onMsgClose = () => {
    hideUserMessage()
  }
  
  const getMessageClass = () => {
    let msgClass = classes.info

    switch(lfbsUserMessage.severity){
      case lfbsConst.SEVERITY_SUCCESS:
        msgClass = classes.success
        break
      case lfbsConst.SEVERITY_WARNING:
        msgClass = classes.warning
        break
      case lfbsConst.SEVERITY_ERROR:
        msgClass = classes.error
        break
      case lfbsConst.SEVERITY_INFO:
        msgClass = classes.info
        break
      default:
        msgClass = classes.info
        break
    }
  
    return(msgClass)
  } 
  
  return (
        <Snackbar
            anchorOrigin={snackPosition}
            open={lfbsUserMessage.visible}
            message={lfbsUserMessage.message}
            autoHideDuration={lfbsUserMessage.duration}
            onClose={onMsgClose}
            ContentProps={{
                className: getMessageClass()
            }}      
        />
    )
}

export default withStyles(styles)(LFBSNotifyUser)
