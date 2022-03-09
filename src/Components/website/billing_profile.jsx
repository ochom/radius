import { LoadingButton } from "@mui/lab";
import { Button, Checkbox, TextField } from "@mui/material";
import React, { useState } from "react";
import {
  AlertFailed, AlertSuccess, AlertWarning
} from "../customs/alerts";

const initialFormData = {
  firstName: "",
  lastName: "",
  phoneNumber: "",
  email: "",
  password: "",
  schoolName: "",
  schoolAlias: "",
  agreedToTerms: false,
};

const RegistrationForm = (props) => {
  let { toggleForm } = props

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState(initialFormData);


  const submitData = e => {
    e.preventDefault();
    if (!formData.agreedToTerms) {
      AlertWarning({ text: "You MUST agree to Lysofts terms and conditions" });
      return;
    }

    setLoading(true);
    props.register(formData)
      .then(res => {
        if (res.status === 200) {
          AlertSuccess({ text: res.message });
        } else {
          AlertFailed({ text: res.message });
        }
      }).finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="card card-body col-md-6 p-5 border-0">
      <h3 className="text-center my-4">Create a new School Profile</h3>
      <form onSubmit={submitData}>
        <div className="row">
          <div className="col-6 my-3">
            <TextField
              type="text"
              label="First name"
              fullWidth
              required
              value={formData.firstName}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  firstName: e.target.value,
                })
              }
            />
          </div>
          <div className="col-6 my-3">
            <TextField
              type="text"
              label="Last name"
              fullWidth
              required
              value={formData.lastName}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  lastName: e.target.value,
                })
              }
            />
          </div>

          <div className="col-12 my-3">
            <TextField
              type="text"
              label="Phone number"
              fullWidth
              required
              value={formData.phoneNumber}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  phoneNumber: e.target.value,
                })
              }
            />
          </div>

          <div className="col-12 my-3">
            <TextField
              type="email"
              label="Email"
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

          <div className="col-12 my-3">
            <TextField
              type="password"
              label="Create password"
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

          <div className="col-8 mx-auto mt-4">
            <hr />
          </div>

          <div className="col-12 my-3">
            <TextField
              type="text"
              label="School name"
              placeholder="e.g Akala Secondary School"
              fullWidth
              required
              value={formData.schoolName}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  schoolName: e.target.value,
                })
              }
            />
          </div>
          <div className="col-12 my-3">
            <TextField
              type="text"
              label="Alias (Abbreviation)"
              placeholder="e.g AKSS"
              fullWidth
              required
              value={formData.schoolAlias}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  schoolAlias: e.target.value,
                })
              }
            />
          </div>

          <div className="col-12 my-3">
            <Checkbox
              checked={formData.agreedToTerms}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  agreedToTerms: e.target.checked,
                })
              }
            />
            <a
              href="https://lysofts.co.ke/acme/terms-and-conditions"
              target="_blank"
              rel="noreferrer"
            >
              I agree to Lysofts terms and conditions
            </a>
          </div>

          <div className="d-grid">
            <LoadingButton
              type="submit"
              variant="contained"
              color="secondary"
              size="large"
              loading={loading}
            >
              Register
            </LoadingButton>
          </div>
        </div>
        <div className="row my-3">
          <Button
            type="button"
            color="secondary"
            onClick={toggleForm}
          >
            Already have account?
          </Button>
        </div>
      </form>
    </div>
  )
}


export default RegistrationForm