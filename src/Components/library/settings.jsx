import { gql, useMutation, useQuery } from '@apollo/client';
import { Book, Edit, Image, Person, Timelapse } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import { Avatar, Button, Card, List, ListItem, ListItemAvatar, ListItemText, Stack, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import { AlertFailed, AlertSuccess } from '../customs/alerts';
import { PageErrorAlert } from '../customs/empty-page';
import { CustomLoader } from '../customs/monitors';

const FETCH_QUERY = gql`query{
  settings: getLibrarySettings{
    librarian
    maxStudentsBooks
    maxStudentsPeriod
    maxTeachersBooks
    maxTeachersPeriod
  }
}`

const UPDATE_MUTATION = gql`mutation($data: LibrarySettingsInput!){
  updateLibrarySettings(input: $data)
}`


const initFormData = {
  librarian: "",
  maxStudentsBooks: "",
  maxStudentsPeriod: "",
  maxTeachersBooks: "",
  maxTeachersPeriod: ""
}


export default function Settings() {
  const [edit, setEdit] = useState(true)
  const [formData, setFormData] = useState(initFormData)

  const { data, loading, error, refetch } = useQuery(FETCH_QUERY, {
    fetchPolicy: 'network-only',
    onCompleted: (res) => {
      if (res.settings) {
        let {
          librarian,
          maxStudentsBooks,
          maxStudentsPeriod,
          maxTeachersBooks,
          maxTeachersPeriod
        } = res.settings
        setFormData({
          librarian,
          maxStudentsBooks,
          maxStudentsPeriod,
          maxTeachersBooks,
          maxTeachersPeriod
        })
      }
    }
  })


  const [updateData, { loading: saving, reset }] = useMutation(UPDATE_MUTATION, {
    onCompleted: () => {
      refetch()
      reset()
      toggleEdit()
      AlertSuccess({ text: "Settings updated successfully" })
    },
    onError: (err) => {
      AlertFailed({ text: err.message })
    }
  })
  const toggleEdit = () => setEdit(!edit)

  const saveSettings = e => {
    e.preventDefault()
    updateData({
      variables: {
        data: formData
      }
    })
  }

  if (loading) {
    return <CustomLoader />
  }

  if (error) {
    return <PageErrorAlert message={error.message} />
  }

  return (
    <>
      <Typography sx={{ my: 3 }}>Library Settings</Typography>
      <Card sx={{ p: 5 }}>
        {edit ?
          <form onSubmit={saveSettings}>
            <Stack spacing={5}>
              <TextField label="Librarian" color="secondary" value={formData.librarian} onChange={e => setFormData({ ...formData, librarian: e.target.value })} />
              <TextField label="Students' Maximum Books" color="secondary" value={formData.maxStudentsBooks} onChange={e => setFormData({ ...formData, maxStudentsBooks: e.target.value })} />
              <TextField label="Students' Maximum Books" color="secondary" value={formData.maxStudentsPeriod} onChange={e => setFormData({ ...formData, maxStudentsPeriod: e.target.value })} />
              <TextField label="Staffs' Maximum Books" color="secondary" value={formData.maxTeachersBooks} onChange={e => setFormData({ ...formData, maxTeachersBooks: e.target.value })} />
              <TextField label="Staffs' Max Lending Duration" color="secondary" value={formData.maxTeachersPeriod} onChange={e => setFormData({ ...formData, maxTeachersPeriod: e.target.value })} />
              <Stack direction="row" spacing={3}>
                <LoadingButton variant='contained' color='secondary' type="submit" loading={saving}>Save</LoadingButton>
                <Button variant='outlined' color='secondary' onClick={toggleEdit}>Cancel</Button>
              </Stack>
            </Stack>
          </form>
          :
          <List spacing={3} sx={{ pt: 3, position: 'relative' }}>
            <Button color='secondary' variant='outlined' sx={{ position: 'absolute', right: 0, top: 0 }} className="no-transform"
              onClick={toggleEdit}>
              <Edit sx={{ fontSize: 16, mr: 1 }} /> Edit
            </Button>
            <ListItem>
              <ListItemAvatar>
                <Avatar>
                  <Person />
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary="Librarian" secondary={`${data.settings.librarian}`} />
            </ListItem>

            <ListItem>
              <ListItemAvatar>
                <Avatar>
                  <Book />
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary="Student Books" secondary={`${data.settings.maxStudentsBooks}`} />
            </ListItem>

            <ListItem>
              <ListItemAvatar>
                <Avatar>
                  <Timelapse />
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary="Students' Max Lending Duration" secondary={`${data.settings.maxStudentsPeriod} Days`} />
            </ListItem>

            <ListItem>
              <ListItemAvatar>
                <Avatar>
                  <Book />
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary="Staffs' Max Lending Duration" secondary={`${data.settings.maxTeachersBooks}`} />
            </ListItem>

            <ListItem>
              <ListItemAvatar>
                <Avatar>
                  <Timelapse />
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary="Staffs' Max Lending Duration" secondary={`${data.settings.maxTeachersPeriod} Days`} />
            </ListItem>
          </List>
        }
      </Card>
    </>
  );
}
