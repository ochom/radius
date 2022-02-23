import { Edit, Save } from '@mui/icons-material';
import DateAdapter from '@mui/lab/AdapterMoment';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import MobileDatePicker from '@mui/lab/MobileDatePicker';
import { Alert, Box, Button, Divider, FormControl, FormControlLabel, FormLabel, InputLabel, MenuItem, Paper, Radio, RadioGroup, Select, TextField } from "@mui/material";
import { useState } from "react";
import {
  AlertFailed,
  AlertSuccess,
} from "../customs/alerts";
import LoadingButton from '@mui/lab/LoadingButton';

import { Employers, Gender, Titles } from '../../app/constants';


const initialFormData = {
  title: "",
  fullName: "",
  dateOfBirth: new Date('2002-01-01T00:00:00'),
  gender: "",
  idNumber: "",
  phoneNumber: "",
  email: "",
  serialNumber: "",
  employer: "",
  employmentNumber: "",
}

const NewTeacher = () => {
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const [formData, setFormData] = useState(initialFormData)


  const submitForm = e => {
    e.preventDefault();
    setSaving(true)
    let query =
    {
      query: `mutation($data: NewTeacher!){
        createTeacher(input: $data)
      }`,
      variables: {
        data: formData
      }
    }

    new Service().createOrUpdate(query).then((res) => {
      if (res.status === 200) {
        AlertSuccess({ text: `Teacher saved successfully` });
        setSaved(true)
      } else {
        AlertFailed({ text: res.message });
      }
    }).finally(() => {
      setSaving(false)
    });
  };

  const onNewTeacher = () => {
    setSaved(false)
    setFormData(initialFormData)
  }

  if (saved) {
    return (
      <Paper sx={{ px: 5, py: 2 }}>
        <div className="py-5">
          <div className="d-flex justify-content-center my-5">
            <Alert severity='success'>Teacher created successfully</Alert>
          </div>
          <div className="d-flex justify-content-center">
            <Button variant='contained' color='secondary' size='large' onClick={onNewTeacher}>Add New Teacher</Button>
          </div>
        </div>
      </Paper>
    )
  }

  return (
    <Paper sx={{ px: 5, py: 2 }} className='col-md-10 mx-auto'>
      <div className="d-flex my-3">
        <Button variant='outlined' color='secondary'>
          <Edit />
        </Button>
        <div className="ms-4">
          <h3 className='p-0 m-0'>Create Teacher</h3>
          <p className='text-secondary m-0'>create employee profile.</p>
        </div>
      </div>
      <form onSubmit={submitForm} method="post">
        <Box className="row">
          <Box className="col-md-4" sx={{ mt: 4 }}>
            <FormControl fullWidth size='small'>
              <InputLabel id="teacher-title">Title</InputLabel>
              <Select
                labelId="teacher-title"
                id="title"
                label="Title"
                value={formData.title}
                required
                fullWidth
                onChange={e => setFormData({ ...formData, title: e.target.value })}
              >
                {Titles.map(k => <MenuItem value={k} key={k}>{k}</MenuItem>)}
              </Select>
            </FormControl>
          </Box>
          <Box className="col-md-8" sx={{ mt: 4 }}>
            <TextField type="text" label="Full name"
              required
              value={formData.fullName}
              fullWidth
              size='small'
              onChange={e => setFormData({ ...formData, fullName: e.target.value })} />
          </Box>
          <Box className="col-md-6" sx={{ mt: 4 }}>
            <TextField
              type="text"
              label="Mobile"
              required
              value={formData.phoneNumber}
              fullWidth
              size='small'
              onChange={e => setFormData({ ...formData, phoneNumber: e.target.value })} />
          </Box>
          <Box className="col-md-6" sx={{ mt: 4 }}>
            <TextField
              type="email"
              label="Email"
              required
              value={formData.email}
              fullWidth
              size='small'
              onChange={e => setFormData({ ...formData, email: e.target.value })} />
          </Box>
          <Box className="col-md-6" sx={{ mt: 4 }}>
            <TextField
              type="text"
              label="ID Number"
              required
              value={formData.idNumber}
              fullWidth
              size='small'
              onChange={e => setFormData({ ...formData, idNumber: e.target.value })} />
          </Box>
          <Box className="col-md-6" sx={{ mt: 4 }}>
            <LocalizationProvider dateAdapter={DateAdapter}>
              <MobileDatePicker
                label="Date of birth"
                inputFormat="DD/MM/yyyy"
                value={formData.dateOfBirth}
                onChange={val => setFormData({ ...formData, dateOfBirth: val })}
                renderInput={(params) => <TextField fullWidth {...params}
                  size='small' />}
              />
            </LocalizationProvider>
          </Box>
          <Box className="col-md-4" sx={{ mt: 4 }}>
            <TextField
              type="text"
              label="Staff Number"
              required
              size='small'
              value={formData.serialNumber}
              placeholder="e.g 001"
              fullWidth
              onChange={e => setFormData({ ...formData, serialNumber: e.target.value })} />
          </Box>
          <Box className="col-md-4" sx={{ mt: 4 }}>
            <FormControl fullWidth
              size='small'>
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
                {Employers.map(k => <MenuItem value={k} key={k}>{k}</MenuItem>)}
              </Select>
            </FormControl>
          </Box>
          <Box className="col-md-4" sx={{ mt: 4 }}>
            <TextField
              type="text"
              label="Empl. Number"
              required
              size='small'
              value={formData.employmentNumber}
              placeholder="e.g T.S.C Number"
              fullWidth
              onChange={e => setFormData({ ...formData, employmentNumber: e.target.value })} />
          </Box>
          <Box sx={{ mt: 4 }}>
            <FormControl
              size='small'>
              <FormLabel id="gender-radio-buttons-group-label">Gender</FormLabel>
              <RadioGroup
                row
                aria-labelledby="gender-radio-buttons-group-label"
                name="gender-radio-buttons-group"
                value={formData.gender}
                onChange={e => setFormData({ ...formData, gender: e.target.value })}
              >
                {Gender.map(g => <FormControlLabel value={g} key={g} control={<Radio color='secondary' />} label={g} />)}
              </RadioGroup>
            </FormControl>
          </Box>
        </Box>
        <Divider />
        <Box sx={{ mt: 4 }}>
          <LoadingButton
            type='submit'
            variant='contained'
            color='secondary'
            loading={saving}
            loadingPosition="start"
            startIcon={<Save />}>Save</LoadingButton>

        </Box>
      </form>
    </Paper>
  );
};

export default NewTeacher;
