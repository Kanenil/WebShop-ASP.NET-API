import { Outlet, Link } from "react-router-dom";
import { Menubar } from 'primereact/menubar';
import { MenuItem } from 'primereact/menuitem';
import '../nav/navbar.css';






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

export const NavBar = () => {

  const items: MenuItem[] = [
    {
        label: 'Categories',
        icon: 'pi pi-fw pi-database',
        items: [
            {
                label: 'New',
                icon: 'pi pi-fw pi-plus',
                url:"/categories/create"
            },
            {
                label: 'List',
                icon: 'pi pi-fw pi-briefcase',
                url:"/"
            }
        ]
    }
];

const start = [
  {
    label: "Home",
    icon: "pi pi-fw pi-home",
    url: "/",
  },
];

const end = 
 [
   {
     label: "Login",
     icon: "pi pi-fw pi-sign-in",
     url: "/login",
  },
   {
     label: "Sign Up",
     icon: "pi pi-fw pi-user-plus",
     url: "/signup",
   },
 ];

const menuItems = [...start, ...items, ...end];

return (
<>
<div className="navbar-wrapper">
    <div className="navbar-container">
      <Menubar model={menuItems} className="w-full"/>
    </div>
  </div>
  <Outlet />
</>

  
);
}
      

export default { NavBar, NoMatch };


