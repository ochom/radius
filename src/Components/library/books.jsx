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

  const [searching, setSearching] = useState(false)
  const [searched, setSearched] = useState(false)
  const [selectedBookID, setSelectedBookID] = useState(null);

  const [saving, setSaving] = useState(false);
  const [totalRows, setTotalRows] = useState(0);


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
    setFormData(initialFormData)
    setSelectedBookID(null);
    setSearched(false)
    toggleModal();
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
    setSearching(true)
    let query = {
      query: `query ($id: ID!){
        book: getBook(id: $id){
          id
          title
          barcode
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
          ...formData,
          barcode: data.barcode,
          title: data.title,
        })
      }
    }).finally(() => {
      setSearching(false)
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


  const searchBook = (e) => {
    e.preventDefault()
    setSearching(true)
    let query = {
      query: `query ($data: String!){
        book: getBookByBarcode(barcode: $data){
          id
          title
        }
      }`,
      variables: {
        data: formData.barcode
      }
    }
    new Service().getData(query).then((res) => {
      if (res?.book) {
        setFormData({
          ...formData,
          title: res.book.title
        })
      }
      setSearching(false)
      setSearched(true)
    });
  }

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
        {(searching) &&
          <ModalBody>
            <CustomLoader />
          </ModalBody>
        }


        {/* New book ID modal */}
        {(!searching && !searched && !selectedBookID) &&
          <>
            <ModalHeader toggle={toggleModal}><i className="fa fa-plus-circle"></i> Add book</ModalHeader>
            <ModalBody>
              <form onSubmit={searchBook} method="post">
                <div>
                  <div className="mt-3">
                    <TextField
                      value={formData.barcode}
                      label="Barcode"
                      required
                      color="secondary"
                      fullWidth
                      onChange={(e) => setFormData({ ...formData, barcode: e.target.value })}
                    />
                  </div>
                  <div className="my-5">
                    <Button color="secondary" variant="contained" type="submit">Continue</Button>
                  </div>
                </div>
              </form>
            </ModalBody>
          </>
        }


        {/* New book details modal */}
        {(searched || (searched && selectedBookID)) &&
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
                    label="Barcode"
                    color="secondary"
                    required
                    aria-readonly
                    fullWidth
                    defaultValue={formData.barcode}
                  />
                </div>
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
                <div className="mt-3">
                  <TextField
                    label="Book category"
                    color="secondary"
                    required
                    fullWidth
                    value={formData.categoryID}
                    onChange={(e) => setFormData({ ...formData, categoryID: e.target.value })}
                  />
                </div>
                <div className="mt-3">
                  <TextField
                    label="Edition"
                    color="secondary"
                    fullWidth
                    value={formData.edition}
                    onChange={(e) => setFormData({ ...formData, edition: e.target.value })}
                  />
                </div>
                <div className="mt-3">
                  <TextField
                    label="Author"
                    color="secondary"
                    fullWidth
                    value={formData.author}
                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                  />
                </div>
                <div className="mt-3">
                  <TextField
                    label="Publisher"
                    color="secondary"
                    required
                    fullWidth
                    value={formData.publisher}
                    onChange={(e) => setFormData({ ...formData, publisher: e.target.value })}
                  />
                </div>
                <div className="mt-3">
                  <TextField
                    label="Other"
                    color="secondary"
                    multiline
                    rows={4}
                    fullWidth
                    value={formData.metaData}
                    onChange={(e) => setFormData({ ...formData, metaData: e.target.value })}
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
