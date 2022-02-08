import { Add, Assignment, Delete, Edit, PeopleAlt, Person, Save } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import { Button, Card, Container, FormControl, InputLabel, MenuItem, Select, Tab, Tabs, TextField } from '@mui/material';
import { Box } from '@mui/system';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import { Service } from '../../API/service';
import { AlertFailed, AlertSuccess, AlertWarning, ConfirmAlert } from '../customs/alerts';
import { UserAvatar } from '../customs/avatars';
import { DropdownMenu } from '../customs/menus';
import { CustomLoader } from '../customs/monitors';
import { DataTable } from '../customs/table';
import { panelProps, TabPanel } from '../customs/tabs';

const initialFormData = {
  barcode: "",
  title: "",
  author: "",
  edition: "",
  publisherID: "",
  categoryID: "",
  metaData: ""
}

export default function Borrowing() {

  const [modal, setModal] = useState(false);
  const [loading, setLoading] = useState(true)

  const [searching, setSearching] = useState(false)
  const [searched, setSearched] = useState(false)
  const [selectedBookID, setSelectedBookID] = useState(null);

  const [saving, setSaving] = useState(false);
  const [totalRows, setTotalRows] = useState(0);
  const [tabIndex, setTabIndex] = useState(0)

  const [books, setStudents] = useState([]);
  const [publishers, setTeachers] = useState([]);
  const [formData, setFormData] = useState(initialFormData)

  const toggleModal = () => setModal(!modal)

  useEffect(() => {
    setLoading(true)
    let query = {
      query: `query{
        students: getStudents{
          id
          fullName
          admissionNumber
          createdAt
        }
      }`,
      variables: {}
    }
    new Service().getData(query).then((res) => {
      setStudents(res?.students || [])
      setTeachers(res?.students || [])
      setLoading(false)
    });
  }, [totalRows]);


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
          barcode
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
          author: data.author,
          edition: data.edition,
          categoryID: data.category.id,
          publisherID: data.publisher.id,
          metaData: data.metaData
        })
      }
    }).finally(() => {
      setSearching(false)
      setSearched(true)
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
          barcode
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
      }`,
      variables: {
        data: formData.barcode
      }
    }
    new Service().getData(query).then((res) => {
      if (res?.book) {
        AlertSuccess({ text: `Book already registered` });
        toggleModal();
      }
    }).finally(() => {
      setSearching(false)
      setSearched(true)
    });
  }

  const selectTab = (event, newValue) => {
    setTabIndex(newValue);
  };

  let dropMenuOptions = [{ "title": "Edit", action: editBook, icon: <Edit fontSize="small" /> }, { "title": "Delete", action: deleteBook, icon: <Delete fontSize="small" color="red" /> }]

  const cols = [
    { name: "Reg.", selector: (row) => row.barcode, width: '80px' },
    { name: "Name", selector: (row) => row.title, },
    { name: "Book", selector: (row) => row.category, },
    { name: "Status", selector: (row) => row.created, },
    { name: "Issued", selector: (row) => row.created, },
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
        <Card>
          <Box sx={{ width: '100%', position: 'relative' }}>
            <Box
              style={{ position: 'absolute', width: 'auto', marginLeft: 'calc(100% - 400px)', justifyContent: 'end', zIndex: 100 }}
              sx={{ display: { md: 'none', lg: 'flex' } }}>
              <TextField size='small'
                label='Search'
                placeholder='Search ...'
                color='secondary'
                sx={{ mt: 2, mr: 3, width: { sm: '150px', lg: '250px' } }} />
              <Button variant='contained' color='secondary' className='no-transform'
                sx={{ mt: 2, mr: 5 }}>
                <Add /> Issue
              </Button>
            </Box>
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
              <DataTable
                progressPending={loading}
                columns={cols}
                data={books.map((row) => {
                  return {
                    id: row.id,
                    cover: <UserAvatar src={row.cover} alt={row.title} variant="rounded" ><Assignment /></UserAvatar>,
                    barcode: row.admissionNumber,
                    title: row.fullName,
                    category: row.category,
                    created: moment(row.createdAt).format("DD-MM-yyyy"),
                    action: <DropdownMenu options={dropMenuOptions} row={row} />
                  };
                })}
              />
            </TabPanel>
            <TabPanel value={tabIndex} index={1}>
              <DataTable
                progressPending={loading}
                defaultSortFieldId={1}
                columns={cols}
                data={books.map((row) => {
                  return {
                    id: row.id,
                    cover: <UserAvatar src={row.cover} alt={row.title} variant="rounded" ><Assignment /></UserAvatar>,
                    barcode: row.admissionNumber,
                    title: row.fullName,
                    category: row.category,
                    created: moment(row.createdAt).format("DD-MM-yyyy"),
                    action: <DropdownMenu options={dropMenuOptions} row={row} />
                  };
                })}
              />
            </TabPanel>
          </Box>
        </Card>
      </Container>

      <Modal isOpen={modal}>
        {searching &&
          <ModalBody>
            <CustomLoader />
          </ModalBody>
        }


        {/* New book ID modal */}
        {(!searching && !searched && !selectedBookID) &&
          <>
            <ModalHeader toggle={toggleModal}>Issue Book</ModalHeader>
            <ModalBody>
              <form onSubmit={searchBook} method="post">
                <div>
                  <div className="mt-3">
                    <TextField
                      value={formData.barcode}
                      label="Barcode"
                      required
                      autoFocus={true}
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
        {(!searching && (searched || (searched && selectedBookID))) &&
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
                    value={formData.barcode}
                    onChange={(e) => setFormData({ ...formData, barcode: e.target.value })}
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
                      {publishers.map(k => <MenuItem value={k.id} key={k.id}>{k.name}</MenuItem>)}
                    </Select>
                  </FormControl>
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
