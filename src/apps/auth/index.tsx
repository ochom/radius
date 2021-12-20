import React from "react";
import { useState } from "react";
import { Redirect } from "react-router-dom";
import { Login, Register } from "../../API/auth";
import {
  AlertSuccess,
  AlertFailed,
  AlertWarning,
} from "../../components/alerts";
import { Response } from "../../Models/common";

import "./auth.css";

const Auth = () => {
  const [login, setLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [schoolName, setSchoolName] = useState("");
  const [schoolAlias, setSchoolAlias] = useState("");
  const [agreeToTerms, setAgreeToTerms] = useState(false);

  const handleLogin = (e: any) => {
    e.preventDefault();
    setLoading(true);
    Login({ email, password })
      .then((res: Response) => {
        if (res.status === 200) {
          localStorage.setItem("authUser", JSON.stringify(res.data));
          AlertSuccess(res.message);
          setIsLoggedIn(true);
        } else {
          AlertFailed(res.message);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleRegister = (e: any) => {
    e.preventDefault();
    if (!agreeToTerms) {
      AlertWarning("You MUST agree to Lysofts terms and conditions");
      return;
    }
    let data = {
      firstName,
      lastName,
      email,
      phoneNumber,
      password,
      schoolName,
      schoolAlias,
    };

    setLoading(true);
    Register(data)
      .then((res: Response) => {
        if (res.status === 200) {
          localStorage.setItem("authUser", JSON.stringify(res.data));
          AlertSuccess(res.message);
          setIsLoggedIn(true);
        } else {
          AlertFailed(res.message);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  if (isLoggedIn) {
    return <Redirect to="/" />;
  }

  return (
    <div className="container">
      <div className="login-container">
        {login ? (
          <div className="login-card mx-auto">
            <div className="card card-body p-5 border-0">
              <h3 className="text-center my-4">User Login</h3>
              <form onSubmit={handleLogin}>
                <div className="row mt-3">
                  <div className="form-group">
                    <label>Email</label>
                    <input
                      type="email"
                      placeholder="email"
                      required
                      value={email}
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
                      placeholder="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="form-control mt-2"
                    />
                  </div>
                </div>
                <div className="row mt-3">
                  <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                    <a href="/forgot-password">Forgot password?</a>
                  </div>
                </div>

                <div className="row mt-3 mb-4">
                  <div className="d-grid">
                    <button
                      type="submit"
                      className="btn btn-lg btn-primary"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <span
                            className="spinner-border spinner-border-sm"
                            role="status"
                            aria-hidden="true"
                          ></span>{" "}
                          Processing...
                        </>
                      ) : (
                        "Login"
                      )}
                    </button>
                  </div>
                </div>

                <div className="row mt-3">
                  <button
                    type="button"
                    className="btn text-success"
                    onClick={() => setLogin(!login)}
                  >
                    Don't have account?
                  </button>
                </div>
              </form>
            </div>
          </div>
        ) : (
          <div className="registration-card mx-auto">
            <div className="card card-body p-5 border-0">
              <h3 className="text-center my-4">Create a new School Profile</h3>
              <form onSubmit={handleRegister}>
                <div className="row">
                  <div className="form-group col-6">
                    <label>First name</label>
                    <input
                      type="text"
                      value={firstName}
                      required
                      onChange={(e) => setFirstName(e.target.value)}
                      className="form-control"
                    />
                  </div>
                  <div className="form-group col-6">
                    <label>Last name</label>
                    <input
                      type="text"
                      value={lastName}
                      required
                      onChange={(e) => setLastName(e.target.value)}
                      className="form-control"
                    />
                  </div>
                </div>
                <div className="row mt-3">
                  <div className="form-group">
                    <label>Mobile</label>
                    <input
                      type="text"
                      value={phoneNumber}
                      required
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="form-control"
                    />
                  </div>
                </div>
                <div className="row mt-3">
                  <div className="form-group">
                    <label>Email</label>
                    <input
                      type="email"
                      value={email}
                      required
                      onChange={(e) => setEmail(e.target.value)}
                      className="form-control"
                    />
                  </div>
                </div>
                <div className="row mt-3">
                  <div className="form-group">
                    <label>Create Password</label>
                    <input
                      type="password"
                      value={password}
                      required
                      onChange={(e) => setPassword(e.target.value)}
                      className="form-control"
                    />
                  </div>
                </div>

                <div className="row col-8 mx-auto mt-4">
                  <hr />
                </div>
                <div className="row mt-3">
                  <div className="form-group">
                    <label>School name</label>
                    <input
                      type="text"
                      value={schoolName}
                      required
                      onChange={(e) => setSchoolName(e.target.value)}
                      className="form-control"
                    />
                  </div>
                </div>

                <div className="row mt-3">
                  <div className="form-group">
                    <label>
                      Alias (<small>Abbreviations</small>)
                    </label>
                    <input
                      type="text"
                      value={schoolAlias}
                      required
                      onChange={(e) => setSchoolAlias(e.target.value)}
                      className="form-control"
                    />
                  </div>
                </div>

                <div className="row mt-3">
                  <div>
                    <input
                      type="checkbox"
                      className="me-3"
                      checked={agreeToTerms}
                      onChange={() => setAgreeToTerms(!agreeToTerms)}
                    />
                    <a
                      href="https://lysofts.co.ke/radius/terms-and-conditions"
                      target="_blank"
                      rel="noreferrer"
                    >
                      I agree to Lysofts terms and conditions
                    </a>
                  </div>
                </div>

                <div className="row mt-3">
                  <div className="d-grid">
                    <button
                      className="btn btn-lg btn-primary"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <span
                            className="spinner-border spinner-border-sm"
                            role="status"
                            aria-hidden="true"
                          ></span>{" "}
                          Processing...
                        </>
                      ) : (
                        "Register"
                      )}
                    </button>
                  </div>
                </div>
                <div className="row my-3">
                  <button
                    type="button"
                    className="btn text-success"
                    onClick={() => setLogin(!login)}
                  >
                    Already have account?
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Auth;
