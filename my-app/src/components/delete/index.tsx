import React, {
  ChangeEvent,
  useEffect,
  useState,
} from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import select from "../../assets/select.jpg";
import { useNavigate } from "react-router-dom";

interface IUserItem {
  id: number;
  name: string;
  description: string;
  image: string | null;
}

const DeletePage = () => {
  const [state, setState] = useState<IUserItem>({
    id: 0,
    name: "",
    description: "",
    image: null,
  });

  const { id } = useParams();

  useEffect(() => {
    axios.get<IUserItem>("http://localhost:5000/api/categories/" + id).then((resp) => {
      setState(resp.data);
    });
  }, []);

  const onChangeHandler = (
    e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>
  ) => {
    setState({ ...state, [e.target.name]: e.target.value });
  };

  const navigator = useNavigate();

  const onSubmitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (state.name) {
      axios.delete("http://localhost:5000/api/categories/" + id).then((response) => {
        navigator("/");
      });
    }
  };

  return (
    <>
      <div className="container offset-3 col-6">
        <h1>Delete Item</h1>

        <table className="table table-striped">
          <thead className="table-light">
            <tr>
              <th scope="col">#</th>
              <th scope="col">Image</th>
              <th scope="col">Name</th>
              <th scope="col">Description</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">{state.id}</th>
              <td>
                <img
                  src={
                    state.image
                      ? "http://localhost:5000/images/" + state.image
                      : select
                  }
                  alt=""
                  width="150"
                />
              </td>
              <td>{state.name}</td>
              <td>{state.description}</td>
            </tr>
          </tbody>
        </table>

        <p>Are you sure you want to delete this item?</p>
        <form onSubmit={onSubmitHandler}>
          <button type="submit" className="btn btn-danger">
            Delete
          </button>
          <Link to="/" className="btn btn-secondary ms-1">
            Cancel
          </Link>
        </form>
      </div>
    </>
  );
};
export default DeletePage;
