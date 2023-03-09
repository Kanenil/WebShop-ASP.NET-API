import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Image } from "primereact/image";
import { FileUpload, FileUploadUploadEvent } from "primereact/fileupload";
import { Toast } from "primereact/toast";

import { useState, useRef, ChangeEvent } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import http from "../../../http";
import { useDispatch } from "react-redux";
import { AuthActionType } from "../types";
import { APP_ENV } from "../../../env";

export interface IResponseImage {
  image: string;
}

interface IRegisterUser {
  firstName: string;
  lastName: string;
  image: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const RegisterPage = () => {
  const [user, setUser] = useState<IRegisterUser>({
    firstName: "",
    lastName: "",
    image: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const toast = useRef<Toast>(null);

  const onUpload = (e: FileUploadUploadEvent) => {
    const { xhr } = e;
    xhr.onloadend = () => {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          const response: IResponseImage = JSON.parse(xhr.responseText);
          setUser({ ...user, image: response.image });
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

  const navigator = useNavigate();
  const dispatch = useDispatch();

  const Validate = () => {
    if (!user.firstName) return false;
    if (!user.lastName) return false;
    if (!user.image) return false;
    if (!user.password) return false;
    if (!user.confirmPassword) return false;
    if (user.password.length < 5) return false;
    if (user.password !== user.confirmPassword) return false;

    return true;
  };

  const onSubmitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (Validate()) {
      http
        .post("api/Account/register", user)
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

  return (
    <form onSubmit={onSubmitHandler}>
      <div className="block-center">
        <div className="px-4 py-8 md:px-6 lg:px-8 flex align-items-center justify-content-center">
          <div className="surface-card p-4 shadow-2 border-round w-full lg:w-5">
            <div className="text-center mb-5">
              <img src="logo192.png" alt="logo" height={50} className="mb-3" />
              <div className="text-900 text-3xl font-medium mb-3">
                Registration
              </div>
            </div>

            <div className="formgrid grid">
              <div className="field col-5">
                <Image
                  src={
                    user.image
                      ? APP_ENV.IMAGE_PATH + user.image
                      : "logo192.png"
                  }
                  alt="Avatar"
                  width="250"
                  preview
                />
              </div>
              <div className="field col">
                <span className="p-float-label mt-4">
                  <InputText
                    value={user.firstName}
                    onChange={onChangeHandler}
                    id="firstname"
                    name="firstName"
                    className="w-full"
                  />
                  <label htmlFor="firstname">Firstname</label>
                </span>
                <span className="p-float-label mt-4">
                  <InputText
                    value={user.lastName}
                    onChange={onChangeHandler}
                    id="lastname"
                    name="lastName"
                    className="w-full"
                  />
                  <label htmlFor="lastname">Lastname</label>
                </span>
                <Toast ref={toast}></Toast>
                <FileUpload
                  className="mt-4"
                  mode="basic"
                  name="image"
                  url={APP_ENV.IMAGE_UPLOAD_PATH}
                  accept="image/*"
                  maxFileSize={1000000}
                  onUpload={onUpload}
                  auto
                  chooseLabel="Select Image"
                  multiple={false}
                />
              </div>
            </div>

            <div className="mt-3">
              <span className="p-float-label">
                <InputText
                  type="email"
                  value={user.email}
                  onChange={onChangeHandler}
                  id="email"
                  name="email"
                  className="w-full"
                />
                <label htmlFor="email">Email</label>
              </span>
            </div>

            <div className="formgrid grid mt-4">
              <div className="field col">
                <span className="p-float-label">
                  <Password
                    value={user.password}
                    onChange={onChangeHandler}
                    name="password"
                    id="password"
                    inputClassName="w-full"
                    className="w-full"
                    toggleMask
                  />
                  <label htmlFor="password">Password</label>
                </span>
              </div>
              <div className="field col">
                <span className="p-float-label">
                  <Password
                    value={user.confirmPassword}
                    onChange={onChangeHandler}
                    name="confirmPassword"
                    id="confirmPassword"
                    inputClassName="w-full"
                    className="w-full"
                    toggleMask
                  />
                  <label htmlFor="confirmpassword">Confirm Password</label>
                </span>
              </div>
            </div>

            <div className="formgrid grid mt-3">
              <div className="field col">
                <Button
                  type="submit"
                  label="Sign Up"
                  icon="pi pi-user"
                  className="w-full"
                />
              </div>
              <div className="field col">
                <Button
                  label="Login"
                  icon="pi pi-sign-in"
                  className="w-full"
                  onClick={() => navigator("/login")}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

export default RegisterPage;
