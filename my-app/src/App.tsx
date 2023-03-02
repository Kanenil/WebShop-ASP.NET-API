import React from "react";
import logo from "./logo.svg";
import "./App.css";
import HomePage from "./components/home";
import CreatePage from "./components/create";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import { Layout, NoMatch } from "./components/nav";
import EditPage from "./components/edit";
import DeletePage from "./components/delete";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="create" element={<CreatePage />} />
            <Route path="edit" >
              <Route path=":id" element={<EditPage />} />
            </Route>
            <Route path="delete" >
              <Route path=":id" element={<DeletePage />} />
            </Route>
            <Route path="*" element={<NoMatch />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
