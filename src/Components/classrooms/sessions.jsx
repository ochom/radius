import { gql, useLazyQuery, useMutation, useQuery } from "@apollo/client";
import { Add, Delete, Edit, Save } from "@mui/icons-material";
import { LoadingButton, LocalizationProvider, MobileDatePicker } from "@mui/lab";
import DateAdapter from '@mui/lab/AdapterMoment';
import { Box, Button, FormControl, InputLabel, MenuItem, Select, Stack, TextField } from "@mui/material";
import moment from "moment";
import { useState } from "react";
import { Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import {
  AlertFailed,
  AlertSuccess,
  AlertWarning,
  ConfirmAlert
} from "../customs/alerts";
import { PageErrorAlert } from "../customs/empty-page";
import { DropdownMenu } from "../customs/menus";
import { CustomLoader } from "../customs/monitors";
import { DataTable } from "../customs/table";


const FETCH_ALL_QUERY = gql`
  query{
    sessions:getSessions{
      id
      academicYear
      curriculum
      system
      name
      startDate
      endDate
    }
  }
`

const FETCH_ONE_QUERY = gql`
  query ($id: ID!){
    session: getSession(id: $id){
      id
      academicYear
      curriculum
      system
      name
      startDate
      endDate
    }
  }
`

const CREATE_MUTATION = gql`
  mutation ($data: NewSession!){
    createSession(input: $data)
  }
`

const UPDATE_MUTATION = gql`
  mutation ($id: ID!, $data: NewSession!){
    updateSession(id: $id, input: $data)
  }
`

const DELETE_MUTATION = gql`
  mutation ($id: ID!){
    deleteSession(id: $id)
  }
`

const initialFormData = {
  curriculum: "",
  academicYear: 202,
  system: "",
  name: "",
  startDate: new Date(),
  endDate: new Date(),
}



export default function Sessions() {
  const [modal, setModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [selectedSession, setSelectedSession] = useState(null);
  const [formData, setFormData] = useState(initialFormData)


  const { data, loading, error, refetch } = useQuery(FETCH_ALL_QUERY)

  const [fetchOne, { loading: loadingSelected, error: selectedError }] = useLazyQuery(FETCH_ONE_QUERY, {
    onCompleted: (res) => {
      if (res.session) {
        let session = res.session
        setSelectedSession(session)
        setFormData({
          curriculum: session.curriculum,
          academicYear: session.academicYear,
          system: session.system,
          name: session.name,
          startDate: session.startDate,
          endDate: session.endDate,
        })
      }
    }
  })

  const [addNew, { loading: creating, reset: resetCreating }] = useMutation(CREATE_MUTATION, {
    onCompleted: () => {
      AlertSuccess({ text: `Session saved successfully` });
      toggleModal();
      refetch()
      resetCreating()
    },
    onError: (err) => {
      AlertFailed({ text: err.message });
      resetCreating()
    }
  })

  const [updateData, { loading: updating, reset: resetUpdate }] = useMutation(UPDATE_MUTATION, {
    onCompleted: () => {
      AlertSuccess({ text: `Session updated successfully` });
      toggleModal();
      refetch()
      resetUpdate()
    },
    onError: (err) => {
      AlertFailed({ text: err.message });
      resetUpdate()
    }
  })

  const [deleteData] = useMutation(DELETE_MUTATION, {
    onCompleted: () => {
      AlertSuccess({ text: `Session deleted successfully` });
      refetch()
    },
    onError: (err) => {
      AlertFailed({ text: err.message });
    }
  })

  const toggleModal = () => setModal(!modal)

  const onNewSession = () => {
    setSelectedSession(null);
    setFormData(initialFormData)
    toggleModal();
  };

  const submitForm = (e) => {
    e.preventDefault();
    if (selectedSession) {
      updateData({
        variables: {
          id: selectedSession.id,
          data: formData
        }
      })
    } else {
      addNew({
        variables: {
          data: formData
        }
      })
    }
  };

  const editSession = ({ id }) => {
    fetchOne({
      variables: {
        id: id
      }
    })
    toggleModal();
  };


  const deleteSession = ({ id }) => {
    ConfirmAlert({ title: "Delete session!" }).then((res) => {
      if (res.isConfirmed) {
        deleteData({
          variables: {
            id: id
          }
        })
      } else if (res.isDismissed) {
        AlertWarning({ title: "Cancelled", text: "Request cancelled, session not deleted" })
      }
    });
  };



  let dropMenuOptions = [{ "title": "Edit", action: editSession, icon: <Edit fontSize="small" /> }, { "title": "Delete", action: deleteSession, icon: <Delete fontSize="small" color="red" /> }]

  const cols = [
    { name: "Academic Year", selector: (row) => row.academicYear, sortable: true },
    { name: "Curriculum", selector: (row) => row.curriculum, sortable: true, },
    { name: "Name", selector: (row) => row.name, sortable: true },
    { name: "Start Date", selector: (row) => row.startDate, sortable: true },
    { name: "End Date", selector: (row) => row.endDate, sortable: true },
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
        <Button color="secondary" variant="contained" className="no-transform" onClick={onNewSession}>
          <Add /> Add New Session
        </Button>
      </Box>

      <DataTable
        columns={cols}
        onRowClicked={editSession}
        data={
          data.sessions.map((session) => {
            return {
              id: session.id,
              academicYear: session.academicYear,
              curriculum: session.curriculum,
              name: session.name,
              startDate: moment(session.startDate).format('Do MMMM, YYYY'),
              endDate: moment(session.endDate).format('Do MMMM, YYYY'),
              action: <DropdownMenu options={dropMenuOptions} row={session} />
            };
          })} />

      <Modal isOpen={modal}>
        {loadingSelected ?
          <ModalBody>
            <CustomLoader />
          </ModalBody>
          :
          <form onSubmit={submitForm} method="post">
            <ModalHeader toggle={toggleModal}>
              {selectedSession ? "Edit session details" : "Create a new session"}
            </ModalHeader>
            <ModalBody>
              <Box className="row px-3">
                <Box className="mt-4">
                  <TextField
                    type="number"
                    label="Academic Year"
                    color="secondary"
                    fullWidth
                    value={formData.academicYear}
                    onChange={(e) => setFormData({ ...formData, academicYear: +e.target.value })}
                  />
                </Box>
                <Box className="mt-3">
                  <FormControl fullWidth>
                    <InputLabel id="curriculum-label">Curriculum</InputLabel>
                    <Select
                      labelId="curriculum-label"
                      id="curriculum"
                      label="Curriculum"
                      color="secondary"
                      required
                      fullWidth
                      value={formData.curriculum}
                      onChange={e => setFormData({ ...formData, curriculum: e.target.value })}
                    >
                      <MenuItem value="8-4-4">8-4-4</MenuItem>
                      <MenuItem value="2-6-6-3">2-6-6-3</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
                <Box className="mt-4">
                  <FormControl fullWidth>
                    <InputLabel id="system-label">System</InputLabel>
                    <Select
                      labelId="system-label"
                      id="system"
                      label="System"
                      color="secondary"
                      required
                      fullWidth
                      value={formData.system}
                      onChange={e => setFormData({ ...formData, system: e.target.value })}
                    >
                      {["Term", "Semester"].map(l => <MenuItem key={l} value={l}>{l}</MenuItem>)}
                    </Select>
                  </FormControl>
                </Box>
                <Box className="mt-4">
                  <FormControl fullWidth>
                    <InputLabel id="session-label">Session Name</InputLabel>
                    <Select
                      labelId="session-label"
                      id="session"
                      label="Session Name"
                      color="secondary"
                      required
                      fullWidth
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                    >
                      {(formData.system.length > 0 ? [1, 2, 3] : []).map(l => <MenuItem key={l} value={formData.system + " " + l}>{formData.system + " " + l}</MenuItem>)}
                    </Select>
                  </FormControl>
                </Box>
                <Box className="mt-4">
                  <LocalizationProvider dateAdapter={DateAdapter}>
                    <MobileDatePicker
                      label="Start Date"
                      inputFormat="DD/MM/yyyy"
                      value={formData.startDate}
                      onChange={val => setFormData({ ...formData, startDate: val })}
                      renderInput={(params) => <TextField fullWidth {...params} />}
                    />
                  </LocalizationProvider>
                </Box>
                <Box className="mt-4">
                  <LocalizationProvider dateAdapter={DateAdapter}>
                    <MobileDatePicker
                      label="End Date"
                      inputFormat="DD/MM/yyyy"
                      value={formData.endDate}
                      onChange={val => setFormData({ ...formData, endDate: val })}
                      renderInput={(params) => <TextField fullWidth {...params} />}
                    />
                  </LocalizationProvider>
                </Box>
              </Box>
            </ModalBody>
            <ModalFooter>
              <Stack direction='row' spacing={3} justifyContent='left'>
                <LoadingButton
                  type='submit'
                  variant='contained'
                  color='secondary'
                  size='large'
                  loading={creating || updating}
                  loadingPosition="start"
                  startIcon={<Save />}>Save</LoadingButton>
                <Button onClick={toggleModal} variant='outlined' color='secondary'>Cancel</Button>
              </Stack>
            </ModalFooter>
          </form>
        }
      </Modal>
    </>
  );
};
