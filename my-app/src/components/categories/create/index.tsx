import { ChangeEvent, useRef, useState } from "react";
import {  useNavigate } from "react-router-dom";
import select from "../../../assets/select.jpg";
import { InputTextarea } from "primereact/inputtextarea";
import { Image } from "primereact/image";
import { FileUpload, FileUploadUploadEvent } from "primereact/fileupload";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { IResponseImage } from "../../auth/register";
import { APP_ENV } from "../../../env";
import http from "../../../http";

interface IUserCreate {
  name: string;
  description: string;
  image: string;
}

const CreatePage = () => {
  const [state, setState] = useState<IUserCreate>({
    name: "",
    description: "",
    image: "",
  });

  const onChangeHandler = (
    e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>
  ) => {
    setState({ ...state, [e.target.name]: e.target.value });
  };

  const onSubmitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (state.name && state.image) {
      console.log(state);
      const token = localStorage.getItem("token");
      http
        .post("api/categories", state, {
          headers: {
            "Authorization": `Bearer ${token}`
          },
        })
        .then((response) => {
          setState({
            name: "",
            description: "",
            image: "",
          });
          toast.current?.show({
            severity: "success",
            summary: "Success",
            detail: "Successfuly created category",
          });
        });
    } else {
      toast.current?.show({
        severity: "info",
        summary: "Info",
        detail: "Name and Image is required",
      });
    }
  };

  const toast = useRef<Toast>(null);

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

  const navigator = useNavigate();

  return (
    <>
      <form onSubmit={onSubmitHandler}>
        <div className="block-center">
          <div className="px-4 py-8 md:px-6 lg:px-8 flex align-items-center justify-content-center">
            <div className="surface-card p-4 shadow-2 border-round w-full lg:w-6">
              <div className="text-center mb-5">
                <div className="text-900 text-3xl font-medium mb-3">
                  Create Category
                </div>
              </div>

              <div className="formgrid grid">
                <div className="field col-4">
                  <Image
                    src={
                      state.image
                        ? APP_ENV.IMAGE_PATH + state.image
                        : select
                    }
                    alt="Avatar"
                    width="250"
                    preview
                  />
                </div>
                <div className="field col">
                  <span className="p-float-label mt-4">
                    <InputText
                      value={state.name}
                      onChange={onChangeHandler}
                      id="name"
                      name="name"
                      className="w-full"
                    />
                    <label htmlFor="firstname">Name</label>
                  </span>
                  <span className="p-float-label mt-4">
                    <InputTextarea
                      value={state.description}
                      rows={5}
                      cols={30}
                      onChange={onChangeHandler}
                      id="description"
                      name="description"
                      className="w-full"
                    />
                    <label htmlFor="lastname">Description</label>
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
              <div className="formgrid grid mt-3">
                <div className="field col">
                  <Button
                    severity="success"
                    label="Create"
                    icon="pi pi-plus"
                    className="w-full"
                  />
                </div>
                <div className="field col">
                  <Button
                    onClick={() => navigator("/categories")}
                    type="button"
                    label="Back to list"
                    icon="pi pi-chart-bar"
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
export default CreatePage;
