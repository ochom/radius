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
import LoginForm from "./login_form";
import RegistrationForm from "./registration_form";

const initialLoginForm = {
  email: "",
  password: "",
};

const initialRegistrationForm = {
  firstName: "",
  lastName: "",
  phoneNumber: "",
  email: "",
  password: "",
  schoolName: "",
  schoolAlias: "",
  agreedToTerms: false,
};

const Auth = () => {
  const [view, setView] = useState("login");
  const [loading, setLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginForm, setLoginForm] = useState(initialLoginForm);
  const [registrationForm, setRegistrationForm] = useState(
    initialRegistrationForm
  );

  const handleLogin = (e: any) => {
    e.preventDefault();
    setLoading(true);
    Login(loginForm)
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
    if (!registrationForm.agreedToTerms) {
      AlertWarning("You MUST agree to Lysofts terms and conditions");
      return;
    }

    setLoading(true);
    Register(registrationForm)
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
        {view === "login" ? (
          <LoginForm
            loading={loading}
            submitFunction={handleLogin}
            formData={loginForm}
            updateFormData={setLoginForm}
            setView={setView}
          />
        ) : (
          <RegistrationForm
            loading={loading}
            submitFunction={handleRegister}
            formData={registrationForm}
            updateFormData={setRegistrationForm}
            setView={setView}
          />
        )}
      </div>
    </div>
  );
};

export default Auth;
