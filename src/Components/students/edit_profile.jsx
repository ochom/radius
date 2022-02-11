import { Edit, Save } from '@mui/icons-material';
import DateAdapter from '@mui/lab/AdapterMoment';
import LoadingButton from '@mui/lab/LoadingButton';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import MobileDatePicker from '@mui/lab/MobileDatePicker';
import { Alert, Button, Card, FormControl, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { useHistory, useParams } from 'react-router-dom';
import { Service } from '../../API/service';
import { Gender } from '../../app/constants';
import {
  AlertFailed,
  AlertSuccess
} from "../customs/alerts";
import { CustomLoader } from '../customs/monitors';


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

const EditStudent = (props) => {
  const { uid } = useParams()
  const history = useHistory()

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const [formData, setFormData] = useState(initialFormData)

  const [classrooms, setClassrooms] = useState([]);


  useEffect(() => {
    let query = {
      query: `query loadData($id: ID!){
        classrooms: getClassrooms{
          id
          level
          stream
        }
        student: getStudent(id: $id){
          fullName,
          admissionNumber,
          dateOfAdmission,
          nationalID,
          gender,
          dateOfBirth,
          homeAddress,
          classroom{
            id
          }
        }
      }`,
      variables: {
        id: uid
      }
    }
    new Service().getData(query).then((res) => {
      setClassrooms(res?.classrooms.sort((a, b) => a.level > b.level) || [])
      setFormData({
        fullName: res?.student.fullName,
        classID: res?.student.classroom.id,
        admissionNumber: res?.student.admissionNumber,
        dateOfAdmission: res?.student.dateOfAdmission,
        nationalID: res?.student.nationalID,
        gender: res?.student.gender,
        dateOfBirth: res?.student.dateOfBirth,
        homeAddress: res?.student.homeAddress,
      })
      setLoading(false)
    });
  }, [uid]);

  const submitForm = e => {
    e.preventDefault();
    setSaving(true)
    let query =
    {
      query: `mutation ($id:ID!, $data: NewStudent!){
        student: updateStudent(id: $id, input: $data)
      }`,
      variables: {
        id: uid,
        data: formData
      }
    }

    new Service().createOrUpdate(query).then((res) => {
      if (res.status === 200) {
        AlertSuccess({ text: `Student details updated` });
        setSaved(true)
      } else {
        AlertFailed({ text: res.message });
      }
    }).finally(() => {
      setSaving(false)
    });
  };

  const openProfile = () => {
    history.push(`/students/profile/${uid}`)
  }


  if (loading) {
    return (
      <Card >
        <CustomLoader />
      </Card>
    )
  }

  if (saved) {
    return (
      <Card>
        <div className="py-5">
          <div className="d-flex justify-content-center my-5">
            <Alert severity='success'>Student details updated successfully</Alert>
          </div>
          <div className="d-flex justify-content-center">
            <Button variant='contained' color='secondary' onClick={openProfile}>Go to Student Profile</Button>
          </div>
        </div>
      </Card>
    )
  }

  return (
    <>
      <Card>
        <div className="d-flex my-3">
          <Button variant="outlined" color='secondary'>
            <Edit />
          </Button>
          <div className="ms-4">
            <h3 className='p-0 m-0'>Edit Student</h3>
            <p className='text-secondary m-0'>edit student profile profile.</p>
          </div>
        </div>
        <form onSubmit={submitForm} method="post">
          <div className="row">
            <div className="mt-3">
              <TextField type="text" label="Full name"
                required
                value={formData.fullName}
                fullWidth
                onChange={e => setFormData({ ...formData, fullName: e.target.value })} />
            </div>
            <div className="col-md-6 mt-4">
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
            </div>
            <div className="col-md-6 mt-4">
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
            <div className="col-md-6 mt-4">
              <TextField
                type="text"
                label="Admission Number"
                required
                value={formData.admissionNumber}
                fullWidth
                onChange={e => setFormData({ ...formData, admissionNumber: e.target.value })} />
            </div>
            <div className="col-md-6 mt-4">
              <TextField type="text" label="NEMIS"
                required
                value={formData.nationalID}
                fullWidth
                onChange={e => setFormData({ ...formData, nationalID: e.target.value })} />
            </div>

            <div className="col-md-6 mt-4">
              <LocalizationProvider dateAdapter={DateAdapter}>
                <MobileDatePicker
                  label="Date of admission"
                  inputFormat="DD/MM/yyyy"
                  value={formData.dateOfAdmission}
                  onChange={val => setFormData({ ...formData, dateOfAdmission: val })}
                  renderInput={(params) => <TextField fullWidth {...params} />}
                />
              </LocalizationProvider>
            </div>
            <div className="col-md-6 mt-4">
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
            </div>
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
      </Card>
    </>
  );
};

export default EditStudent;
