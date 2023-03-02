import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import select from "../../assets/select.jpg";

interface IUserItem {
  id: number;
  name: string;
  description: string;
  image: string;
}

const HomePage = () => {
  const [users, setUsers] = useState<Array<IUserItem>>([]);

  useEffect(() => {
    axios
      .get<Array<IUserItem>>("http://localhost:5000/api/categories")
      .then((resp) => {
        setUsers(resp.data);
      });
  }, []);

  const content = users.map((user) => (
    <tr key={user.id}>
      <th scope="row">{user.id}</th>
      <td>
        <img
          src={
            user.image ? "http://localhost:5000/images/" + user.image : select
          }
          alt=""
          width="150"
        />
      </td>
      <td>{user.name}</td>
      <td>{user.description}</td>
      <td>
        <Link to={"/edit/" + user.id} className="btn btn-warning">
          Edit
        </Link>
        <Link to={"/delete/" + user.id} className="btn btn-danger ms-1">
          Delete
        </Link>
      </td>
    </tr>
  ));

  return (
    <>
      <div className="container">
        <h1 className="text-center">Home Page</h1>
        <table className="table table-striped">
          <thead className="table-light">
            <tr>
              <th scope="col">#</th>
              <th scope="col">Image</th>
              <th scope="col">Name</th>
              <th scope="col">Description</th>
              <th scope="col"></th>
            </tr>
          </thead>
          <tbody>{content}</tbody>
        </table>
      </div>
    </>
  );
};
export default HomePage;
