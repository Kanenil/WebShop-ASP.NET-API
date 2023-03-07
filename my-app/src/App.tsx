import React from "react";
import logo from "./logo.svg";
import "./App.css";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import { Logout, NavBar, NoMatch } from "./components/nav";
import RegisterPage from "./components/auth/register";
import LoginPage from "./components/auth/login";
import GoogleRegister from "./components/auth/register/google";
import CreatePage from "./components/categories/create";
import CategoriesPage from "./components/categories/home";
import EditPage from "./components/categories/edit";
import HomePage from "./components/home";

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
            <Route path="categories" element={<CategoriesPage />} />
            <Route path="logout" element={<Logout />} />
            <Route path="signup" >
              <Route path=":info" element={<GoogleRegister />} />
            </Route>
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
