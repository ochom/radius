import React from "react";
import { useState } from "react";
import { Redirect } from "react-router-dom";
import Swal from "sweetalert2";
import { Login } from "../../API/auth";

import { Response } from "../../Models/common";

import "./auth.css";

const Auth = () => {
  const [login, setLogin] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: any) => {
    e.preventDefault();
    Login({ email, password }).then((res: Response) => {
      if (res.status === 200) {
        localStorage.setItem("authUser", JSON.stringify(res.data));
        AlertSuccess(res.message);
        setIsLoggedIn(true);
      } else {
        AlertFailed(res.message);
      }
    });
  };

  if (isLoggedIn) {
    return <Redirect to="/" />;
  }

  const AlertSuccess = (message: string) => {
    Swal.fire({
      position: "top-end",
      icon: "success",
      title: message,
      showConfirmButton: false,
      timer: 1500,
    });
  };

  const AlertFailed = (message: any) => {
    Swal.fire({
      icon: "error",
      title: message,
      showConfirmButton: true,
      confirmButtonText: "Try again",
    });
  };

  return (
    <div className="container">
      <div className="login-container">
        <div className="row col-12 bg-white mx-0 px-0">
          <div className="col-6 mx-0 p-0">
            <div className="card h-100 bg-primary rounded-0"></div>
          </div>
          {login ? (
            <div className="col-5 mx-auto">
              <div className="card card-body p-5 border-0">
                <h3 className="text-center my-4">Login</h3>
                <form onSubmit={handleLogin}>
                  <div className="row mt-3">
                    <div className="form-group">
                      <label>Email</label>
                      <input
                        type="email"
                        name="email"
                        onChange={(e) => setEmail(e.target.value)}
                        className="form-control mt-2"
                      />
                    </div>
                  </div>
                  <div className="row mt-3">
                    <div className="form-group">
                      <label>Password</label>
                      <input
                        type="password"
                        name="password"
                        onChange={(e) => setPassword(e.target.value)}
                        className="form-control mt-2"
                      />
                    </div>
                  </div>
                  <div className="row mt-3">
                    <div className="d-grid gap-2 d-md-flex justify-content-md-between">
                      <a href="/forgot-password">Forgot password?</a>
                      <button
                        type="button"
                        className="btn text-success"
                        onClick={() => setLogin(!login)}
                      >
                        Don't have account?
                      </button>
                    </div>
                  </div>

                  <div className="row mt-3 mb-4">
                    <div className="d-grid">
                      <button type="submit" className="btn btn-lg btn-primary">
                        Login
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          ) : (
            <div className="col-6 mx-auto">
              <div className="card card-body p-5 border-0">
                <h3 className="text-center my-4">
                  Create a new School Profile
                </h3>
                <form>
                  <div className="row">
                    <div className="form-group col-6">
                      <label>First name</label>
                      <input
                        type="text"
                        name="firstName"
                        className="form-control"
                      />
                    </div>
                    <div className="form-group col-6">
                      <label>Last name</label>
                      <input
                        type="text"
                        name="lastName"
                        className="form-control"
                      />
                    </div>
                  </div>
                  <div className="row mt-3">
                    <div className="form-group">
                      <label>Mobile</label>
                      <input
                        type="text"
                        name="mobile"
                        className="form-control"
                      />
                    </div>
                  </div>
                  <div className="row mt-3">
                    <div className="form-group">
                      <label>Email</label>
                      <input
                        type="email"
                        name="email"
                        className="form-control"
                      />
                    </div>
                  </div>
                  <div className="row mt-3">
                    <div className="form-group col-6">
                      <label>Password</label>
                      <input
                        type="password"
                        name="password"
                        className="form-control"
                      />
                    </div>
                    <div className="form-group col-6">
                      <label>Confirm password</label>
                      <input
                        type="password"
                        name="confirmPassword"
                        className="form-control"
                      />
                    </div>
                  </div>

                  <div className="row mt-5">
                    <div className="form-group">
                      <label>School name</label>
                      <input type="text" className="form-control" />
                    </div>
                  </div>

                  <div className="row mt-3">
                    <div className="form-group">
                      <label>Alias</label>
                      <input type="text" className="form-control" />
                    </div>
                  </div>

                  <div className="row mt-3">
                    <div className="d-grid gap-2 d-md-flex justify-content-md-between">
                      <div>
                        <input type="checkbox" className="me-3" />
                        <a
                          href="https://lysofts.co.ke/radius/terms-and-conditions"
                          target="_blank"
                          rel="noreferrer"
                        >
                          I agree to Lysofts terms and conditions
                        </a>
                      </div>
                      <button
                        type="button"
                        className="btn text-success"
                        onClick={() => setLogin(!login)}
                      >
                        Already have account?
                      </button>
                    </div>
                  </div>

                  <div className="row mt-3">
                    <div className="d-grid">
                      <button className="btn btn-lg btn-primary">
                        Create school profile
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Auth;
