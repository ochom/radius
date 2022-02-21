import { gql, useMutation, useQuery } from '@apollo/client';
import { Add, Assignment, Delete, Edit } from '@mui/icons-material';
import { Avatar, Box, Button } from '@mui/material';
import moment from 'moment';
import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { AlertFailed, AlertSuccess, AlertWarning, ConfirmAlert } from '../customs/alerts';
import { PageErrorAlert } from '../customs/empty-page';
import { DropdownMenu } from '../customs/menus';
import { CustomLoader } from '../customs/monitors';
import { DataTable } from '../customs/table';

const initialFormData = {
  isbn: "",
  title: "",
  author: "",
  edition: "",
  publisherID: "",
  categoryID: "",
  metaData: ""
}

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

const DELETE_MUTATION = gql`
  mutation deleteBook($id: ID!){
    deleteBook(id: $id)
  }
`

export default function Books() {

  const history = useHistory()

  const { loading, error, data, refetch } = useQuery(GET_ALL_QUERY, {
    fetchPolicy: 'network-only',
    nextFetchPolicy: 'network-only'
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


  let dropMenuOptions = [{ "title": "Edit", action: editBook, icon: <Edit fontSize="small" /> }, { "title": "Delete", action: deleteBook, icon: <Delete fontSize="small" color="red" /> }]

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
            cover: <Avatar src={row.cover} alt={row.title} variant="rounded" ><Assignment /></Avatar>,
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
