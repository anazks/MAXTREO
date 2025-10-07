import React, { useEffect } from 'react'
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';

function GoogleAuth() {
    useEffect(()=>{
        console.log("----------")
    },[])
  return (
    <div>
        <GoogleOAuthProvider clientId="69145476126-31qfbt7ehrgopm6uka09end6hchl2e4j.apps.googleusercontent.com">
      <div>
        <h2>Login with Google</h2>
        <GoogleLogin
          onSuccess={credentialResponse => {
            console.log(credentialResponse);
          }}
          onError={() => {
            console.log('Login Failed');
          }}
        />
      </div>
    </GoogleOAuthProvider>
    </div>
  )
}

export default GoogleAuth
