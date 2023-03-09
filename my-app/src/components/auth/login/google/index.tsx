import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { APP_ENV } from "../../../../env";
import http from "../../../../http";
import { useDispatch } from "react-redux";
import { AuthActionType } from "../../types";

const GoogleAuth = () => {

    const navigator = useNavigate();
    const dispatch = useDispatch();

  const handleLogin = (resp: any) => {
    const token = resp!.credential as string;
    http.post('api/account/google/login', token, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then((resp)=>{
      const { token } = resp.data;
        localStorage.setItem("token", token);
        http.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        dispatch({type: AuthActionType.USER_LOGIN});
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
