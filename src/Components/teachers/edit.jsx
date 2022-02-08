import { Save } from '@mui/icons-material';
import DateAdapter from '@mui/lab/AdapterMoment';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import MobileDatePicker from '@mui/lab/MobileDatePicker';
import { Alert, Avatar, Button, FormControl, FormControlLabel, FormLabel, InputLabel, MenuItem, Paper, Radio, RadioGroup, Select, TextField } from "@mui/material";
import { useState, useEffect } from "react";
import {
  AlertFailed,
  AlertSuccess,
} from "../customs/alerts";
import LoadingButton from '@mui/lab/LoadingButton';
import { Service } from '../../API/service';
import { Employers, Gender, Titles } from '../../app/constants';
import { useHistory, useParams } from 'react-router-dom';
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
    <Paper sx={{ px: 5, py: 2 }} className='col-md-8 mx-auto'>
      <div className="d-flex my-3">
        <Avatar src={formData.passport} alt={formData.fullName} sx={{ width: "4rem", height: "4rem" }}></Avatar>
        <div className="ms-4">
          <h3 className='p-0 m-0'>Edit Teacher</h3>
          <p className='text-secondary m-0'>Edit the employee profile.</p>
        </div>
      </div>
      <form onSubmit={submitForm} method="post">
        <div className="row">
          <div className="col-md-4 mt-3">
            <FormControl fullWidth>
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
          </div>
          <div className="col-md-8 mt-3">
            <TextField type="text" label="Full name"
              required
              value={formData.fullName}
              fullWidth
              onChange={e => setFormData({ ...formData, fullName: e.target.value })} />
          </div>
          <div className="col-md-5 mt-5">
            <TextField
              type="text"
              label="Mobile"
              required
              value={formData.phoneNumber}
              fullWidth
              onChange={e => setFormData({ ...formData, phoneNumber: e.target.value })} />
          </div>
          <div className="col-md-7 mt-5">
            <TextField
              type="email"
              label="Email"
              required
              value={formData.email}
              fullWidth
              onChange={e => setFormData({ ...formData, email: e.target.value })} />
          </div>
          <div className="col-md-6 mt-5">
            <TextField
              type="text"
              label="ID Number"
              required
              value={formData.idNumber}
              fullWidth
              onChange={e => setFormData({ ...formData, idNumber: e.target.value })} />
          </div>
          <div className="col-md-6 mt-5">
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
              type="text"
              label="Staff Number"
              required
              value={formData.serialNumber}
              placeholder="e.g 001"
              fullWidth
              onChange={e => setFormData({ ...formData, serialNumber: e.target.value })} />
          </div>
          <div className="col-md-4  mt-5">
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
                {Employers.map(k => <MenuItem value={k} key={k}>{k}</MenuItem>)}
              </Select>
            </FormControl>
          </div>
          <div className="col-md-4 mt-5">
            <TextField
              type="text"
              label="TSC/BOM Number"
              required
              value={formData.employmentNumber}
              placeholder="e.g T.S.C Number"
              fullWidth
              onChange={e => setFormData({ ...formData, employmentNumber: e.target.value })} />
          </div>
          <div className="col-md-6 mt-5">
            <FormControl>
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

          <Button
            size='large'
            variant='outlined'
            color='secondary'
            sx={{ ml: 4 }}
            onClick={openProfile}>Cancel</Button>
        </div>
      </form>
    </Paper>
  );
};

export default EditTeacher;
