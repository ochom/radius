import { gql, useQuery } from '@apollo/client';
import { AddPhotoAlternate, Adjust, Apartment, Assessment, Edit, EmojiEvents, EmojiEventsOutlined, Event, Gavel, Group, Info, People, Receipt, School, SchoolOutlined, Wc } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import { Avatar, Box, Button, Card, CircularProgress, Divider, Rating, Stack, Tab, Tabs, Typography } from "@mui/material";
import { useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { UploadService } from "../../API/uploads";
import { CustomSnackBar, defaultSnackStatus } from "../customs/alerts";
import { photo } from "../customs/avatars";
import { PageErrorAlert } from "../customs/empty-page";
import { CustomLoader } from "../customs/monitors";
import { panelProps, TabPanel } from "../customs/tabs";
import StudentParents from "./student_parents";


const FETCH_ONE = gql`
query($id:ID!){
  student: getStudent(id:$id){
    id
    fullName
    dateOfBirth
    dateOfAdmission
    gender
    admissionNumber
    nationalID
    passport
    age
    active
    homeAddress
    classroom{
      level
      stream
    }
  }
}`

const StudentDetails = () => {
  const { uid } = useParams()
  const history = useHistory()

  const [passport, setPassport] = useState(photo)
  const [saving, setSaving] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [tabIndex, setTabIndex] = useState(0)
  const [snackBar, setSnackBar] = useState(defaultSnackStatus);

  const { data, loading, error } = useQuery(FETCH_ONE, {
    variables: {
      id: uid
    },
    onCompleted: (res) => {
      if (res) {
        setPassport({ ...photo, url: res.student.passport })
      }
    },
    fetchPolicy: 'network-only',
    nextFetchPolicy: 'network-only'
  })

  const selectTab = (event, newValue) => {
    setTabIndex(newValue);
  };

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
      formData.append("id", data.student.id)
      formData.append("file", passport.image)

      new UploadService().uploadStudentPassPort(formData, (progressEvent) => {
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

  if (error) {
    return <PageErrorAlert message={error.message} />
  }

  return (
    <>
      <CustomSnackBar {...snackBar} onClose={closeSnackBar} />
      <Card>
        <Box sx={{ p: 3, display: 'flex' }} >
          <Stack>
            <div style={{ position: "relative" }}>
              <Avatar variant="rounded" src={passport.url} alt={data.student.fullName} sx={{ width: "10rem", height: "10rem", mb: 1, cursor: 'pointer' }} onClick={handleImage}>
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
              <Stack spacing={1.5} sx={{ ml: 5, alignItems: "start" }}>
                <Typography fontWeight={700}>{data.student.fullName}</Typography>
                <Typography variant="body2" color="text.secondary">
                  <Apartment sx={{ fontSize: "1.2rem" }} color="secondary" /> {data.student.classroom.level} {data.student.classroom.stream}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <Wc sx={{ fontSize: "1.2rem" }} color="secondary" />  {data.student.gender}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <Event sx={{ fontSize: "1.2rem" }} color="secondary" />  {data.student.age} yrs old
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <Adjust sx={{ fontSize: "1.2rem" }} color={data.student.active ? "success" : "disabled"} />  {data.student.active ? "Active" : "Not active"}
                </Typography>
              </Stack>

              <Stack spacing={3} sx={{ ml: { md: 5, lg: 20 } }}>
                <Stack direction="column">
                  <Typography variant="body2" color="text.secondary">Examination </Typography>
                  <Rating precision={0.5} name="read-only" value={4.5} readOnly size="large" icon={<School />} emptyIcon={<SchoolOutlined />} />
                </Stack>

                <Stack direction="column">
                  <Typography variant="body2" color="text.secondary">Discipline </Typography>
                  <Rating precision={0.5} name="read-only" value={1} readOnly size="large" icon={<EmojiEvents />} emptyIcon={<EmojiEventsOutlined />} />
                </Stack>
              </Stack>
            </Box>

            <Stack spacing={3} sx={{ ml: 5, mt: 3 }} direction='row'>
              <Button variant="contained" color='secondary' onClick={() => { history.push(`/students/profile/${data.student.id}/edit`) }}>
                <Edit /> <Typography sx={{ ml: 1 }}>Edit</Typography>
              </Button>
              <Button variant="outlined" color='secondary' onClick={() => { history.push(`/students`) }}>
                <People /> <Typography sx={{ ml: 1 }}>Back</Typography>
              </Button>
            </Stack>
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
            <Tab icon={<Info sx={{ fontSize: 20 }} />} iconPosition="start" label="Address"  {...panelProps(0)} />
            <Tab icon={<Group sx={{ fontSize: 20 }} />} iconPosition="start" label="Parents"  {...panelProps(1)} />
            <Tab icon={<School sx={{ fontSize: 20 }} />} iconPosition="start" label="Subjects"  {...panelProps(2)} />
            <Tab icon={<Assessment sx={{ fontSize: 20 }} />} iconPosition="start" label="Exams"  {...panelProps(3)} />
            <Tab icon={<Receipt sx={{ fontSize: 20 }} />} iconPosition="start" label="Invoices"  {...panelProps(4)} />
            <Tab icon={<EmojiEvents sx={{ fontSize: 20 }} />} iconPosition="start" label="Awards"  {...panelProps(5)} />
            <Tab icon={<Gavel sx={{ fontSize: 20 }} />} iconPosition="start" label="Discipline"  {...panelProps(6)} />
          </Tabs>
          <TabPanel value={tabIndex} index={0}>
            <div>
              <pre>{data.student.homeAddress}</pre>
            </div>
          </TabPanel>
          <TabPanel value={tabIndex} index={1}>
            <StudentParents studentID={uid} />
          </TabPanel>
          <TabPanel value={tabIndex} index={2}>
            <Box>
              <Button variant="contained" color="secondary">Add Subject</Button>
            </Box>
          </TabPanel>
          <TabPanel value={tabIndex} index={3}>Exams</TabPanel>
          <TabPanel value={tabIndex} index={4}>Invoices</TabPanel>
          <TabPanel value={tabIndex} index={5}>
            <Box>
              <Button variant="contained" color="secondary">Create Award</Button>
            </Box>
          </TabPanel>
          <TabPanel value={tabIndex} index={6}>
            <Box>
              <Button variant="contained" color="secondary">Add Case</Button>
            </Box>
          </TabPanel>
        </Box>
      </Card>
    </>
  );
};

export default StudentDetails;
