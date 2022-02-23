import { Group, Save } from '@mui/icons-material';
import DateAdapter from '@mui/lab/AdapterMoment';
import LoadingButton from '@mui/lab/LoadingButton';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import MobileDatePicker from '@mui/lab/MobileDatePicker';
import { Alert, Box, Button, Divider, FormControl, InputLabel, MenuItem, Paper, Select, TextField } from "@mui/material";
import { useEffect, useState } from "react";

import { Gender } from '../../app/constants';
import {
  AlertFailed,
  AlertSuccess
} from "../customs/alerts";


const initialFormData = {
  fullName: "",
  classID: "",
  admissionNumber: "",
  dateOfAdmission: new Date(),
  nationalID: "",
  gender: "",
  dateOfBirth: new Date('2002-01-01T00:00:00'),
  homeAddress: "",
}

const NewStudent = () => {
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const [formData, setFormData] = useState(initialFormData)

  const [classrooms, setClassrooms] = useState([]);

  const getClassrooms = () => {
    let query = {
      query: `query classrooms{
        classrooms: getClassrooms{
          id
          level
          stream
        }
      }`,
      variables: {}
    }
    new Service().getData(query).then((res) => {
      setClassrooms(res?.classrooms.sort((a, b) => parseInt(a.level) - parseInt(b.level)) || [])
    });
  };

  useEffect(() => {
    getClassrooms()
  }, []);

  const submitForm = e => {
    e.preventDefault();
    setSaving(true)
    let query =
    {
      query: `mutation ($data: NewStudent!){
        createStudent(input: $data)
      }`,
      variables: {
        data: formData
      }
    }

    new Service().createOrUpdate(query).then((res) => {
      if (res.status === 200) {
        AlertSuccess({ text: `Student saved successfully` });
        setSaved(true)
      } else {
        AlertFailed({ text: res.message });
      }
    }).finally(() => {
      setSaving(false)
    });
  };

  const onNewStudent = () => {
    setSaved(false)
    setFormData(initialFormData)
  }

  if (saved) {
    return (
      <Paper sx={{ px: 5, pt: 2, pb: 5 }}>
        <div className="py-5">
          <div className="d-flex justify-content-center my-5">
            <Alert severity='success'>Student created successfully</Alert>
          </div>
          <div className="d-flex justify-content-center">
            <Button variant='contained' color='secondary' size='large' onClick={onNewStudent}>Add New Student</Button>
          </div>
        </div>
      </Paper>
    )
  }

  return (
    <Paper sx={{ px: 5, pt: 2, pb: 5 }} className="col-md-10 mx-auto">
      <div className="d-flex my-3">
        <Button variant="outlined" color='secondary'>
          <Group />
        </Button>
        <div className="ms-4">
          <h3 className='p-0 m-0'>New Student</h3>
          <p className='text-secondary m-0'>create new student profile.</p>
        </div>
      </div>
      <form onSubmit={submitForm} method="post">
        <Box className="row">
          <Box className="col-8" sx={{ mt: 4 }}>
            <TextField type="text" label="Full name"
              required
              value={formData.fullName}
              fullWidth
              onChange={e => setFormData({ ...formData, fullName: e.target.value })} />
          </Box>
          <Box className="col-md-4" sx={{ mt: 4 }}>
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
                {Gender.map(k => <MenuItem value={k} key={k}>{k}</MenuItem>)}
              </Select>
            </FormControl>
          </Box>
          <Box className="col-md-4" sx={{ mt: 4 }}>
            <LocalizationProvider dateAdapter={DateAdapter}>
              <MobileDatePicker
                label="Date of birth"
                inputFormat="DD/MM/yyyy"
                value={formData.dateOfBirth}
                onChange={val => setFormData({ ...formData, dateOfBirth: val })}
                renderInput={(params) => <TextField fullWidth {...params} />}
              />
            </LocalizationProvider>
          </Box>
          <Box className="col-md-4" sx={{ mt: 4 }}>
            <TextField
              type="text"
              label="Admission Number"
              required
              value={formData.admissionNumber}
              fullWidth
              onChange={e => setFormData({ ...formData, admissionNumber: e.target.value })} />
          </Box>
          <Box className="col-md-4" sx={{ mt: 4 }}>
            <TextField type="text" label="NEMIS"
              required
              value={formData.nationalID}
              fullWidth
              onChange={e => setFormData({ ...formData, nationalID: e.target.value })} />
          </Box>

          <Box className="col-md-4" sx={{ mt: 4 }}>
            <LocalizationProvider dateAdapter={DateAdapter}>
              <MobileDatePicker
                label="Date of admission"
                inputFormat="DD/MM/yyyy"
                value={formData.dateOfAdmission}
                onChange={val => setFormData({ ...formData, dateOfAdmission: val })}
                renderInput={(params) => <TextField fullWidth {...params} />}
              />
            </LocalizationProvider>
          </Box>
          <Box className="col-md-4" sx={{ mt: 4 }}>
            <FormControl fullWidth>
              <InputLabel id="role-label">Classroom</InputLabel>
              <Select
                labelId="role-label"
                id="role"
                label="Classroom"
                value={formData.classID}
                required
                fullWidth
                onChange={e => setFormData({ ...formData, classID: e.target.value })}
              >
                {classrooms.map(r => <MenuItem key={r.id} value={r.id}>{r.level} {r.stream}</MenuItem>)}
              </Select>
            </FormControl>
          </Box>
          <div className="col-12 mt-4">
            <TextField
              type="text"
              label="Home address"
              required
              multiline
              rows={4}
              value={formData.homeAddress}
              placeholder={`Iris Watson\nP.O. Box 283 8562 Fusce Rd.\nFrederick Nebraska 20620\n(372) 587-2335`}
              fullWidth
              onChange={e => setFormData({ ...formData, homeAddress: e.target.value })} />
          </div>
        </Box>
        <Divider />
        <Box sx={{ mt: 4 }}>
          <LoadingButton
            type='submit'
            variant='contained'
            color='secondary'
            size='large'
            loading={saving}
            loadingPosition="start"
            startIcon={<Save />}>Save</LoadingButton>
        </Box>
      </form>
    </Paper>
  );
};

export default NewStudent;
