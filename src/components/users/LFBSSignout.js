import React, {useEffect} from 'react'

import { useHistory } from 'react-router-dom'
import { LFBSAuthentication } from 'lfbs-common-lib'

import { 
  signOut,
  getAuth } from 'firebase/auth'

const LFBSSignout = ({appProps,signinUrl}) => {

  const history = useHistory()
  const lfbsAuthentication = new LFBSAuthentication()

  let auth = undefined

  const getFirebaseAuth = () => {
    if(!auth) {
      auth = getAuth(appProps.firebaseApp)
    }
    return(auth)
  }

  useEffect(() => {
    signOut(getFirebaseAuth())
    .then(() => {
      signedOut()
    })
    .catch(error => {
      console.log(`error signing out ${error}`)
      signedOut()
   })

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])


  const signedOut = () => {
    // Clear the user token.
    authentication.signOut()
    appProps.signedInUserChanged()
    history.push(signinUrl ? signinUrl : "/Signin")
  }

  return(<div></div>)
}

export default LFBSSignout
