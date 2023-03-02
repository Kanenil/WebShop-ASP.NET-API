import { ChangeEvent, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import select from "../../assets/select.jpg";

interface IUserCreate {
  name: string;
  description: string;
  image: File | null;
}

interface IMessageAlert {
  name: string;
  class: string;
  button: string;
}

const CreatePage = () => {
  const [state, setState] = useState<IUserCreate>({
    name: "",
    description: "",
    image: null,
  });

  const [message, setMessage] = useState<IMessageAlert>({
    name: "",
    class: "",
    button: "d-none",
  });

  const messageContent = (
    <>
      <div className={message.class} role="alert">
        {message.name}
        <button
          type="button"
          className={message.button}
          data-bs-dismiss="alert"
          aria-label="Close"
        ></button>
      </div>
    </>
  );

  const onFileChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const {target} = e;
    const {files} = target;
    
    if(files) {
      const file = files[0];
      setState({...state, image: file});
    }

    console.log(target, files);
    

    target.value="";
  }

  const onChangeHandler = (
    e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>
  ) => {
    setState({ ...state, [e.target.name]: e.target.value });
  };

  const onSubmitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (state.name && state.image) {
      axios
        .post("http://localhost:5000/api/categories", state, {
          headers: { "Content-Type": "multipart/form-data" }
        })
        .then((response) => {
          setMessage({
            name: "Succesfuly created",
            class: "alert alert-success alert-dismissible",
            button: "btn-close",
          });
          setState({
            name: "",
            description: "",
            image: null,
          });
        })
        .catch((error) => {
          setMessage({
            name: "Something went wrong",
            class: "alert alert-danger alert-dismissible",
            button: "btn-close",
          });
        });
    }
  };

  return (
    <>
      <form className="offset-3 col-6" onSubmit={onSubmitHandler}>
        <h1 className="mb-4">Create Category</h1>
        {messageContent}
        <div className="mb-3">
          <label htmlFor="name" className="form-label">
            Name
          </label>
          <input
            type="text"
            value={state.name}
            onChange={onChangeHandler}
            className="form-control required"
            id="name"
            name="name"
          />
        </div>
        <div className="mb-3">
          <label htmlFor="description" className="form-label">
            Description
          </label>
          <textarea
            className="form-control"
            id="description"
            name="description"
            value={state.description}
            onChange={onChangeHandler}
          ></textarea>
        </div>
        <div className="mb-3">
          <label htmlFor="image" className="form-label">
            <img
              src={
                state.image == null ? select : URL.createObjectURL(state.image)
              }
              alt="Оберіть фото"
              width="150px"
              style={{ cursor: "pointer" }}
            />
          </label>
          <input
            type="file"
            className="d-none"
            accept="image/png, image/jpeg"
            id="image"
            name="image"
            onChange={onFileChangeHandler}
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Create
        </button>
        <Link to="/" className="btn btn-link">
          Back to list
        </Link>
      </form>
    </>
  );
};
export default CreatePage;
