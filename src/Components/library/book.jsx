import { AddPhotoAlternate, Apartment, Event, PeopleAlt, Person, Wc } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import { Alert, Avatar, Card, CircularProgress, Container, Divider, Paper, Stack, Tab, Tabs, Typography } from '@mui/material';
import { Box } from '@mui/system';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Service } from '../../API/service';
import { CustomLoader } from '../customs/monitors';
import { panelProps, TabPanel } from '../customs/tabs';



const photo = {
  url: "",
  image: null,
  isNew: false,
}


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

  useEffect(() => {
    setLoading(true)
    let query = {
      query: `query($id: ID!){
        book: getBook(id: $id){
          id
          barcode
          title
          barcode
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

  }

  const submitAlbum = (e) => {

  }


  const cols = [
    { name: "Barcode", selector: (row) => row.barcode, sortable: true },
    { name: "Title", selector: (row) => row.title, sortable: true },
    { name: "Category", selector: (row) => row.category, sortable: true },
    { name: "Publisher", selector: (row) => row.publisher, sortable: true },
    { name: "Created", selector: (row) => row.created, sortable: true },
    {
      selector: row => row.action,
      style: {
        color: "grey"
      },
      allowOverflow: true,
      button: true,
      width: '56px',
    },
  ]


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
      <Container>
        <Card>
          <Box sx={{ p: 3, display: 'flex' }} >
            <Stack>
              <div style={{ position: "relative" }}>
                <Avatar variant="rounded" src={book.title} alt={book.title} sx={{ width: "10rem", height: "10rem", mb: 1, cursor: 'pointer' }} onClick={handleImage}>
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
                  <Typography fontWeight={700}>{book.title}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    <Apartment sx={{ fontSize: "1.2rem" }} color="secondary" /> {book.category.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <Wc sx={{ fontSize: "1.2rem" }} color="secondary" />  {book.publisher.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <Event sx={{ fontSize: "1.2rem" }} color="secondary" />  {book.edition} Edition
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <Event sx={{ fontSize: "1.2rem" }} color="secondary" />  {book.author}
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
              <Tab icon={<PeopleAlt sx={{ fontSize: 20 }} />} iconPosition="start" label="Students"  {...panelProps(0)} />
              <Tab icon={<Person sx={{ fontSize: 20 }} />} iconPosition="start" label="Teachers"  {...panelProps(1)} />
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
