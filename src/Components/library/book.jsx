import { AddPhotoAlternate, Category, Event, PeopleAlt, Person } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import { Alert, Avatar, Card, CircularProgress, Container, Divider, Paper, Stack, Tab, Tabs, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Service } from '../../API/service';
import { UploadService } from '../../API/uploads';
import { CustomSnackBar, defaultSnackStatus } from '../customs/alerts';
import { photo } from '../customs/avatars';
import { CustomLoader } from '../customs/monitors';
import { panelProps, TabPanel } from '../customs/tabs';


export default function Book(props) {
  const { uid } = useParams();
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(false);

  const [tabIndex, setTabIndex] = useState(0)
  const [album, setAlbum] = useState(photo)
  const [book, setBook] = useState([]);
  const [teachers, setTeachers] = useState(null);
  const [students, setStudents] = useState(null);
  const [snackBar, setSnackBar] = useState(defaultSnackStatus);

  useEffect(() => {
    setLoading(true)
    let query = {
      query: `query($id: ID!){
        book: getBook(id: $id){
          id
          barcode
          title
          barcode
          author
          edition
          createdAt
          publisher{
            id
            name
          }
          category{
            id
            name
          }
          createdAt
        }
        lenders: getBookLenders(id: $id){
          students{
            id
          }
          teachers{
            id
          }
        }
      }`,
      variables: {
        id: uid
      }
    }
    new Service().getData(query).then((res) => {
      if (res) {
        setBook(res.book || null)
        setTeachers(res.lenders?.students || [])
        setStudents(res.lenders?.teachers || [])
      }
    }).finally(() => {
      setLoading(false)
    });
  }, [uid]);

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
        setAlbum({ url: URL.createObjectURL(el.files[0]), isNew: true, image: el.files[0] })
      }
    })
    el.click()

  }

  const submitAlbum = (e) => {
    if (album.image) {
      setSaving(true)
      let formData = new FormData()
      formData.append("id", uid)
      formData.append("file", album.image)

      new UploadService().uploadStudentPassPort(formData, (progressEvent) => {
        const { loaded, total } = progressEvent;
        let percent = Math.floor((loaded * 100) / total);
        setUploadProgress(percent)
      }).then((res) => {
        if (res?.status === 200) {
          setAlbum({ ...album, isNew: false })
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

  if (!loading && !book) {
    return (
      <Container>
        <Paper sx={{ p: 10, }}>
          <Alert severity="warning">Book not found</Alert>
        </Paper>
      </Container>
    )
  }

  return (
    <>
      <CustomSnackBar {...snackBar} onClose={closeSnackBar} />
      <Container>
        <Card>
          <Box sx={{ p: 3, display: 'flex' }} >
            <Stack>
              <div style={{ position: "relative" }}>
                <Avatar variant="rounded" src={album.url} alt={book.title} sx={{ width: "10rem", height: "10rem", mb: 1, cursor: 'pointer' }} onClick={handleImage}>
                  <AddPhotoAlternate sx={{ fontSize: "8rem" }} />
                </Avatar>
                {saving &&
                  <Avatar variant="rounded" sx={{ position: "absolute", width: "10rem", height: "10rem", top: 0, left: 0, bgcolor: "#555555e2" }} >
                    <CircularProgress variant="determinate" value={uploadProgress} color="secondary" style={{ width: "7rem", height: "7rem" }} />
                  </Avatar>
                }
              </div>
              {(album.isNew && !saving) &&
                <LoadingButton
                  type='submit'
                  variant='contained'
                  color='secondary'
                  loading={saving}
                  onClick={submitAlbum}>Upload</LoadingButton>}
            </Stack>
            <Box >
              <Box sx={{ display: 'flex' }}>
                <Stack spacing={1.5} sx={{ ml: 5, alignItems: "start" }}>
                  <Typography fontWeight={700} variant='h5'>{book.title}
                    <Typography variant='body2' color="GrayText">{book.category.name}</Typography>
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <Category sx={{ fontSize: "1.2rem" }} color="secondary" /> {book.publisher.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <Event sx={{ fontSize: "1.2rem" }} color="secondary" />  {book.edition} Edition
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <Person sx={{ fontSize: "1.2rem" }} color="secondary" />  {book.author}
                  </Typography>
                </Stack>
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
              <Tab icon={<PeopleAlt sx={{ fontSize: 20 }} />} iconPosition="start" label="Students (231)"  {...panelProps(0)} />
              <Tab icon={<Person sx={{ fontSize: 20 }} />} iconPosition="start" label="Teachers  (33)"  {...panelProps(1)} />
            </Tabs>
            <TabPanel value={tabIndex} index={0}>
              <div>
                Students
                {(students || []).map(s => <p>Hello</p>)}
              </div>
            </TabPanel>
            <TabPanel value={tabIndex} index={1}>
              <div>
                teachers
                {(teachers || []).map(s => <p>Hello</p>)}
              </div>
            </TabPanel>
          </Box>
        </Card>
      </Container>
    </>
  );
}
