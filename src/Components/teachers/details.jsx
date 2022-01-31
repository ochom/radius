import { Alert, Avatar, Box, Button, Card, CircularProgress, Divider, Paper, Stack, Tab, Tabs, Typography } from "@mui/material";
import { useState, useEffect } from "react";
import { Service } from '../../API/service';
import { CustomLoader } from "../customs/monitors"
import { AddPhotoAlternate, Assignment, Edit, Event, Phone, School, Wc } from "@mui/icons-material";
import { panelProps, TabPanel } from "../customs/tabs";
import { useHistory, useParams } from "react-router-dom";
import { LoadingButton } from "@mui/lab";
import { UploadService } from "../../API/uploads";
import { CustomSnackBar } from "../customs/alerts";

const photo = {
  url: "",
  image: null,
  isNew: false,
}

const defaultSnackStatus = {
  open: false,
  message: "hey there",
  severity: "success"
}

const TeacherDetails = (props) => {
  const { uid } = useParams()
  const history = useHistory()

  const [teacher, setTeacher] = useState(false);
  const [passport, setPassport] = useState(photo)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)
  const [tabIndex, setTabIndex] = useState(0)
  const [snackBar, setSnackBar] = useState(defaultSnackStatus);


  const selectTab = (event, newValue) => {
    setTabIndex(newValue);
  };

  useEffect(() => {
    let query = {
      query: `
        query($id:ID!){
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
        }
      `,
      variables: {
        id: uid
      }
    }
    new Service().getData(query).then((res) => {
      setTeacher(res?.teacher)
      setPassport({ ...photo, url: res?.teacher.passport })
      setLoading(false)
    });
  }, [uid]);

  const handleImage = (e) => {
    var el = window._protected_reference = document.createElement("INPUT");
    el.type = "file";
    el.accept = "image/*";
    el.addEventListener("change", (e2) => {
      window._protected_reference = null
      if (el.files.length) {
        setPassport({ url: URL.createObjectURL(el.files[0]), isNew: true, image: el.files[0] })
      }
    })
    el.click()
  }

  const submitPassport = (e) => {
    if (passport.image) {
      setSaving(true)
      let formData = new FormData()
      formData.append("id", teacher.id)
      formData.append("file", passport.image)

      new UploadService().uploadTeacherPassPort(formData, (progressEvent) => {
        const { loaded, total } = progressEvent;
        let percent = Math.floor((loaded * 100) / total);
        setUploadProgress(percent)
      }).then((res) => {
        if (res?.status === 200) {
          setPassport({ ...passport, isNew: false })
          setSnackBar({ open: true, message: "Photo uploaded successfully", severity: "success" })
        } else {
          setSnackBar({ open: true, message: "Photo uploaded failed", severity: "error" })
        }
      }).finally(() => {
        setSaving(false)
        setUploadProgress(0)
      });
    }
  }

  const closeSnackBar = () => {
    setSnackBar({ ...snackBar, open: false })
  }

  if (loading) {
    return <CustomLoader />
  }

  if (!teacher) {
    return (
      <Paper sx={{ px: 5, py: 2 }}>
        <div className="py-5 d-flex justify-content-center"><Alert severity="warning">Teacher not found</Alert></div>
      </Paper>
    )
  }

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
                  <CircularProgress variant="determinate" value={uploadProgress} color="secondary" style={{ width: "7rem", height: "7rem" }} />
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

            <Box sx={{ ml: 5, mt: 3, display: 'flex' }}>
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