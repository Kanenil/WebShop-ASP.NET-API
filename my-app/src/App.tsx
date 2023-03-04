import React from "react";
import logo from "./logo.svg";
import "./App.css";
import HomePage from "./components/home";
import CreatePage from "./components/create";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import { NavBar, NoMatch } from "./components/nav";
import EditPage from "./components/edit";
import RegisterPage from "./components/auth/register";
import LoginPage from "./components/auth/login";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<NavBar />}>
            <Route index element={<HomePage />} />
            <Route path="categories/create" element={<CreatePage />} />
            <Route path="signup" element={<RegisterPage />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="categories/edit" >
              <Route path=":id" element={<EditPage />} />
            </Route>
            <Route path="*" element={<NoMatch />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
