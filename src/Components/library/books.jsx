import { gql, useMutation, useQuery } from '@apollo/client';
import { Add, Assignment, Delete, Edit, Photo } from '@mui/icons-material';
import { Avatar, Box, Button, CircularProgress } from '@mui/material';
import { CustomSnackBar, defaultSnackStatus } from "../customs/alerts";
import moment from 'moment';
import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { AlertFailed, AlertSuccess, AlertWarning, ConfirmAlert } from '../customs/alerts';
import { photo } from '../customs/avatars';
import { PageErrorAlert } from '../customs/empty-page';
import { DropdownMenu } from '../customs/menus';
import { CustomLoader } from '../customs/monitors';
import { DataTable } from '../customs/table';


const GET_ALL_QUERY = gql`query{
  books: getBooks{
    id
    isbn
    title
    cover
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
}`

const UPLOAD_IMAGE_MUTATION = gql`mutation ($id: ID!, $file: Upload!){
  uploadBookImage(id:$id, file: $file)
}`

const DELETE_MUTATION = gql`mutation deleteBook($id: ID!){
  deleteBook(id: $id)
}`

export default function Books() {

  const history = useHistory()
  const [selectedBookID, setSelectedBookID] = useState(null)
  const [bookCover, setBookCover] = useState(null)
  const [snackBar, setSnackBar] = useState(defaultSnackStatus);


  const { loading, error, data, refetch } = useQuery(GET_ALL_QUERY, {
    fetchPolicy: 'network-only',
    nextFetchPolicy: 'network-only'
  })


  const [uploadImage, { loading: saving, reset }] = useMutation(UPLOAD_IMAGE_MUTATION, {
    onCompleted: () => {
      setSnackBar({ open: true, message: "Photo uploaded successfully", severity: "success" })
      refetch()
      reset()
    },
    onError: err => {
      setSnackBar({ open: true, message: err.message, severity: "error" })
      reset()
    }
  })


  const [deleteCommand] = useMutation(DELETE_MUTATION, {
    onCompleted: () => {
      AlertSuccess({ text: `Book deleted successfully` });
      refetch();
    },
    onError: (err) => {
      AlertFailed({ text: err.message });
    }
  })

  const deleteBook = ({ id }) => {
    ConfirmAlert({ title: "Delete book!" }).then((res) => {
      if (res.isConfirmed) {
        deleteCommand({
          variables: {
            id: id
          }
        })
      } else if (res.isDismissed) {
        AlertWarning({ title: "Cancelled", text: "Request cancelled, book not deleted" })
      }
    });
  };

  const onNewBook = () => {
    history.push("/library/books/new")
  }

  const editBook = ({ id }) => {
    history.push(`/library/books/edit/${id}`)
  }

  const handleImage = ({ id }) => {
    setSelectedBookID(id)
    var el = window._protected_reference = document.createElement("INPUT");
    el.type = "file";
    el.accept = "image/*";
    el.addEventListener("change", (e2) => {
      window._protected_reference = null
      if (el.files.length) {
        setBookCover(URL.createObjectURL(el.files[0]))
        uploadImage({
          variables: {
            id,
            file: el.files[0]
          }
        })
      }
    })
    el.click()
  }

  const closeSnackBar = () => {
    setSnackBar({ ...snackBar, open: false })
  }


  let dropMenuOptions = [
    { "title": "Edit", action: editBook, icon: <Edit fontSize="small" /> },
    { "title": "Cover", action: handleImage, icon: <Photo fontSize="small" /> },
    { "title": "Delete", action: deleteBook, icon: <Delete fontSize="small" color="red" /> }
  ]

  const cols = [
    {
      name: "", selector: (row) => row.cover,
      width: '80px',
    },
    { name: "ISBN", selector: (row) => row.isbn, sortable: true },
    { name: "Title", selector: (row) => row.title, sortable: true },
    { name: "Category", selector: (row) => row.category, sortable: true },
    { name: "Publisher", selector: (row) => row.publisher, sortable: true },
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

  if (error) {
    return <PageErrorAlert message={error.message} />
  }

  return (
    <>
      <CustomSnackBar {...snackBar} onClose={closeSnackBar} />
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'end' }}>
        <Button color="secondary" variant="contained" onClick={onNewBook}>
          <Add /> Add New Book
        </Button>
      </Box>

      <DataTable
        title="Books"
        progressPending={loading}
        defaultSortFieldId={1}
        columns={cols}
        onRowClicked={editBook}
        data={data.books.map((row) => {
          return {
            id: row.id,
            cover: <Box>
              {(saving && selectedBookID === row.id) ?
                <Avatar variant="rounded" src={bookCover} sx={{ bgcolor: "#555555e2" }}>
                  <CircularProgress variant="indeterminate" color="secondary" size="1rem" />
                </Avatar> :
                <Avatar src={row.cover} alt={row.title} variant="rounded" ><Assignment /></Avatar>
              }
            </Box>,
            isbn: row.isbn,
            title: row.title,
            category: row.category.name,
            publisher: row.publisher.name,
            created: moment(row.createdAt).format("DD-MM-yyyy h:mm:ss a"),
            action: <DropdownMenu options={dropMenuOptions} row={row} />
          };
        })}
      />
    </>
  );
}
