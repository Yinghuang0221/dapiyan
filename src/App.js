// import logo from "./logo.svg";
import "./App.css";
import CafeMap from "./map/map.js";
import "antd/dist/antd.min.css";
import { useState } from "react";
import HomePage from "./homepage/HomePage.js";

const App = () => {
  const [signedIn, setSignedIn] = useState(false);

  const handleSignIn = () => {
    setSignedIn(true);
  };

  return (
    <>
      {!signedIn ? (
        <HomePage handleSignIn={handleSignIn} />
      ) : (
        <div className="App">
          <CafeMap />
        </div>
      )}
    </>
  );
};

export default App;
