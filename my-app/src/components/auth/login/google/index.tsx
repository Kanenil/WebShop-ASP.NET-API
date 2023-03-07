import axios from "axios";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { APP_ENV } from "../../../../env";

const GoogleAuth = () => {

    const navigator = useNavigate();

  const handleLogin = (resp: any) => {
    const token = resp!.credential as string;
    axios.post("http://localhost:5000/api/account/google/login", token, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then((resp)=>{
      localStorage.setItem("token", resp.data!.token);
      navigator("/");
    }).catch((error)=>{
      navigator("/signup/" + token);
    });
  };

  useEffect(() => {
    window.google.accounts!.id.initialize({
      client_id: APP_ENV.GOOGLE_CLIENT_ID,
      callback: handleLogin,
    });
    window.google.accounts.id.renderButton(
      document.getElementById("googleButton"),
      {
        theme: "outline",
        size: "large",
        type: "standart",
      }
    );
  }, []);


  return (
    <>
      <span id="googleButton"></span>
    </>
  );
};

export default GoogleAuth;
