import React, {useState} from 'react'

import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import FormControlLabel from '@mui/material/FormControlLabel'
import Checkbox from '@mui/material/Checkbox'
import Link from '@mui/material/Link'
import Paper from '@mui/material/Paper'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import { withStyles } from '@material-ui/core/styles'

import { useHistory } from 'react-router-dom'
import { LFBSAuthentication, LFBSConst } from 'lfbs-common-lib'

import { GoogleAuthProvider,
         signInWithPopup,
         signInWithEmailAndPassword,
         sendPasswordResetEmail,
         getAuth } from 'firebase/auth'

const styles = theme => ({
  container: {
    margin: '0px',
    height: '100%',
    overflow: 'auto',
  },
  signinButton: {
    textTransform:'none',
  },
  googleIcon: {
    width: '30px', 
  },
  googleText: {
    marginLeft: '10px',
  },  
})

const LFBSSignin = ({appProps,signinProps,classes}) => {
  const history = useHistory()
  const lfbsAuthentication = new LFBSAuthentication()
  const lfbsConst = new LFBSConst()

  const [email, setEmail] = useState('')

  let auth = undefined

  const getFirebaseAuth = () => {
    if(!auth) {
      auth = getAuth(appProps.firebaseApp)
    }
    return(auth)
  }

  const successfulSignin = () => {
    if(appProps.signedInUserChanged) {
      appProps.signedInUserChanged()
    }
    history.push(signinProps.redirectUrl ? signinProps.redirectUrl : "/")
  }

  const handleEmailChange = event => {
    setEmail(event.target.value)
  }

  const getAppUserFromFirebaseUser = (firebaseUser,signinType) => {
    const email = firebaseUser.email
    const names = (firebaseUser.displayName && firebaseUser.displayName != null)  ? firebaseUser.displayName.split(" ") : [] 
    const firstName = names.length > 0 ? names[0] : undefined
    const lastName = names.length > 1 ? names[1] : undefined
    const photoURL = firebaseUser.photoURL

    console.log(`getAppUserFromFirebaseUser() - ${email} ${firstName} ${lastName} ${photoURL}`)

    const appUser = JSON.parse(`{"email":"${email}",
                               "firstName": "${firstName}",
                               "lastName": "${lastName}",
                               "photoUrl": "${photoURL}",
                               "signinType": "${signinType}"}`)
    return(appUser)
  }

  const successfulFirebaseSignin = async (firebaseUser,signinType) => {
    lfbsAuthentication.signedInFirebaseUser(firebaseUser)

    signinProps.signinFunc(getAppUserFromFirebaseUser(firebaseUser,signinType))
    .then(response => {
        let signedInUser = (response.user ? response.user : response)
        lfbsAuthentication.signedInAppUser(signedInUser)
        successfulSignin()
    })
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const password = data.get('password')

    if(!signinProps.signinFunc){
      appProps.notifyUser(`no signinFunc defined.`,appProps.SEVERITY_ERROR)
      return
    }

    if(email === "" || password === "") {
      appProps.notifyUser('Please enter a user name and password.',appProps.SEVERITY_ERROR)
      return
    }

    signInWithEmailAndPassword(getFirebaseAuth(),email,password)
      .then((signinResult) => {
        const firebaseUser = signinResult.user
        successfulFirebaseSignin(firebaseUser,lfbsConst.SIGNIN_TYPE_EMAIL)
       })
      .catch(error => {
        appProps.notifyUser(`Signin with email failed - ${error}`,appProps.SEVERITY_ERROR)
    })
  }

  const signInWithGoogle = async () => {
    if(!signinProps.signinFunc){
      appProps.notifyUser(`no signinFunc defined.`,appProps.SEVERITY_ERROR)
      return
    }

    try{
      let provider = new GoogleAuthProvider()

      const signinResult  = await signInWithPopup(getFirebaseAuth(), provider)
      const firebaseUser = signinResult.user
      successfulFirebaseSignin(firebaseUser,lfbsConst.SIGNIN_TYPE_GOOGLE)
    } catch(error) {
      console.log(`error -> <${JSON.stringify(error)}`)
      appProps.notifyUser(`Signin with Google failed - ${error}`,appProps.SEVERITY_ERROR)
    }
  }

  const resetPassword = () => {
    if(email === "") {
      appProps.notifyUser('Please enter an email.',appProps.SEVERITY_ERROR)
      return
    }

    if(!validateEmail(email)){
      appProps.notifyUser('Please enter a valid email.',appProps.SEVERITY_ERROR)
      return
    }

    sendPasswordResetEmail(getFirebaseAuth(),email)
      .then(() => {
         appProps.notifyUser(`You will receive an invitation to change your password in your ${email} account.`,appProps.SEVERITY_SUCCESS)
       })
      .catch(error => {
        appProps.notifyUser(`Your password reset request failed - ${error.message}.`,appProps.SEVERITY_ERROR)
      })
  }

  const validateEmail = (email) => {
    var re = /\S+@\S+\.\S+/
    return re.test(email)
  }

  return (
    <div className={classes.container}>
      <Grid container component="main">
        <Grid item xs={12} component={Paper} elevation={6} square>
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Typography component="h1" variant="h5">
              Sign in
            </Typography>
            <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                onChange= {handleEmailChange}
                autoFocus
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
              />
              { signinProps && signinProps.showRememberMe &&
                <FormControlLabel
                control={<Checkbox value="remember" color="primary" />}
                label="Remember me"
                />
              }
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                className={classes.signinButton}
              >
                Sign In
              </Button>
              <Button
                onClick={() => {signInWithGoogle()}}
                variant="contained"
                fullWidth
                sx={{ mt: 3, mb: 2 }}
                className={classes.signinButton}
              >
                <span className={classes.googleText}>Sign in with Google</span>
              </Button>
              <Grid container>
                <Grid item xs>
                  { signinProps && signinProps.showResetPassword &&
                    <Link component="button"
                          variant="body2"
                          onClick={() => {resetPassword()}}>
                      Reset password?
                    </Link>
                  }       
                </Grid>
                <Grid item>
                  { signinProps && signinProps.signupUrl &&
                    <Link href={signinProps.signupUrl} 
                          variant="body2">
                      {`Don't have an account? Sign Up`}
                    </Link>
                  }
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </div>
  )
}
export default withStyles(styles)(LFBSSignin)
