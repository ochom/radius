import { Group, Save } from '@mui/icons-material';
import DateAdapter from '@mui/lab/AdapterMoment';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import MobileDatePicker from '@mui/lab/MobileDatePicker';
import { Alert, Button, Checkbox, FormControl, InputLabel, MenuItem, Paper, Select, TextField } from "@mui/material";
import { useState, useEffect } from "react";
import {
  AlertFailed,
  AlertSuccess,
} from "../../components/alerts";
import LoadingButton from '@mui/lab/LoadingButton';
import { Service } from '../../API/service';
import { EmploymentType, Gender, StaffType } from '../../Models/enums';


const initialFormData = {
  firstName: "",
  lastName: "",
  dateOfBirth: new Date('2002-01-01T00:00:00'),
  gender: "",
  idNumber: "",
  phoneNumber: "",
  email: "",
  serialNumber: "",
  employer: "",
  employmentNumber: "",
  staffType: "",
  primaryRole: "",
  createAccount: false
}

const NewStaff = () => {
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const [formData, setFormData] = useState(initialFormData)

  const [roles, setRoles] = useState([]);

  const getRoles = () => {
    let rolesQuery = {
      query: `query roles{
        roles: getRoles{
          id
          name
        }
      }`,
      variables: {}
    }
    new Service().getData(rolesQuery).then((res) => {
      setRoles(res?.roles.sort((a, b) => a.name > b.name) || [])
    });
  };

  useEffect(() => {
    getRoles()
  }, []);

  const submitForm = e => {
    e.preventDefault();
    setSaving(true)
    let query =
    {
      query: `mutation createStaff($data: NewStaff!){
        session: createStaff(input: $data){
          id
        }
      }`,
      variables: {
        "data": formData
      }
    }

    new Service().createOrUpdate(query).then((res) => {
      if (res.status === 200) {
        AlertSuccess(`Staff saved successfully`);
        setSaved(true)
      } else {
        AlertFailed(res.message);
      }
    }).finally(() => {
      setSaving(false)
    });
  };

  const onNewStaff = () => {
    setSaved(false)
    setFormData(initialFormData)
  }

  if (saved) {
    return (
      <Paper sx={{ px: 5, py: 2 }}>
        <div className="py-5">
          <div className="d-flex justify-content-center my-5">
            <Alert severity='success'>Student created successfully</Alert>
          </div>
          <div className="d-flex justify-content-center">
            <Button variant='contained' color='secondary' size='large' onClick={onNewStaff}>Add New Staff</Button>
          </div>
        </div>
      </Paper>
    )
  }

  return (
    <Paper sx={{ px: 5, py: 2 }}>
      <div className="d-flex my-3">
        <Button variant="outlined" color='secondary'>
          <Group />
        </Button>
        <div className="ms-4">
          <h3 className='p-0 m-0'>New Staff</h3>
          <p className='text-secondary m-0'>create new employee profile.</p>
        </div>
      </div>
      <form onSubmit={submitForm} method="post">
        <div className="row">
          <div className="col-md-4 mt-3">
            <TextField type="text" label="First name"
              required
              value={formData.firstName}
              fullWidth
              onChange={e => setFormData({ ...formData, firstName: e.target.value })} />
          </div>
          <div className="col-md-4 mt-3">
            <TextField type="text" label="Last name"
              required
              value={formData.lastName}
              fullWidth
              onChange={e => setFormData({ ...formData, lastName: e.target.value })} />
          </div>
          <div className="col-md-4 mt-3">
            <FormControl fullWidth>
              <InputLabel id="gender-label">Gender</InputLabel>
              <Select
                labelId="gender-label"
                id="gender"
                label="Gender"
                required
                value={formData.gender}
                onChange={e => setFormData({ ...formData, gender: e.target.value })}
              >
                {Object.entries(Gender).map(k => <MenuItem value={k[0]} key={k[0]}>{k[1]}</MenuItem>)}
              </Select>
            </FormControl>
          </div>
          <div className="col-md-4 mt-5">
            <LocalizationProvider dateAdapter={DateAdapter}>
              <MobileDatePicker
                label="Date of birth"
                inputFormat="DD/MM/yyyy"
                value={formData.dateOfBirth}
                onChange={val => setFormData({ ...formData, dateOfBirth: val })}
                renderInput={(params) => <TextField fullWidth {...params} />}
              />
            </LocalizationProvider>
          </div>
          <div className="col-md-4 mt-5">
            <TextField
              type="email"
              label="Email"
              required
              value={formData.email}
              fullWidth
              onChange={e => setFormData({ ...formData, email: e.target.value })} />
          </div>
          <div className="col-md-4 mt-5">
            <TextField
              type="text"
              label="Mobile"
              required
              value={formData.phoneNumber}
              fullWidth
              onChange={e => setFormData({ ...formData, phoneNumber: e.target.value })} />
          </div>
          <div className="col-12 mt-3">
            <Checkbox checked={formData.createAccount}
              onChange={e => setFormData({ ...formData, createAccount: e.target.checked })} /> Create user account?
          </div>
          <div className="col-md-4 mt-3">
            <TextField
              type="text"
              label="ID Number"
              required
              value={formData.idNumber}
              fullWidth
              onChange={e => setFormData({ ...formData, idNumber: e.target.value })} />
          </div>
          <div className="col-md-4 mt-3">
            <TextField
              type="text"
              label="Staff Serial Number"
              required
              value={formData.serialNumber}
              placeholder="e.g 001"
              fullWidth
              onChange={e => setFormData({ ...formData, serialNumber: e.target.value })} />
          </div>
          <div className="col-md-4 mt-3">
            <FormControl fullWidth>
              <InputLabel id="staff-type-label">Employee type</InputLabel>
              <Select
                labelId="staff-type-label"
                id="staff-type"
                label="Employee type"
                value={formData.staffType}
                required
                fullWidth
                onChange={e => setFormData({ ...formData, staffType: e.target.value })}
              >
                {Object.entries(StaffType).map(k => <MenuItem value={k[0]} key={k[0]}>{k[1]}</MenuItem>)}
              </Select>
            </FormControl>
          </div>
          <div className="col-md-4 mt-5">
            <FormControl fullWidth>
              <InputLabel id="role-label">Primary role</InputLabel>
              <Select
                labelId="role-label"
                id="role"
                label="Primary role"
                value={formData.primaryRole}
                required
                fullWidth
                onChange={e => setFormData({ ...formData, primaryRole: e.target.value })}
              >
                <MenuItem value="">Select</MenuItem>
                {roles.map(r => <MenuItem key={r.id} value={r.name}>{r.name}</MenuItem>)}
              </Select>
            </FormControl>
          </div>

          <div className="col-md-4 mt-5">
            <FormControl fullWidth>
              <InputLabel id="employer-label">Employer</InputLabel>
              <Select
                labelId="employer-label"
                id="employer"
                label="Employer"
                value={formData.employer}
                required
                fullWidth
                onChange={e => setFormData({ ...formData, employer: e.target.value })}
              >
                {Object.entries(EmploymentType).map(k => <MenuItem value={k[0]} key={k[0]}>{k[1]}</MenuItem>)}
              </Select>
            </FormControl>
          </div>
          <div className="col-md-4 mt-5">
            <TextField
              type="text"
              label="Employment Number"
              required
              value={formData.employmentNumber}
              placeholder="e.g T.S.C Number"
              fullWidth
              onChange={e => setFormData({ ...formData, employmentNumber: e.target.value })} />
          </div>
        </div>
        <div className="col-12 d-flex justify-content-start mt-5">
          <LoadingButton
            type='submit'
            variant='contained'
            color='secondary'
            size='large'
            loading={saving}
            loadingPosition="start"
            startIcon={<Save />}>Save</LoadingButton>
        </div>
      </form>
    </Paper>
  );
};

export default NewStaff;
