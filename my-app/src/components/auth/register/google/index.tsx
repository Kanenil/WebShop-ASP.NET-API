import { useNavigate, useParams } from "react-router-dom";
import "../../../categories/home/index.css";
import jwt from "jwt-decode";
import { Button } from "primereact/button";
import { Image } from "primereact/image";
import { InputText } from "primereact/inputtext";
import { FileUpload, FileUploadUploadEvent } from "primereact/fileupload";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { IResponseImage } from "..";
import { Toast } from "primereact/toast";
import axios from "axios";
import http from "../../../../http";
import { useDispatch } from "react-redux";
import { AuthActionType } from "../../types";
import { APP_ENV } from "../../../../env";

interface IGoogleJWT
{
    given_name: string;
    family_name: string;
    picture: string;
    email: string;
    sub: string;
}

interface IGoogleRegisterUser
{
    firstName: string;
    lastName: string;
    image: string;
    token:string;
}

const GoogleRegister = () => {
  let { info } = useParams();

  useEffect(() => {
    const decodeJWT = jwt<IGoogleJWT>(info as string);
    setState({
      firstName: decodeJWT.given_name,
      lastName: decodeJWT.family_name,
      image: decodeJWT.picture,
      token: info as string,
    });
  }, []);

  const toast = useRef<Toast>(null);

  const [state, setState] = useState<IGoogleRegisterUser>({
    firstName:"",
    lastName:"",
    image:"",
    token:""
  });

  const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setState({ ...state, [e.target.name]: e.target.value });
  };

  const navigator = useNavigate();
  const dispatch = useDispatch();

  const onUpload = (e: FileUploadUploadEvent) => {
    const { xhr } = e;
    xhr.onloadend = () => {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          const response: IResponseImage = JSON.parse(xhr.responseText);
          setState({ ...state, image: response.image });
          toast.current?.show({
            severity: "success",
            summary: "Success",
            detail: `Image '${response.image}' Uploaded`,
          });
        } else {
            toast.current?.show({
                severity: "error",
                summary: "Fail",
                detail: "Upload image failed",
              });
        }
      }
    };
  };

  const Validate = () => {
    if (!state.firstName) return false;
    if (!state.lastName) return false;
    if (!state.image) return false;

    return true;
  };

  const onSubmitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (Validate()) {
      http
        .post("api/Account/google/register", state)
        .then((resp) => {
          const { token } = resp.data;
        localStorage.setItem("token", token);
        http.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        dispatch({type: AuthActionType.USER_LOGIN});
          navigator("/");
        })
        .catch((error) => {
          toast.current?.show({
            severity: "error",
            summary: "Fail",
            detail: `Error: ${error}`,
          });
        });
    } else {
      toast.current?.show({
        severity: "info",
        summary: "Info",
        detail: "All field should be filled and image must be selected",
      });
    }
  };

  const expression = /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$/;
  const regex = new RegExp(expression);

  return (
    <>
      <form onSubmit={onSubmitHandler}>
        <div className="block-center">
          <div className="px-4 py-8 md:px-6 lg:px-8 flex align-items-center justify-content-center">
            <div className="surface-card p-4 shadow-2 border-round w-full lg:w-6">
              <div className="text-center mb-5">
                <img
                  src="/logo192.png"
                  alt="logo"
                  height={50}
                  className="mb-3"
                />
                <div className="text-900 text-3xl font-medium mb-3">
                  Finish Registration
                </div>
              </div>

              <div className="formgrid grid">
                <div className="field col-1">
                  <Image
                    src={state.image.match(regex)?state.image: APP_ENV.IMAGE_PATH + state.image}
                    alt="Avatar"
                    width="250"
                    preview
                  />
                </div>
                <div className="field col col-offset-3">
                  <span className="p-float-label mt-4">
                    <InputText
                      value={state.firstName}
                      onChange={onChangeHandler}
                      id="firstname"
                      name="firstName"
                      className="w-full"
                    />
                    <label htmlFor="firstname">Firstname</label>
                  </span>
                  <span className="p-float-label mt-4">
                    <InputText
                      value={state.lastName}
                      onChange={onChangeHandler}
                      id="lastname"
                      name="lastName"
                      className="w-full"
                    />
                    <label htmlFor="lastname">Lastname</label>
                  </span>
                  <FileUpload
                    className="mt-4"
                    mode="basic"
                    name="image"
                    url={APP_ENV.IMAGE_UPLOAD_PATH}
                    accept="image/*"
                    maxFileSize={1000000}
                    onUpload={onUpload}
                    auto
                    chooseLabel="Change Image"
                    multiple={false}
                  />
                </div>
              </div>

              <div className="formgrid grid mt-3">
                <div className="field col">
                  <Button
                    label="Finish Registration"
                    icon="pi pi-user"
                    className="w-full"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </>
  );
};

export default GoogleRegister;
