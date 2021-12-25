import React from "react";
import { Checkbox, TextField } from "@mui/material";
import { Save } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";

export default function RegistrationForm({ loading, formData, submitFunction, updateFormData, setView }) {
  return (

    <div className="registration-card mx-auto">
      <div className="card card-body p-5 border-0">
        <h3 className="text-center my-4">Create a new School Profile</h3>
        <form onSubmit={submitFunction}>
          <div className="row">
            <div className="col-6 my-3">
              <TextField
                type="text"
                label="First name"
                fullWidth
                required
                value={formData.firstName}
                onChange={(e) =>
                  updateFormData({
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
                  updateFormData({
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
                  updateFormData({
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
                  updateFormData({
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
                  updateFormData({
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
                  updateFormData({
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
                  updateFormData({
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
                  updateFormData({
                    ...formData,
                    agreedToTerms: e.target.checked,
                  })
                }
              />
              <a
                href="https://lysofts.co.ke/radius/terms-and-conditions"
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
                loadingPosition="start"
                startIcon={<Save />}
              >
                Save
              </LoadingButton>
            </div>
          </div>
          <div className="row my-3">
            <button
              type="button"
              className="btn text-success"
              onClick={() => setView("login")}
            >
              Already have account?
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}