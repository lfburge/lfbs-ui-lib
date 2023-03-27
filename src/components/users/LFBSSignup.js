import React from 'react'

import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Link from '@mui/material/Link'
import Paper from '@mui/material/Paper'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import { useHistory } from 'react-router-dom'
import { withStyles } from '@material-ui/core/styles'

import { LFBSAuthentication, LFBSConst } from 'lfbs-common-lib'

import { GoogleAuthProvider,
         signInWithPopup,
         getAuth } from 'firebase/auth'

const styles = theme => ({
  container: {
    margin: '0px',
    height: '100%',
    overflow: 'auto'
  },
  signupButton: {
    textTransform:'none',
  },
  googleText: {
    marginLeft: '10px',
  },  
})

const C4aSignup = ({appProps,signupProps,classes}) => {
  const history = useHistory()
  const lfbsAuthentication = new LFBSAuthentication()
  const lfbsConst = new LFBSConst()

  let auth = undefined

  const getFirebaseAuth = () => {
    if(!auth) {
      auth = getAuth(appProps.firebaseApp)
    }
    return(auth)
  }

  const successfulSignup = () => {
    if(appProps.signedInUserChanged) {
      appProps.signedInUserChanged()
    }
    history.push(signupProps.redirectUrl ? signupProps.redirectUrl : "/")
  }

  const getAppUserFromFirebaseUser = (firebaseUser,signinType) => {
    const email = firebaseUser.email
    const names = (firebaseUser.displayName && firebaseUser.displayName != null)  ? firebaseUser.displayName.split(" ") : [] 
    const firstName = names.length > 0 ? names[0] : undefined
    const lastName = names.length > 1 ? names[1] : undefined
    const photoURL = firebaseUser.photoURL

    const appUser = JSON.parse(`{"email":"${email}",
                               "firstName": "${firstName}",
                               "lastName": "${lastName}",
                               "photoUrl": "${photoURL}",
                               "signinType": "${signinType}"}`)
    return(appUser)
  }

  const handleSubmit = event => {
    event.preventDefault()

    const data = new FormData(event.currentTarget)
    const email = data.get('email') 
    let firstName = data.get('firstName')
    let middleName = data.get('middleName')
    let lastName = data.get('lastName')
    const password = data.get('password')
    const confirmPassword = data.get('confirmPassword')
    let appUser = undefined

    if( !signupProps.enableUserName ) {
      firstName = signupProps.firstName
      middleName = signupProps.middleName
      lastName = signupProps.lastName
    }

    if(email === "") {
      appProps.notifyUser('Please enter your email.',appProps.SEVERITY_ERROR)
      return
    }

    if(!validateEmail(email)){
      appProps.notifyUser('Please enter a valid email.',appProps.SEVERITY_ERROR)
      return
    }

    if(password === "") {
      appProps.notifyUser('Please enter your password.',appProps.SEVERITY_ERROR)
      return
    }

    if(firstName === "") {
      appProps.notifyUser('Please enter your first name.',appProps.SEVERITY_ERROR)
      return
    }

    if(lastName === "") {
      appProps.notifyUser('Please enter your last name.',appProps.SEVERITY_ERROR)
      return
    }

    if(password !== confirmPassword) {
      appProps.notifyUser(`Password and confirm password are not equal.`,appProps.SEVERITY_ERROR)
      return
    }

    if(!signupProps.signupFunc){
      appProps.notifyUser(`Error signing up user - no signupFunc defined.`,appProps.SEVERITY_ERROR)
      return
    }

    appUser = JSON.parse(`{"email": "${email}",
                       "firstName": "${firstName}",
                       "password": "${password}",
                       "middleName": "${middleName}",
                       "lastName": "${lastName}",
                       "signinType": "${c4aConst.SIGNIN_TYPE_EMAIL}"}`)

    signupProps.signupFunc(appUser)
    .then(response => {
      if(!response.error) {
        successfulSignup()
      }
    })
  }

  const validateEmail = (email) => {
    var re = /\S+@\S+\.\S+/
    return re.test(email)
  }

  const successfulFirebaseSignin = async (firebaseUser,signinType) => {
    authentication.signedInFirebaseUser(firebaseUser)

    signupProps.signinFunc(getAppUserFromFirebaseUser(firebaseUser,signinType))
    .then(response => {
        if(!response.error) {
            let signedInUser = (response.user ? response.user : response)
            authentication.signedInAppUser(signedInUser)
            successfulSignup()
        }
    })
  }

  const signUpWithGoogle = async () => {
    if(!signupProps.signinFunc){
      appProps.notifyUser(`no signinFunc defined.`,appProps.SEVERITY_ERROR)
      return
    }
    try{
      let provider = new GoogleAuthProvider()

      const signinResult  = await signInWithPopup(getFirebaseAuth(), provider)
      const firebaseUser = signinResult.user
      successfulFirebaseSignin(firebaseUser,c4aConst.SIGNIN_TYPE_GOOGLE)
    } catch(error) {
      appProps.notifyUser(`Signup with Google failed - ${error}`,appProps.SEVERITY_ERROR)
    }
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
              Sign up{ (signupProps && !signupProps.enableUserName) ? (" - " + signupProps.firstName + " " + signupProps.lastName) : "" }
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
                autoFocus
                defaultValue={signupProps.email}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="confirmPassword"
                label="Confirm Password"
                type="password"
                id="confirmPassword"
              />

              { signupProps && signupProps.enableUserName &&
                <div>
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="firstName"
                    label="First Name"
                    name="firstName"
                  />
                  <TextField
                    margin="normal"
                    fullWidth
                    id="middleName"
                    label="Middle Name"
                    name="middleName"
                  />
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="lastName"
                    label="Last Name"
                    name="lastName"
                  />
                </div>
              }
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Sign Up
              </Button>
              { signupProps && signupProps.showSignupWithGoogle &&
                <Button
                    onClick={() => {signUpWithGoogle()}}
                    variant="contained"
                    fullWidth
                    sx={{ mt: 3, mb: 2 }}
                    className={classes.signupButton}
                >
                  <span className={classes.googleText}>Sign up with Google</span>
                </Button>
              }

              { signupProps && signupProps.signinUrl &&
                <Grid container>
                  <Grid item>
                    <Link href={signupProps.signinUrl}  variant="body2">
                      {"Have an account? Sign In"}
                    </Link>
                  </Grid>
                </Grid>
              }
            </Box>
          </Box>
        </Grid>
      </Grid>
      </div>      
  )
}

export default withStyles(styles)(C4aSignup)
