import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { useState } from "react";
import { Checkbox } from "primereact/checkbox";
import { Link } from "react-router-dom";
import { Password } from "primereact/password";

const LoginPage = () => {
  const [checked, setChecked] = useState(false);

  return (
    <>
      <form>
        <div className="block-center">
          <div className="px-4 py-8 md:px-6 lg:px-8 flex align-items-center justify-content-center">
            <div className="surface-card p-4 shadow-2 border-round w-full lg:w-6">
              <div className="text-center mb-5">
                <img
                  src="logo192.png"
                  alt="logo"
                  height={50}
                  className="mb-3"
                />
                <div className="text-900 text-3xl font-medium mb-3">
                  Welcome Back
                </div>
                <span className="text-600 font-medium line-height-3">
                  Don't have an account?
                </span>
                <Link
                  to="/signup"
                  className="font-medium no-underline ml-2 text-blue-500 cursor-pointer"
                >
                  Create today!
                </Link>
              </div>

              <div>
                <span className="p-float-label">
                  <InputText
                    type="email"
                    id="email"
                    name="email"
                    className="w-full"
                  />
                  <label htmlFor="email">Email</label>
                </span>

                <span className="p-float-label mt-4">
                  <Password
                    name="password"
                    id="password"
                    className="w-full"
                    inputClassName="w-full"
                    feedback={false}
                    toggleMask
                  />
                  <label htmlFor="password">Password</label>
                </span>

                <div className="flex align-items-center justify-content-between mb-6 mt-3">
                  <div className="flex align-items-center">
                    <Checkbox
                      id="rememberme"
                      onChange={(e) => setChecked(e.checked ? true : false)}
                      checked={checked}
                      className="mr-2"
                    />
                    <label htmlFor="rememberme">Remember me</label>
                  </div>
                  <a className="font-medium no-underline ml-2 text-blue-500 text-right cursor-pointer">
                    Forgot your password?
                  </a>
                </div>

                <div className="formgrid grid mt-3">
                  <div className="field col">
                    <Button
                      label="Sign In"
                      icon="pi pi-user"
                      className="w-full"
                    />
                  </div>
                  <div className="field col">
                    <Button
                      type="button"
                      label="Sign In with Google"
                      icon="pi pi-google"
                      className="w-full"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </>
  );
};

export default LoginPage;
