import jwt from "jwt-decode";
import { AuthActionType, IAuthUser } from "./types";

const decoded: any =
  localStorage.token != undefined ? jwt(localStorage?.token) : undefined;

const initState: IAuthUser = {
  isAuth: decoded != undefined,
  username: decoded?.name || "",
  image: decoded?.image || "",
  roles: decoded?.roles || ""
};

export const AuthReducer = (state = initState, action: any) => {
  switch (action.type) {
    case AuthActionType.USER_LOGIN:
      const dec: any = jwt(localStorage?.token);
      return {
        ...state,
        isAuth: true,
        username: dec?.name,
        image: dec?.image,
        roles: dec?.roles
      };
    case AuthActionType.USER_LOGOUT:
      return {
        ...state,
        isAuth: false,
        username: "",
        image: "",
        roles: ""
      };
  }
  return state;
};
