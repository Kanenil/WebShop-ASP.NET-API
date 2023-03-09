export interface IAuthUser {
    image: string,
    roles:string,
    username: string,
    isAuth: boolean
};

export enum AuthActionType {
    USER_LOGIN="USER_LOGIN_ACTION",
    USER_LOGOUT="USER_LOGOUT_ACTION"
}