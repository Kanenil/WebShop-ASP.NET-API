import { Outlet, Link, useNavigate } from "react-router-dom";
import { Menubar } from "primereact/menubar";
import { MenuItem } from "primereact/menuitem";
import "../nav/navbar.css";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AuthActionType, IAuthUser } from "../auth/types";

import { Avatar } from "primereact/avatar";
import { TieredMenu } from "primereact/tieredmenu";
import { APP_ENV } from "../../env";
import { Button } from "primereact/button";

export const NoMatch = () => {
  return (
    <div className="text-center">
      <h2>Nothing to see here!</h2>
      <p>
        <Link to="/">Go to the home page</Link>
      </p>
    </div>
  );
};

export const Logout = () => {
  const navigator = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    localStorage.removeItem("token");
    dispatch({ type: AuthActionType.USER_LOGOUT });
    navigator("/");
  }, []);

  return <></>;
};

export const NavBar = () => {
  const { isAuth, roles } = useSelector((store: any) => store.auth as IAuthUser);
  const navigator = useNavigate();

  const items: MenuItem[] = [
    {
      label: "Categories",
      icon: "pi pi-fw pi-database",
      visible:roles.includes("admin"),
      items: [
        {
          label: "New",
          icon: "pi pi-fw pi-plus",
          url: "/categories/create",
        },
        {
          label: "List",
          icon: "pi pi-fw pi-briefcase",
          url: "/categories",
        },
      ],
    },
  ];

  const start = [
    {
      label: "Home",
      icon: "pi pi-fw pi-home",
      url: "/",
    },
  ];

  const end = isAuth ? (
    <AvatarMenu />
  ) : (
    <>
      <Button
        label="Login"
        severity="secondary"
        icon="pi pi-fw pi-sign-in"
        text
        onClick={() => navigator("/login")}
      />
      <Button
        label="Sign Up"
        severity="secondary"
        icon="pi pi-fw pi-user-plus"
        text
        onClick={() => navigator("/signup")}
      />
    </>
  );

  const menuItems = [...start, ...items];

  return (
    <>
      <div className="navbar-wrapper">
        <div className="navbar-container">
          <Menubar model={menuItems} end={end} className="w-full" />
        </div>
      </div>
      <Outlet />
    </>
  );
};

const AvatarMenu = () => {
  const menu = useRef<TieredMenu>(null);
  const user = useSelector((store: any) => store.auth as IAuthUser);

  const items = [
    {
      label: "Profile",
      icon: "pi pi-user",
    },
    {
      label: "Settings",
      icon: "pi pi-cog",
    },
    {
      label: "Logout",
      icon: "pi pi-power-off",
      url: "/logout",
    },
  ];

  const expression =
    /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$/;
  const regex = new RegExp(expression);

  return (
    <div
      className="flex align-items-center"
      onClick={(e) => menu.current?.toggle(e)}
      style={{ cursor: "pointer" }}
    >
      <Avatar
        image={
          user.image?.match(regex)
            ? user.image
            : APP_ENV.IMAGE_PATH + user.image
        }
        size="large"
        shape="circle"
      />
      <TieredMenu model={items} ref={menu} popup />
      <span className="ml-2 mr-2">{user.username}</span>
    </div>
  );
};

export default { NavBar, NoMatch };
