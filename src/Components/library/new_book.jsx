import { gql, useLazyQuery, useMutation, useQuery } from '@apollo/client';
import { Cancel, Save } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import { Alert, Button, FormControl, InputLabel, MenuItem, Paper, Select, Stack, TextField, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { AlertFailed, AlertSuccess } from '../customs/alerts';
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

const GET_CATEGORIES_QUERY = gql`
query{
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


const GET_BOOK_QUERY = gql`
query ($data: String!){
  book: getBookByISBN(isbn: $data){
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
}
`

const CREATE_MUTATION = gql`
  mutation ($data: NewBook!){
    createBook(input: $data)
  }
`

export default function NewBook() {
  const history = useHistory()
  const [formData, setFormData] = useState(initialFormData)
  const [searched, setSearched] = useState(false)
  const [saved, setSaved] = useState(false)

  const { data } = useQuery(GET_CATEGORIES_QUERY)

  const [getBookCommand, { data: searchResult, searching }] = useLazyQuery(GET_BOOK_QUERY, {
    onCompleted: (res) => {
      if (res?.book) {
        AlertSuccess({ text: `Book already registered` });
      }
      setSearched(true)
    },
    fetchPolicy: 'no-cache',
    nextFetchPolicy: 'no-cache'
  })

  const [createCommand, { loading: creating, reset: resetCreate }] = useMutation(CREATE_MUTATION, {
    onCompleted: () => {
      setSaved(true)
      resetCreate();
    },
    onError: (err) => {
      AlertFailed({ text: err.message });
      resetCreate();
    }
  })

  const onNewBook = () => {
    setFormData(initialFormData)
    setSearched(false)
    setSaved(false)
  };

  const submitForm = (e) => {
    e.preventDefault();
    createCommand({
      variables: {
        data: formData
      }
    })
  };


  const searchBook = (e) => {
    e.preventDefault()
    getBookCommand({
      variables: {
        data: formData.isbn
      }
    })
  }

  const openAllBooks = () => {
    history.push('/library/books')
  }

  if (searching) {
    return <CustomLoader />
  }

  if (saved) {
    return (
      <Paper className='col-md-8 mx-auto'>
        <Box sx={{ py: 5 }}>
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
            <Alert color='success' >Book Saved successfully</Alert>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
            <Button variant='contained' color='secondary' onClick={onNewBook}>Add Another Book</Button>
          </Box>
        </Box>
      </Paper>
    )
  }

  return (
    <Paper className='col-md-8 mx-auto'>
      {!searched &&
        <Box sx={{ p: 5 }}>
          <Typography variant='h4'>Enter Book's ISBN</Typography>
          <form onSubmit={searchBook} method="post">
            <Box sx={{ mt: 5 }}>
              <TextField
                value={formData.isbn}
                label="ISBN"
                required
                autoFocus={true}
                color="secondary"
                fullWidth
                onChange={(e) => setFormData({ ...formData, isbn: e.target.value })}
              />
            </Box>
            <Box sx={{ display: 'flex', mt: 3, justifyContent: 'center' }}>
              <Button color="secondary" variant="contained" type="submit" sx={{ mr: 3 }}>Continue</Button>
              <Button color="secondary" variant="outlined" onClick={openAllBooks}>Cancel</Button>
            </Box>
          </form>
        </Box>
      }

      {(searched && !searchResult.book) &&
        <Box sx={{ p: 5 }}>
          <Typography variant='h4'>Enter Details</Typography>
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
                loading={creating}
                loadingPosition="start"
                startIcon={<Save />}>Save</LoadingButton>
              <Button color='secondary' variant='outlined' onClick={openAllBooks}><Cancel /> Cancel</Button>
            </Stack>
          </form>
        </Box>
      }
    </Paper>
  );
}
