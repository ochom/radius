import { connect } from "react-redux";
import "./auth.css";
import LoginForm from "./login_form";

const Auth = () => {
  return (
    <div className="container">
      <div className="login-container">
        <LoginForm />
      </div>
    </div>
  );
};

export default connect(null, null)(Auth);
