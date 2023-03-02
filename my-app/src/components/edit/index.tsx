import React, {
  ChangeEvent,
  MouseEventHandler,
  useEffect,
  useState,
} from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import select from "../../assets/select.jpg";
import { useNavigate } from "react-router-dom";

interface IUserEdit {
  id: number;
  name: string;
  description: string;
  image: string | null;
  file: File | null;
}

const EditPage = () => {
  const [state, setState] = useState<IUserEdit>({
    id: 0,
    name: "",
    description: "",
    image: null,
    file: null,
  });

  const { id } = useParams();

  useEffect(() => {
    axios.get<IUserEdit>("http://localhost:5000/api/categories/" + id).then((resp) => {
      setState(resp.data);
    });
  }, []);

  const onDeleteImageHandler = () => {
    setState({ ...state, image: null, file: null });
  };

  const onFileChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const { target } = e;
    const { files } = target;

    if (files) {
      const file = files[0];
      setState({ ...state, file: file });
    }

    target.value = "";
  };

  const onChangeHandler = (
    e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>
  ) => {
    setState({ ...state, [e.target.name]: e.target.value });
  };

  const navigator = useNavigate();

  const onSubmitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (state.name) {
      axios
        .put("http://localhost:5000/api/categories", state, {
          headers: { "Content-Type": "multipart/form-data" },
        })
        .then((response) => {
          navigator("/");
        })
        .catch((error) => {});
    }
  };

  return (
    <>
      <form className="offset-3 col-6" onSubmit={onSubmitHandler}>
        <h1 className="mb-4">Edit Category</h1>
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
        <button
          id="removeImage"
          onClick={onDeleteImageHandler}
          className={
            "btn btn-danger mb-3 " +
            (state.file != null || state.image ? "" : "d-none")
          }
          type="button"
        >
          Видалити фотографію
        </button>
        <div className="mb-3">
          <label htmlFor="image" className="form-label">
            <img
              src={
                state.file == null
                  ? state.image
                    ? "http://localhost:5000/images/" + state.image
                    : select
                  : URL.createObjectURL(state.file)
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
        <button type="submit" className="btn btn-warning">
          Edit
        </button>
        <Link to="/" className="btn btn-link">
          Back to list
        </Link>
      </form>
    </>
  );
};
export default EditPage;
