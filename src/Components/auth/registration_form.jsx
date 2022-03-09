import { ArrowBack } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import { Box, Button, Stack, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { register as Register } from "../../API/auth";
import { login } from '../../reducers/auth-reducer';
import {
  AlertFailed
} from "../customs/alerts";

const initialFormData = {
  firstName: "",
  lastName: "",
  phoneNumber: "",
  email: "",
  password: "",
  schoolName: "",
  schoolAlias: ""
};

const RegistrationForm = () => {

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState(initialFormData);
  const [index, setIndex] = useState(0)

  const dispatch = useDispatch()

  const addAccountInf = e => {
    e.preventDefault()
    setIndex(1)
  }

  const submitData = e => {
    e.preventDefault();
    setLoading(true);
    Register(formData)
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
    <Box className="signup-box">
      <Box className="col-md-6" >
        <Box className="input-box p-5">
          {index == 0 ?
            <form onSubmit={addAccountInf}>
              <Stack display="flex" direction='row' spacing={1}>
                <Typography>Welcome to </Typography>
                <Typography color='secondary'><b>Acme</b></Typography>
              </Stack>
              <h3 className="text-center my-4">Create your account</h3>
              <Box className="row">
                <Box className="col-6 my-3">
                  <TextField
                    type="text"
                    label="First name"
                    fullWidth
                    required
                    color="secondary"
                    value={formData.firstName}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        firstName: e.target.value,
                      })
                    }
                  />
                </Box>
                <Box className="col-6 my-3">
                  <TextField
                    type="text"
                    label="Last name"
                    color="secondary"
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
                </Box>

                <Box className="col-12 my-3">
                  <TextField
                    type="text"
                    label="Phone number"
                    fullWidth
                    color="secondary"
                    required
                    value={formData.phoneNumber}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        phoneNumber: e.target.value,
                      })
                    }
                  />
                </Box>

                <Box className="col-12 my-3">
                  <TextField
                    type="email"
                    color="secondary"
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
                </Box>

                <Box className="col-12 my-3">
                  <TextField
                    type="password"
                    label="Create password"
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
                <div className="d-grid mt-3">
                  <Button
                    type="submit"
                    variant="contained"
                    color="secondary"
                    size="large"
                  >
                    Next
                  </Button>
                </div>
              </Box>
            </form>
            :
            <form onSubmit={submitData}>
              <Stack display="flex" direction='row' spacing={1}>
                <Button color="inherit" onClick={() => setIndex(0)}><ArrowBack sx={{ mr: 1 }} /> Back</Button>
              </Stack>
              <h3 className="text-center my-4">Create school profile</h3>
              <Box className="row">
                <Box className="col-12 my-3">
                  <TextField
                    type="text"
                    label="School name"
                    placeholder="e.g Acne High School"
                    color="secondary"
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
                </Box>
                <Box className="col-12 my-3">
                  <TextField
                    type="text"
                    label="Alias (Abbreviation)"
                    placeholder="e.g ACMHS"
                    color="secondary"
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
                </Box>
              </Box>

              <div className="d-grid mt-5">
                <LoadingButton
                  type="submit"
                  variant="contained"
                  color="secondary"
                  size="large"
                  loading={loading}
                >
                  Finish
                </LoadingButton>
              </div>
            </form>
          }

          <Box className="row mt-5">
            <Button
              type="button"
              color="secondary"
              href="#login"
            >
              Already have account?
            </Button>
          </Box>
        </Box>
      </Box>
      <Box className="signup-image col-md-6"></Box>
    </Box>
  )
}


export default RegistrationForm