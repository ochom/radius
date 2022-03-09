import { Lock } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import { Box, Button, TextField, Typography } from "@mui/material";
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

const LoginForm = () => {

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
    <Box className="login-card mx-auto">
      <Box className="card card-body p-5 border-0">
        <Typography variant="h5" align="center" sx={{ my: 2 }}>
          <Lock color="secondary"
            sx={{ fontSize: '2rem' }} /> Login
        </Typography>
        <form onSubmit={submitData}>
          <Box className="col-12 mt-4">
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
          </Box>

          <Box className="col-12 mt-4">
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
          </Box>
          <Box className="row mt-3">
            <Box className="d-grid gap-2 d-md-flex justify-content-md-end">
              <Button color="secondary" className="no-transform">
                Forgot password?
              </Button>
            </Box>
          </Box>

          <Box className="row mt-3 mb-4 px-2">
            <LoadingButton
              type="submit"
              variant="contained"
              color="secondary"
              size="large"
              loading={loading}
            >
              Login
            </LoadingButton>
          </Box>

          <Box className="row mt-3">
            <Button
              type="button"
              color="secondary"
              href="#register"
            >
              Don't have account?
            </Button>
          </Box>
        </form>
      </Box>
    </Box>
  )
}

export default LoginForm