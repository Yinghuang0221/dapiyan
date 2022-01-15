import React from "react";
import { GoogleLogin } from "react-google-login";
import axios from "../api";
import { useState } from "react";



const HomePage = ({handleSignIn}) => {





    const responseGoogle = (response) => {
        console.log(response);
        const { code } = response;
        axios
          .post("/api/create-tokens", { code })
          .then((response) => {
            console.log(response.data);
            handleSignIn()

          })
          .catch((error) => console.log(error.message));
      };
    
      const responseError = (error) => {
        console.log(error);
      };
    
    return(
        <div>
          <GoogleLogin
            clientId="824943228622-9cffm6j6jboi5v04j7o1sla2rvekva0k.apps.googleusercontent.com"
            buttonText="登入"
            onSuccess={responseGoogle}
            onFailure={responseError}
            cookiepolicy={"single_host_origin"}
            responseType="code"
            accessType="offline"
            scope="openid email profile https://www.googleapis.com/auth/calendar"
          />
        </div>
    )

}

export default HomePage