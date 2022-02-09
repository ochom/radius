import { Add, Assignment, Delete, Edit, PeopleAlt, Person } from '@mui/icons-material';
import { Button, Card, Container, Tab, Tabs, TextField } from '@mui/material';
import { Box } from '@mui/system';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { Modal, ModalBody, ModalHeader } from 'reactstrap';
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

  const [saving, setSaving] = useState(false);
  const [totalRows, setTotalRows] = useState(0);
  const [tabIndex, setTabIndex] = useState(0)

  const [lender, setLender] = useState("")

  const [students, setStudents] = useState([]);
  const [teachers, setTeachers] = useState([]);
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


  const returnBook = row => {
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


  const searchLender = (e) => {
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

  const issueBook = () => {
    setLender("")
    toggleModal()
  }

  let dropMenuOptions = [{ "title": "Edit", action: returnBook, icon: <Edit fontSize="small" /> }, { "title": "Delete", action: deleteBook, icon: <Delete fontSize="small" color="red" /> }]

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

  const IssueButton = ({ person }) => {
    return (
      <Button variant='contained' color='secondary' className='no-transform'
        sx={{ my: 2 }} onClick={issueBook}>
        Issue Book to  {person}
      </Button>
    )
  }

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
                title={<IssueButton person="Student" />}
                progressPending={loading}
                columns={cols}
                data={students.map((row) => {
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
                title={<IssueButton person="Teacher" />}
                progressPending={loading}
                defaultSortFieldId={1}
                columns={cols}
                data={teachers.map((row) => {
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
        {searching ?
          <ModalBody>
            <CustomLoader />
          </ModalBody> :
          <>
            <ModalHeader toggle={toggleModal}>
              {tabIndex === 0 ? "Find Student" : "Find Staff"}
            </ModalHeader>
            <ModalBody>
              <form onSubmit={searchLender} method="post">
                <div>
                  <div className="mt-3">
                    <TextField
                      value={lender}
                      label={tabIndex === 0 ? "Enter Admission Number" : "Enter ID Number"}
                      required
                      autoFocus={true}
                      color="secondary"
                      placeholder={tabIndex === 0 ? "Admission Number" : "ID Number"}
                      fullWidth
                      onChange={(e) => setLender(e.target.value)}
                    />
                  </div>
                  <div className="mt-4 mb-3">
                    <Button color="secondary" variant="contained" type="submit" sx={{ mr: 3 }}>Continue</Button>
                    <Button color="secondary" variant="outlined" type='button' onClick={toggleModal}>Cancel</Button>
                  </div>
                </div>
              </form>
            </ModalBody>
          </>
        }
      </Modal>
    </>
  );
}
