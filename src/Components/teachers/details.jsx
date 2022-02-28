import { gql, useMutation, useQuery } from '@apollo/client';
import { AddPhotoAlternate, Assignment, Edit, Event, Phone, School, Wc } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import { Avatar, Box, Button, Card, CircularProgress, Divider, Stack, Tab, Tabs, Typography } from "@mui/material";
import { useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { CustomSnackBar, defaultSnackStatus } from "../customs/alerts";
import { photo } from "../customs/avatars";
import { PageErrorAlert } from "../customs/empty-page";
import { CustomLoader } from "../customs/monitors";
import { panelProps, TabPanel } from "../customs/tabs";


const FETCH_ONE_QUERY = gql`query($id:ID!){
  teacher: getTeacher(id:$id){
    id
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
    age
  }
}`

const UPLOAD_IMAGE_MUTATION = gql`mutation ($id: ID!, $file: Upload!){
  uploadTeacherImage(id:$id, file: $file)
}`

const TeacherDetails = (props) => {
  const { uid } = useParams()
  const history = useHistory()

  const [teacher, setTeacher] = useState(false);
  const [passport, setPassport] = useState(photo)
  const [tabIndex, setTabIndex] = useState(0)
  const [snackBar, setSnackBar] = useState(defaultSnackStatus);

  const { loading, error } = useQuery(FETCH_ONE_QUERY, {
    fetchPolicy: 'network-only',
    variables: {
      id: uid
    },
    onCompleted: (res) => {
      setTeacher(res?.teacher)
      setPassport({ ...photo, url: res?.teacher.passport })
    }
  })

  const [uploadImage, { loading: saving, reset }] = useMutation(UPLOAD_IMAGE_MUTATION, {
    onCompleted: () => {
      setPassport({ ...passport, isNew: false })
      setSnackBar({ open: true, message: "Photo uploaded successfully", severity: "success" })
      reset()
    },
    onError: err => {
      setSnackBar({ open: true, message: err.message, severity: "error" })
      reset()
    }
  })

  const selectTab = (event, newValue) => {
    setTabIndex(newValue);
  };

  const handleImage = () => {
    var el = window._protected_reference = document.createElement("INPUT");
    el.type = "file";
    el.accept = "image/*";
    el.addEventListener("change", () => {
      window._protected_reference = null
      if (el.files.length) {
        setPassport({ url: URL.createObjectURL(el.files[0]), isNew: true, image: el.files[0] })
      }
    })
    el.click()
  }

  const submitPassport = () => {
    if (passport.image) {
      uploadImage({
        variables: {
          id: teacher.id,
          file: passport.image
        }
      })
    }
  }


  const closeSnackBar = () => {
    setSnackBar({ ...snackBar, open: false })
  }

  if (loading) return <CustomLoader />

  if (error) return <PageErrorAlert message={error.message} />

  return (
    <>
      <CustomSnackBar {...snackBar} onClose={closeSnackBar} />
      <Card>
        <Box sx={{ p: 3, display: 'flex' }} >
          <Stack>
            <div style={{ position: "relative" }}>
              <Avatar variant="rounded" src={passport.url} alt={teacher.fullName} sx={{ width: "10rem", height: "10rem", mb: 1, cursor: 'pointer' }} onClick={handleImage}>
                <AddPhotoAlternate sx={{ fontSize: "8rem" }} />
              </Avatar>
              {saving &&
                <Avatar variant="rounded" sx={{ position: "absolute", width: "10rem", height: "10rem", top: 0, left: 0, bgcolor: "#555555e2" }} >
                  <CircularProgress variant="indeterminate" color="secondary" size="3rem" />
                </Avatar>
              }
            </div>
            {(passport.isNew && !saving) &&
              <LoadingButton
                type='submit'
                variant='contained'
                color='secondary'
                loading={saving}
                onClick={submitPassport}>Upload</LoadingButton>}
          </Stack>
          <Box >
            <Box sx={{ display: 'flex' }}>
              <Stack spacing={2} sx={{ ml: 5, alignItems: "start" }}>
                <Stack direction="column" spacing={0}>
                  <Typography fontWeight={700}>{teacher.title} {teacher.fullName}</Typography>
                  <Typography variant="body2" color="text.secondary">{teacher.email} </Typography>
                </Stack>
                <Typography variant="body2" color="text.secondary">
                  <Wc sx={{ fontSize: "1.2rem" }} color="secondary" />  {teacher.gender}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <Event sx={{ fontSize: "1.2rem" }} color="secondary" />  {teacher.age} yrs old
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <Phone sx={{ fontSize: "1.2rem" }} color="secondary" />  {teacher.phoneNumber}
                </Typography>
              </Stack>

              <Stack spacing={3} sx={{ ml: { md: 5, lg: 20 } }}>
                <Stack direction="column" spacing={1}>
                  <Typography variant="body2" color="text.secondary">Employer </Typography>
                  <Typography variant="body1">{teacher.employer} </Typography>
                </Stack>

                <Stack direction="column" spacing={1}>
                  <Typography variant="body2" color="text.secondary">Employment Number</Typography>
                  <Typography variant="body1">{teacher.employmentNumber} </Typography>
                </Stack>
              </Stack>
            </Box>

            <Box sx={{ ml: 5, mt: 3 }}>
              <Button variant="outlined" color='secondary' onClick={() => { history.push(`/teachers/profile/${teacher.id}/edit`) }}>
                <Edit /> <Typography sx={{ ml: 1 }}>Edit</Typography>
              </Button>
            </Box>
          </Box>
        </Box>
        <Divider />
        <Box sx={{ width: '100%' }}>
          <Tabs
            sx={{ borderBottom: '1px solid #e8e8e8', }}
            value={tabIndex}
            onChange={selectTab}
            textColor="secondary"
            indicatorColor="secondary">
            <Tab icon={<School sx={{ fontSize: 20 }} />} iconPosition="start" label="Subjects"  {...panelProps(0)} />
            <Tab icon={<Assignment sx={{ fontSize: 20 }} />} iconPosition="start" label="Classrooms"  {...panelProps(1)} />
          </Tabs>
          <TabPanel value={tabIndex} index={0}>Subjects</TabPanel>
          <TabPanel value={tabIndex} index={1}>Classrooms</TabPanel>
        </Box>
      </Card>
    </>
  );
};

export default TeacherDetails;
