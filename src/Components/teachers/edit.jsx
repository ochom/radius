import { gql, useMutation, useQuery } from '@apollo/client';
import { Close, Save } from '@mui/icons-material';
import DateAdapter from '@mui/lab/AdapterMoment';
import LoadingButton from '@mui/lab/LoadingButton';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import MobileDatePicker from '@mui/lab/MobileDatePicker';
import { Alert, Box, Button, Divider, FormControl, FormControlLabel, FormLabel, InputLabel, MenuItem, Paper, Radio, RadioGroup, Select, Stack, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { useHistory, useParams } from 'react-router-dom';
import { Employers, Gender, Titles } from '../../app/constants';
import {
  AlertFailed,
  AlertSuccess
} from "../customs/alerts";
import { PageErrorAlert } from '../customs/empty-page';
import { CustomLoader } from '../customs/monitors';

const FETCH_ONE_QUERY = gql`query($id: ID!){
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
}`

const UPDATE_MUTATION = gql`mutation ($id: ID!, $data: NewTeacher!){
  updateTeacher(id: $id, input: $data)
}`

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
  const [saved, setSaved] = useState(false);
  const [formData, setFormData] = useState(initialFormData)

  const { loading, error } = useQuery(FETCH_ONE_QUERY, {
    variables: {
      id: uid
    },
    onCompleted: (res) => {
      let teacher = res.teacher
      setFormData({
        title: teacher.title,
        fullName: teacher.fullName,
        dateOfBirth: teacher.dateOfBirth,
        gender: teacher.gender,
        idNumber: teacher.idNumber,
        phoneNumber: teacher.phoneNumber,
        email: teacher.email,
        serialNumber: teacher.serialNumber,
        employer: teacher.employer,
        employmentNumber: teacher.employmentNumber
      })
    }
  })

  const [updateData, { loading: updating, reset }] = useMutation(UPDATE_MUTATION, {
    onCompleted: () => {
      AlertSuccess({ text: `Teacher details updated successfully` });
      reset()
      setSaved(true)
    },
    onError: (err) => {
      AlertFailed({ text: err.message });
    }
  })

  const submitForm = e => {
    e.preventDefault();
    delete formData['passport']
    updateData({
      variables: {
        id: uid,
        data: formData
      }
    })
  };


  const openProfile = () => {
    history.push(`/teachers/profile/${uid}`)
  }

  if (loading) return <CustomLoader />

  if (error) return <PageErrorAlert message={error.message} />

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
    <Paper sx={{ px: 5, pt: 2, pb: 5 }} className='col-md-10 mx-auto'>
      <Box>
        <Typography variant='h5'>Update Teacher Details</Typography>
      </Box>
      <form onSubmit={submitForm} method="post">
        <Box className="row">
          <Box className="col-md-4" sx={{ mt: 4 }}>
            <FormControl fullWidth >
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
              onChange={e => setFormData({ ...formData, fullName: e.target.value })} />
          </Box>
          <Box className="col-md-6" sx={{ mt: 4 }}>
            <TextField
              type="text"
              label="Mobile"
              required
              value={formData.phoneNumber}
              fullWidth
              onChange={e => setFormData({ ...formData, phoneNumber: e.target.value })} />
          </Box>
          <Box className="col-md-6" sx={{ mt: 4 }}>
            <TextField
              type="email"
              label="Email"
              required
              value={formData.email}
              fullWidth
              onChange={e => setFormData({ ...formData, email: e.target.value })} />
          </Box>
          <Box className="col-md-6" sx={{ mt: 4 }}>
            <TextField
              type="text"
              label="ID Number"
              required
              value={formData.idNumber}
              fullWidth
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
                />}
              />
            </LocalizationProvider>
          </Box>
          <Box className="col-md-4" sx={{ mt: 4 }}>
            <TextField
              type="text"
              label="Staff Number"
              required
              value={formData.serialNumber}
              placeholder="e.g 001"
              fullWidth
              onChange={e => setFormData({ ...formData, serialNumber: e.target.value })} />
          </Box>
          <Box className="col-md-4" sx={{ mt: 4 }}>
            <FormControl fullWidth
            >
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
              value={formData.employmentNumber}
              placeholder="e.g T.S.C Number"
              fullWidth
              onChange={e => setFormData({ ...formData, employmentNumber: e.target.value })} />
          </Box>
          <Box sx={{ mt: 4 }}>
            <FormControl
            >
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
            loading={updating}
            loadingPosition="start"
            startIcon={<Save />}>Save</LoadingButton>

          <Button variant='outlined' color='secondary' type='button' onClick={openProfile}><Close sx={{ mr: 1 }} /> Cancel</Button>
        </Stack>
      </form>
    </Paper>
  );
};

export default EditTeacher;
