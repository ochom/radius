import { TextField } from "@mui/material";
import React, { useState } from "react";
import {
  AlertFailed, AlertSuccess, AlertWarning
} from "../customs/alerts";

const initialFormData = {
  schoolName: "",
  schoolAlias: "",
};

const SchoolProfile = (props) => {
  const [formData, setFormData] = useState(initialFormData);


  const submitData = e => {
    e.preventDefault();
    if (!formData.agreedToTerms) {
      AlertWarning({ text: "You MUST agree to Lysofts terms and conditions" });
      return;
    }

    props.register(formData)
      .then(res => {
        if (res.status === 200) {
          AlertSuccess({ text: res.message });
        } else {
          AlertFailed({ text: res.message });
        }
      })
  };

  return (
    <div className="col-md-6 mx-auto">
      <div className="card card-body p-5 border-0">
        <h3 className="text-center my-4">School Profile</h3>
        <form onSubmit={submitData}>
          <div className="row">
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
          </div>
        </form>
      </div>
    </div>
  )
}


export default SchoolProfile