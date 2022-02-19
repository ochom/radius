import { gql, useQuery } from '@apollo/client';
import { Apartment, Approval, Numbers, PeopleAlt, Person } from '@mui/icons-material';
import { Alert, Avatar, Button, Card, Divider, List, ListItem, ListItemAvatar, ListItemText, Rating, Stack, Tab, Tabs, TextField, Typography } from '@mui/material';
import { Box } from '@mui/system';
import moment from 'moment';
import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Modal, ModalBody, ModalHeader } from 'reactstrap';
import { Service } from '../../API/service';
import { PageErrorAlert } from '../customs/errors';
import { CustomLoader } from '../customs/monitors';
import { DataTable } from '../customs/table';
import { panelProps, TabPanel } from '../customs/tabs';

const QUERY = gql`
query lenders {
  lenders: getLenders {
    students {
      id
      name
      number
      meta
      total
      returned
      borrowed
    }
    teachers {
      id
      name
      number
      meta
      total
      returned
      borrowed
    }
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

  const { loading, error, data } = useQuery(QUERY, {
    nextFetchPolicy: 'network-only',
    fetchPolicy: 'network-only'
  })

  const [student, setStudent] = useState(null)
  const [teacher, setTeacher] = useState(null)

  const toggleModal = () => setModal(!modal)


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

  const studentsCol = [
    { name: "Reg.", selector: (row) => row.number, width: '80px' },
    { name: "Name", selector: (row) => row.name, },
    { name: "Classroom", selector: (row) => row.meta },
    { name: "Rating", selector: (row) => row.total },
    { name: "Issued", selector: (row) => row.borrowed, },
  ]



  const teachersCol = [
    { name: "#", selector: (row) => row.number, width: '80px' },
    { name: "Name", selector: (row) => row.name, },
    { name: "Email", selector: (row) => row.meta },
    { name: "Rating", selector: (row) => row.total },
    { name: "Issued", selector: (row) => row.borrowed, },
  ]

  const IssueButton = ({ person, sx }) => {
    return (
      <Button variant='contained' color='secondary' className='no-transform'
        sx={{ ...sx, my: 2 }} onClick={() => {
          setTabIndex(person === "Student" ? 0 : 1)
          issueBook()
        }}>
        Issue Book to  {person}
      </Button>
    )
  }

  const openLendingProfile = () => {
    if (student) {
      openStudentLender({ id: student.id })
    } else if (teacher) {
      openStaffLender({ id: teacher.id })
    }
  }

  const openStudentLender = ({ id }) => {
    history.push(`/library/issue/students/${id}`)
  }

  const openStaffLender = ({ id }) => {
    history.push(`/library/issue/teachers/${id}`)
  }

  if (loading) {
    return <CustomLoader />
  }

  if (error) {
    return <PageErrorAlert message={error.message} />
  }

  return (
    <>
      <Stack direction='row' sx={{ display: 'flex', justifyContent: 'end' }}>
        <IssueButton person="Student" />
        <IssueButton person="Teacher" sx={{ ml: 3 }} />
      </Stack>

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
            <Tab icon={<PeopleAlt sx={{ fontSize: 20 }} />} iconPosition="start" label={`Students (${data.lenders.students.length})`}  {...panelProps(0)} />
            <Tab icon={<Person sx={{ fontSize: 20 }} />} iconPosition="start" label={`Teachers (${data.lenders.teachers.length})`}  {...panelProps(1)} />
          </Tabs>
          <TabPanel value={tabIndex} index={0}>
            <DataTable
              onRowClicked={openStudentLender}
              columns={studentsCol}
              data={data.lenders.students.map((row) => {
                let rating = parseFloat((row.returned * 5.0 / row.total).toFixed(1))
                return {
                  id: row.id,
                  number: row.number,
                  name: row.name,
                  meta: row.meta,
                  total: <Rating precision={0.5} value={rating} readOnly />,
                  borrowed: moment(row.borrowed).format("DD-MM-yyyy"),
                };
              })}
            />
          </TabPanel>
          <TabPanel value={tabIndex} index={1}>
            <DataTable
              onRowClicked={openStaffLender}
              columns={teachersCol}
              data={data.lenders.teachers.map((row) => {
                let rating = parseFloat((row.returned * 5.0 / row.total).toFixed(1))
                return {
                  id: row.id,
                  number: row.number,
                  name: row.name,
                  meta: row.meta,
                  total: <Rating precision={0.5} value={rating} readOnly />,
                  borrowed: moment(row.borrowed).format("DD-MM-yyyy"),
                };
              })}
            />
          </TabPanel>
        </Box>
      </Card>

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
                  <Stack sx={{ mt: 3, mb: 2, px: 3 }} spacing={3} direction="row-reverse" justifyContent="end">
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
                <Stack sx={{ mt: 3, mb: 2, px: 3 }} spacing={3} direction="row-reverse" justifyContent="end">
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
