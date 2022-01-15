import React from "react";
import { GoogleLogin } from "react-google-login";
import axios from "./api";
import { useState } from "react";
import Background from '../coffee.jpg'
import {Layout} from 'antd'
import APPHeader from "./Header";
import "./homepage.css"
import { Carousel } from "antd";

const { Header, Content } = Layout

const items = [
  {
      key:"1",
      title:"想去哪裡讀書呢？",
      content: "柏廷屁眼好大"
  },

  {
      key:"2",
      title:"想去哪裡讀書呢？",
      content: "好想跟柏廷做愛"
  },
  {
      key:"3",
      title:"想去哪裡讀書呢？",
      content: "柏廷好色"
  }



]






const HomePage = ({ handleSignIn }) => {

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


  return (

    <Layout className="mainLayout">
      <Header>
        <APPHeader/>
      </Header>
      <Content>
        
        <div className="main">
          <div className="heroBlock">
            <Carousel   >
                {items.map(item => {
                    return(
                        <div className="container-fluid">
                            <div className="content">
                                <h3>{item.title}</h3>
                                <p>{item.content}</p>
                                <GoogleLogin
                                    clientId="824943228622-9cffm6j6jboi5v04j7o1sla2rvekva0k.apps.googleusercontent.com"
                                    buttonText="點我登入Google帳戶"
                                    onSuccess={responseGoogle}
                                    onFailure={responseError}
                                    cookiepolicy={"single_host_origin"}
                                    responseType="code"
                                    accessType="offline"
                                    scope="openid email profile https://www.googleapis.com/auth/calendar"
                                    />
                            </div>
                        </div>
                    )
                })}
            </Carousel>
        </div>
        </div>
      </Content>
    </Layout>
  );
};

        /* <div>
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
        </div> */
export default HomePage;
