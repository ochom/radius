import { Lock } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import { Button, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { useDispatch } from 'react-redux';
import { login as Login } from "../../API/auth";
import { login } from '../../reducers/auth-reducer';
import {
  AlertFailed
} from "../customs/alerts";

const initialFormData = {
  email: "",
  password: "",
};

const LoginForm = (props) => {
  let { toggleForm } = props

  const dispatch = useDispatch()

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState(initialFormData);


  const submitData = (e) => {
    e.preventDefault();
    setLoading(true);
    Login(formData)
      .then((res) => {
        if (res.status === 200) {
          setLoading(false);
          dispatch(login(res.data))
        } else {
          setLoading(false);
          AlertFailed({ text: res.message });
        }
      }).catch(err => {
        setLoading(false);
      })
  };


  return (
    <div className="login-card mx-auto">
      <div className="card card-body p-5 border-0">
        <h3 className="text-center my-4">
          <Lock color="secondary"
            sx={{ fontSize: '2rem' }} /> Login
        </h3>
        <form onSubmit={submitData}>
          <div className="col-12 mt-4">
            <TextField
              type="text"
              label="Email"
              color="secondary"
              fullWidth
              required
              value={formData.email}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  email: e.target.value,
                })
              }
            />
          </div>

          <div className="col-12 mt-4">
            <TextField
              type="password"
              label="Password"
              color="secondary"
              fullWidth
              required
              value={formData.password}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  password: e.target.value,
                })
              }
            />
          </div>
          <div className="row mt-3">
            <div className="d-grid gap-2 d-md-flex justify-content-md-end">
              <Button color="secondary" className="no-transform">
                Forgot password?
              </Button>
            </div>
          </div>

          <div className="row mt-3 mb-4 px-2">
            <LoadingButton
              type="submit"
              variant="contained"
              color="secondary"
              size="large"
              loading={loading}
            >
              <Typography>
                Login
              </Typography>
            </LoadingButton>
          </div>

          <div className="row mt-3">
            <Button
              type="button"
              color="secondary"
              onClick={toggleForm}
            >
              Don't have account?
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default LoginForm