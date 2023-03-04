import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { APP_ENV } from "../../../../env";

const GoogleAuth = () => {

    const navigator = useNavigate();

  const handleLogin = (resp: any) => {
    navigator("/signup/"+resp!.credential);
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
