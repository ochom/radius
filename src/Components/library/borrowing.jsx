import { gql, useQuery } from '@apollo/client';
import { Apartment, Approval, Assignment, Delete, Edit, Numbers, PeopleAlt, Person } from '@mui/icons-material';
import { Alert, Avatar, Button, Card, Container, Divider, List, ListItem, ListItemAvatar, ListItemText, Stack, Tab, Tabs, TextField, Typography } from '@mui/material';
import { Box } from '@mui/system';
import moment from 'moment';
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
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

const QUERY = gql`
query{
  students: getStudents{
    id
    fullName
    admissionNumber
    createdAt
  }

  teachers: getStudents{
    id
    fullName
    admissionNumber
    createdAt
  }
}
`

export default function Borrowing() {
  const history = useHistory()

  const [modal, setModal] = useState(false);

  const [searching, setSearching] = useState(false)
  const [searched, setSearched] = useState(false)

  const [tabIndex, setTabIndex] = useState(0)

  const [lender, setLender] = useState("")

  const { loading, error, data, refetch } = useQuery(QUERY)

  const [student, setStudent] = useState(null)
  const [teacher, setTeacher] = useState(null)

  const [formData, setFormData] = useState(initialFormData)

  const toggleModal = () => setModal(!modal)


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
              refetch()
            } else {
              AlertFailed({ text: res.message });
            }
          })
      } else if (res.isDismissed) {
        AlertWarning({ title: "Cancelled", text: "Request cancelled, book not deleted" })
      }
    });
  };

  const selectTab = (event, newValue) => {
    setTabIndex(newValue);
  };

  const issueBook = () => {
    setLender("")
    setStudent(null)
    setTeacher(null)
    setSearched(false)
    toggleModal()
  }


  const searchLenderAgain = () => {
    setLender("")
    setStudent(null)
    setTeacher(null)
    setSearched(false)
  }

  const searchLender = (e) => {
    e.preventDefault();
    if (tabIndex === 0) {
      searchBorrowerStudent()
    } else {
      searchBorrowerTeacher()
    }
  }


  const searchBorrowerStudent = () => {
    setSearching(true)
    let query = {
      query: `query ($data: String!){
        student: getStudentByAdmissionNumber(admissionNumber: $data){
          id
          fullName
          admissionNumber
          passport
          classroom{
            level
            stream
          }
        }
      }`,
      variables: {
        data: lender
      }
    }
    new Service().getData(query).then((res) => {
      if (res?.student) {
        setStudent(res.student)
      }
    }).finally(() => {
      setSearching(false)
      setSearched(true)
    })
  }


  const searchBorrowerTeacher = () => {
    setSearching(true)
    let query = {
      query: `query ($data: String!){
        teacher: getTeacherByIDNumber(idNumber: $data){
          id
          fullName
          serialNumber
          idNumber
          passport
        }
      }`,
      variables: {
        data: lender
      }
    }
    new Service().getData(query).then((res) => {
      if (res?.teacher) {
        setTeacher(res.teacher)
      }
    }).finally(() => {
      setSearching(false)
      setSearched(true)
    })
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

  const openLendingProfile = () => {
    if (student) {
      history.push(`/library/issue/students/${student.id}`)
    } else if (teacher) {
      history.push(`/library/issue/teachers/${teacher.id}`)

    }
  }

  if (loading) {
    return (
      <Container>
        <Card>
          <CustomLoader />
        </Card>
      </Container>
    )
  }

  if (error) {
    return (
      <Container>
        <Card>
          <Alert severity='error'>Oops! {error.message} </Alert>
        </Card>
      </Container>
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
                data={data.students.map((row) => {
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
                data={data.teachers.map((row) => {
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
          (!searching && !searched) ?
            <>
              <ModalHeader toggle={toggleModal}>
                {tabIndex === 0 ? "Find Student" : "Find Staff"}
              </ModalHeader>
              <ModalBody>
                <form onSubmit={searchLender} method="post">
                  <Box sx={{ my: 2, px: 3 }}>
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
                  </Box>
                  <Stack sx={{ mt: 3, mb: 2, px: 3 }} direction="row" justifyContent="space-between">
                    <Button color="secondary" variant="contained" type="submit">Continue</Button>
                    <Button color="secondary" variant="outlined" type='button' onClick={toggleModal}>Cancel</Button>
                  </Stack>
                </form>
              </ModalBody>
            </> :
            (searched && (student || teacher)) ?
              <ModalBody>
                <Box sx={{ my: 2, px: 3 }}>
                  {student &&
                    <Stack>
                      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                        <Avatar src={student.passport} alt={student.fullName}
                          sx={{ height: '7rem', width: '7rem' }}>
                          <Person sx={{ width: '60%', height: '60%' }} />
                        </Avatar>
                      </Box>
                      <Typography variant='h5' align='center' sx={{ mt: 2 }}>{student.fullName}</Typography>
                      <List sx={{ width: "100%" }}>
                        <ListItem>
                          <ListItemAvatar>
                            <Numbers />
                          </ListItemAvatar>
                          <ListItemText primary={student.admissionNumber} secondary="Admission Number"></ListItemText>
                        </ListItem>
                        <Divider />
                        <ListItem>
                          <ListItemAvatar>
                            <Apartment />
                          </ListItemAvatar>
                          <ListItemText primary={`${student.classroom.level}, ${student.classroom.stream}`} secondary="Classroom"></ListItemText>
                        </ListItem>
                        <Divider />
                      </List>
                    </Stack>
                  }

                  {teacher &&
                    <Stack>
                      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                        <Avatar src={teacher.passport} alt={teacher.fullName}
                          sx={{ height: '7rem', width: '7rem' }}>
                          <Person sx={{ width: '60%', height: '60%' }} />
                        </Avatar>
                      </Box>
                      <Typography variant='h5' align='center' sx={{ mt: 2 }}>{teacher.fullName}</Typography>
                      <List sx={{ width: "100%" }}>
                        <ListItem>
                          <ListItemAvatar>
                            <Approval />
                          </ListItemAvatar>
                          <ListItemText primary={teacher.serialNumber} secondary="Staff Number"></ListItemText>
                        </ListItem>
                        <Divider />
                        <ListItem>
                          <ListItemAvatar>
                            <Numbers />
                          </ListItemAvatar>
                          <ListItemText primary={teacher.idNumber} secondary="ID Number"></ListItemText>
                        </ListItem>
                        <Divider />
                      </List>
                    </Stack>
                  }
                </Box>
                <Stack sx={{ mt: 3, mb: 2, px: 3 }} direction="row" justifyContent="space-between">
                  <Button color="secondary" variant="contained" onClick={openLendingProfile}>Continue</Button>
                  <Button color="secondary" variant="outlined" onClick={toggleModal}>Cancel</Button>
                </Stack>
              </ModalBody>
              :
              <ModalBody>
                <Stack sx={{ py: 3, px: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                    <Alert severity='warning'>{tabIndex === 0 ? "Student" : "Teacher"} not found</Alert>
                  </Box>
                  <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
                    <Button color='secondary' variant='outlined' onClick={searchLenderAgain}>Search Again</Button>
                  </Box>
                </Stack>
              </ModalBody>
        }
      </Modal>
    </>
  );
}
