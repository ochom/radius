import { gql, useMutation, useQuery } from '@apollo/client';
import { Cancel, Save } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import { Alert, Box, Button, FormControl, InputLabel, MenuItem, Paper, Select, Stack, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { AlertFailed, AlertSuccess } from '../customs/alerts';
import { PageErrorAlert } from '../customs/errors';
import { CustomLoader } from '../customs/monitors';

const initialFormData = {
  isbn: "",
  title: "",
  author: "",
  edition: "",
  publisherID: "",
  categoryID: "",
  metaData: ""
}


const GET_BOOK_QUERY = gql`
  query ($id: ID!){
    book: getBook(id: $id){
      id
      isbn
      title
      author
      edition
      publisher{
        id
        name
      }
      category{
        id
        name
      }
      metaData
    }
    categories: getBookCategories{
      id
      name
    }
    publishers: getPublishers{
      id
      name
    }
  }
`


const UPDATE_MUTATION = gql`
  mutation ($id: ID!, $data: NewBook!){
    updateBook(id: $id, input: $data)
  }
`


export default function EditBook() {
  const { uid } = useParams()

  const history = useHistory()
  const [formData, setFormData] = useState(initialFormData)
  const [saved, setSaved] = useState(false)

  const { data, loading, error } = useQuery(GET_BOOK_QUERY, {
    variables: {
      id: uid,
    },
    onCompleted: (res) => {
      if (res.book) {
        let book = res.book
        setFormData({
          ...formData,
          isbn: book.isbn,
          title: book.title,
          author: book.author,
          edition: book.edition,
          categoryID: book.category.id,
          publisherID: book.publisher.id,
          metaData: book.metaData
        })
      }
    },
    fetchPolicy: 'no-cache',
    nextFetchPolicy: 'no-cache'
  })

  const [updateCommand, { loading: updating, reset }] = useMutation(UPDATE_MUTATION, {
    onCompleted: () => {
      setSaved(true)
    },
    onError: (err) => {
      AlertFailed({ text: err.message });
      reset();
    }
  })



  const submitForm = (e) => {
    e.preventDefault();
    updateCommand({
      variables: {
        id: uid,
        data: formData
      }
    })
  };


  const openAllBooks = () => {
    history.push("/library/books")
  }

  if (loading) {
    return <CustomLoader />
  }

  if (error) {
    return <PageErrorAlert message={error.message} />
  }

  if (saved) {
    return (
      <Paper className='col-md-8 mx-auto'>
        <Box sx={{ py: 5 }}>
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
            <Alert color='success' >Book Updated successfully</Alert>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
            <Button variant='contained' color='secondary' onClick={openAllBooks}>GO TO BOOKS</Button>
          </Box>
        </Box>
      </Paper>
    )
  }

  return (
    <Paper className='col-md-8 mx-auto'>
      <Box sx={{ p: 5 }}>
        <Typography variant='h4'>Update Details</Typography>
        <form onSubmit={submitForm} method="post">
          <Box className="row" sx={{ py: 3 }}>
            <Box className="mt-3">
              <TextField
                label="ISBN"
                color="secondary"
                required
                aria-readonly
                fullWidth
                value={formData.isbn}
                onChange={(e) => setFormData({ ...formData, isbn: e.target.value })}
              />
            </Box>
            <Box className="mt-3">
              <TextField
                label="Book title"
                color="secondary"
                required
                fullWidth
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </Box>
            <Box className="mt-3 col-6">
              <TextField
                label="Edition"
                color="secondary"
                fullWidth
                value={formData.edition}
                onChange={(e) => setFormData({ ...formData, edition: e.target.value })}
              />
            </Box>
            <Box className="mt-3 col-6">
              <FormControl fullWidth color='secondary'>
                <InputLabel id="category-label">Book Category</InputLabel>
                <Select
                  labelId="category-label"
                  id="category"
                  label="Book Category"
                  required
                  value={formData.categoryID}
                  onChange={e => setFormData({ ...formData, categoryID: e.target.value })}
                >
                  {data?.categories.map(k => <MenuItem value={k.id} key={k.id}>{k.name}</MenuItem>)}
                </Select>
              </FormControl>
            </Box>
            <Box className="mt-3">
              <TextField
                label="Author"
                color="secondary"
                fullWidth
                value={formData.author}
                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
              />
            </Box>
            <Box className="mt-3">
              <FormControl fullWidth color='secondary'>
                <InputLabel id="publisher-label">Publisher</InputLabel>
                <Select
                  labelId="publisher-label"
                  id="publisher"
                  label="Publisher"
                  required
                  value={formData.publisherID}
                  onChange={e => setFormData({ ...formData, publisherID: e.target.value })}
                >
                  {data?.publishers.map(k => <MenuItem value={k.id} key={k.id}>{k.name}</MenuItem>)}
                </Select>
              </FormControl>
            </Box>
            <Box className="mt-3">
              <TextField
                label="Other"
                color="secondary"
                multiline
                rows={4}
                fullWidth
                value={formData.metaData}
                onChange={(e) => setFormData({ ...formData, metaData: e.target.value })}
              />
            </Box>
          </Box>
          <Stack spacing={3} direction='row' sx={{ display: 'flex', mt: 3, }}>
            <LoadingButton
              type='submit'
              variant='contained'
              color='secondary'
              size='large'
              loading={updating}
              loadingPosition="start"
              startIcon={<Save />}>Save</LoadingButton>
            <Button color='secondary' variant='outlined' onClick={openAllBooks}><Cancel /> Cancel</Button>
          </Stack>
        </form>
      </Box>
    </Paper>
  );
}
