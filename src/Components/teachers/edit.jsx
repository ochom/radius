import { Close, Save } from '@mui/icons-material';
import DateAdapter from '@mui/lab/AdapterMoment';
import LoadingButton from '@mui/lab/LoadingButton';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import MobileDatePicker from '@mui/lab/MobileDatePicker';
import { Alert, Avatar, Box, Button, Divider, FormControl, FormControlLabel, FormLabel, InputLabel, MenuItem, Paper, Radio, RadioGroup, Select, Stack, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { useHistory, useParams } from 'react-router-dom';
import { Service } from '../../API/service';
import { Employers, Gender, Titles } from '../../app/constants';
import {
  AlertFailed,
  AlertSuccess
} from "../customs/alerts";
import { CustomLoader } from '../customs/monitors';


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

const EditTeacher = () => {
  const history = useHistory()
  const { uid } = useParams()

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [formData, setFormData] = useState(initialFormData)


  useEffect(() => {
    let query = {
      query: `query($id: ID!){
        teacher: getTeacher(id:$id){
          title
          fullName
          gender
          dateOfBirth
          idNumber
          email
          phoneNumber
          serialNumber
          employer
          employmentNumber
          passport
        }
      }`,
      variables: {
        id: uid
      }
    }
    new Service().getData(query).then((res) => {
      setFormData({ ...initialFormData, ...res?.teacher })
      setLoading(false)
    });
  }, [uid]);


  const submitForm = e => {
    e.preventDefault();
    setSaving(true)
    delete formData['passport']
    let query =
    {
      query: `mutation ($id: ID!, $data: NewTeacher!){
        updateTeacher(id: $id, input: $data)
      }`,
      variables: {
        id: uid,
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


  const openProfile = () => {
    history.push(`/teachers/profile/${uid}`)
  }

  if (loading) {
    return (
      <Paper sx={{ px: 5, py: 2 }} className='col-md-8 mx-auto'>
        <CustomLoader />
      </Paper>)
  }

  if (saved) {
    return (
      <Paper sx={{ px: 5, py: 2 }} className='col-md-8 mx-auto'>
        <div className="py-5">
          <div className="d-flex justify-content-center my-5">
            <Alert severity='success'>Teacher details updated successfully</Alert>
          </div>
          <div className="d-flex justify-content-center">
            <Button variant='contained' color='secondary' onClick={openProfile}>Go to Teacher Profile</Button>
          </div>
        </div>
      </Paper>
    )
  }
  return (
    <Paper sx={{ px: 5, py: 2 }} className='col-md-10 mx-auto'>
      <div className="d-flex my-3">
        <Avatar src={formData.passport} alt={formData.fullName} sx={{ width: "4rem", height: "4rem" }}></Avatar>
        <div className="ms-4">
          <h3 className='p-0 m-0'>Edit Teacher</h3>
          <p className='text-secondary m-0'>Edit the employee profile.</p>
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
        <Stack spacing={3} sx={{ mt: 4 }} direction='row'>
          <LoadingButton
            type='submit'
            variant='contained'
            color='secondary'
            loading={saving}
            loadingPosition="start"
            startIcon={<Save />}>Save</LoadingButton>

          <Button variant='outlined' color='secondary' type='button' onClick={openProfile}><Close sx={{ mr: 1 }} /> Cancel</Button>
        </Stack>
      </form>
    </Paper>
  );
};

export default EditTeacher;
