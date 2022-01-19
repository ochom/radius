import React from "react";
import { TextField } from "@mui/material";
import { LoadingButton } from "@mui/lab";

export default function LoginForm({ loading, formData, submitFunction, updateFormData, setView }) {
  return (
    <div className="login-card mx-auto">
      <div className="card card-body p-5 border-0">
        <h3 className="text-center my-4">User Login</h3>
        <form onSubmit={submitFunction}>
          <div className="col-12 mt-4">
            <TextField
              type="text"
              label="Email"
              fullWidth
              required
              value={formData.email}
              onChange={(e) =>
                updateFormData({
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
              fullWidth
              required
              value={formData.password}
              onChange={(e) =>
                updateFormData({
                  ...formData,
                  password: e.target.value,
                })
              }
            />
          </div>
          <div className="row mt-3">
            <div className="d-grid gap-2 d-md-flex justify-content-md-end">
              <a href="/forgot-password">Forgot password?</a>
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
              {" "}
              Login
            </LoadingButton>
          </div>

          <div className="row mt-3">
            <button
              type="button"
              className="btn text-success"
              onClick={() => setView("register")}
            >
              Don't have account?
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}