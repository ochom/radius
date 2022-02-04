import { Add, Delete, Edit, LibraryBooksOutlined, Save } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import { Button, Container, TextField, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import { Service } from '../../API/service';
import { AlertFailed, AlertSuccess, AlertWarning, ConfirmAlert } from '../customs/alerts';
import { DropdownMenu } from '../customs/menus';
import { CustomLoader } from '../customs/monitors';
import { DataTable } from '../customs/table';

const initialFormData = {
  barcode: "",
  title: "",
  author: "",
  publisher: "",
  edition: "",
  published: "",
  categoryID: "",
  metaData: ""
}

export default function Books() {
  const [modal, setModal] = useState(false);
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false);
  const [totalRows, setTotalRows] = useState(0);
  const [loadingSelected, setLoadingSelected] = useState(false)
  const [selectedBookID, setSelectedBookID] = useState(null);


  const [books, setBooks] = useState([]);
  const [formData, setFormData] = useState(initialFormData)

  const toggleModal = () => setModal(!modal)

  useEffect(() => {
    setLoading(true)
    let query = {
      query: `query{
        books: getBooks{
          id
          title
        }
      }`,
      variables: {}
    }
    new Service().getData(query).then((res) => {
      setBooks(res?.books || [])
      setLoading(false)
    });
  }, [totalRows]);


  const onNewBook = () => {
    toggleModal();
    setSelectedBookID(null);
    setFormData(initialFormData)
  };

  const submitForm = (e) => {
    e.preventDefault();
    setSaving(true)
    let query = selectedBookID
      ? {
        query: `mutation ($id: ID!, $data: NewBook!){
        updateBook(id: $id, input: $data)
     }`,
        variables: {
          id: selectedBookID,
          data: formData
        }
      } :
      {
        query: `mutation ($data: NewBook!){
        createBook(input: $data)
      }`,
        variables: {
          data: formData
        }
      }

    new Service().createOrUpdate(query).then((res) => {
      if (res.status === 200) {
        AlertSuccess({ text: `Book saved successfully` });
        toggleModal();
        setTotalRows(totalRows + 1)
      } else {
        AlertFailed({ text: res.message });
      }
    }).finally(() => {
      setSaving(false)
    });
  };

  const editBook = row => {
    setSelectedBookID(row.id);
    setLoadingSelected(true)
    let query = {
      query: `query ($id: ID!){
        book: getBook(id: $id){
          id
          title
        }
      }`,
      variables: {
        id: row.id
      }
    }

    new Service().getData(query).then(res => {
      if (res) {
        let data = res.book
        setFormData({
          title: data.title
        })
      }
    }).finally(() => {
      setLoadingSelected(false)
    });
    toggleModal();
  };

  const deleteBook = row => {
    ConfirmAlert({ title: "Delete book!" }).then((res) => {
      if (res.isConfirmed) {
        let query = {
          query: `mutation ($id: ID!){
            deleteBook(id: $id)
          }`,
          variables: {
            id: row.id
          }
        }
        new Service().delete(query)
          .then((res) => {
            if (res.status === 200) {
              AlertSuccess({ text: `Book deleted successfully` });
              setTotalRows(totalRows - 1)
            } else {
              AlertFailed({ text: res.message });
            }
          })
      } else if (res.isDismissed) {
        AlertWarning({ title: "Cancelled", text: "Request cancelled, book not deleted" })
      }
    });
  };

  let dropMenuOptions = [{ "title": "Edit", action: editBook, icon: <Edit fontSize="small" /> }, { "title": "Delete", action: deleteBook, icon: <Delete fontSize="small" color="red" /> }]

  const cols = [
    { name: "Name", selector: (row) => row.title, sortable: true },
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

  return (
    <>
      <Container>
        <div className="mb-3 justify-content-end d-flex">
          <Button color="secondary" variant="contained" onClick={onNewBook}>
            <Add /> Add New Book
          </Button>
        </div>

        <DataTable
          title={
            <Typography color="secondary" variant="h5">
              <LibraryBooksOutlined style={{ verticalAlign: "middle" }} /> <b>Books</b>
            </Typography>
          }
          progressPending={loading}
          defaultSortFieldId={1}
          columns={cols}
          onRowClicked={editBook}
          data={books.map((row) => {
            return {
              id: row.id,
              title: row.title,
              action: <DropdownMenu options={dropMenuOptions} row={row} />
            };
          })}
        />
      </Container>

      <Modal isOpen={modal}>
        {loadingSelected ?
          <ModalBody>
            <CustomLoader />
          </ModalBody>
          :
          <form onSubmit={submitForm} method="post">
            <ModalHeader toggle={toggleModal}>
              <span>
                {selectedBookID ? "Edit book details" : "Create a new book"}
              </span>
            </ModalHeader>
            <ModalBody>
              <div className="row px-3">
                <div className="mt-3">
                  <TextField
                    label="Book title"
                    color="secondary"
                    required
                    fullWidth
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  />
                </div>
              </div>
            </ModalBody>
            <ModalFooter>
              <div className="col-12 d-flex justify-content-start ps-4">
                <LoadingButton
                  type='submit'
                  variant='contained'
                  color='secondary'
                  size='large'
                  loading={saving}
                  loadingPosition="start"
                  startIcon={<Save />}>Save</LoadingButton>
              </div>
            </ModalFooter>
          </form>
        }

      </Modal>
    </>
  );
}
