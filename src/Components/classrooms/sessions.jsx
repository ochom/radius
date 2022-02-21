import { gql, useQuery } from "@apollo/client";
import { Add, Delete, Edit, Save } from "@mui/icons-material";
import { LoadingButton, LocalizationProvider, MobileDatePicker } from "@mui/lab";
import DateAdapter from '@mui/lab/AdapterMoment';
import { Box, Button, FormControl, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import moment from "moment";
import { useState } from "react";
import { Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import { Service } from "../../API/service";
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




const FETCH_QUERY = gql`
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

const initialFormData = {
  curriculum: "",
  academicYear: 202,
  system: "",
  name: "",
  startDate: new Date(),
  endDate: new Date(),
}



export default function Sessions() {
  const { data, loading, error, refetch } = useQuery(FETCH_QUERY)

  const [modal, setModal] = useState(false);
  const [loadingSelected, setLoadingSelected] = useState(false)

  const [saving, setSaving] = useState(false);
  const [selectedSessionID, setSelectedSessionID] = useState(null);

  const [formData, setFormData] = useState(initialFormData)

  const toggleModal = () => setModal(!modal)


  const onNewSession = () => {
    toggleModal();
    setSelectedSessionID(null);
    setFormData(initialFormData)
  };

  const submitForm = (e) => {
    e.preventDefault();
    setSaving(true)
    let query = selectedSessionID
      ? {
        query: `mutation($id: ID!, $data: NewSession!){
          updateSession(id: $id, input: $data)
        }`,
        variables: {
          id: selectedSessionID,
          data: formData
        }
      } :
      {
        query: `mutation($data: NewSession!){
          createSession(input: $data)
        }`,
        variables: {
          data: formData
        }
      }
    new Service().createOrUpdate(query).then((res) => {
      if (res.status === 200) {
        AlertSuccess({ text: `Session saved successfully` });
        refetch()
        toggleModal();
      } else {
        AlertFailed({ text: res.message });
      }
    }).finally(() => {
      setSaving(false)
    });
  };

  const editSession = (row) => {
    setSelectedSessionID(row.id);
    setLoadingSelected(true)
    let query = {
      query: `query ($id: ID!){
        session: getSession(id: $id){
          id
          academicYear
          curriculum
          system
          name
          startDate
          endDate
        }
      }`,
      variables: {
        id: row.id
      }
    }

    new Service().getData(query).then(res => {
      if (res) {
        let session = res.session
        setFormData({
          curriculum: session.curriculum,
          academicYear: session.academicYear,
          system: session.system,
          name: session.name,
          startDate: session.startDate,
          endDate: session.endDate,
        })
      }
    }).finally(() => {
      setLoadingSelected(false)
    });
    toggleModal();
  };

  const deleteSession = (row) => {
    ConfirmAlert({ title: "Delete session!" }).then((res) => {
      if (res.isConfirmed) {
        let query = {
          query: `mutation ($id: ID!){
            deleteSession(id: $id)
          }`,
          variables: {
            id: row.id
          }
        }
        new Service().delete(query)
          .then((res) => {
            if (res.status === 200) {
              AlertSuccess({ text: `Session deleted successfully` });
              refetch()
            } else {
              AlertFailed({ text: res.message });
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
              <span>
                <i className={`fa fa-${selectedSessionID ? "edit" : "plus-circle"}`}></i> {selectedSessionID ? "Edit session details" : "Create a new session"}
              </span>
            </ModalHeader>
            <ModalBody>
              <div className="row px-3">
                <div className="mt-4">
                  <TextField
                    type="number"
                    label="Academic Year"
                    color="secondary"
                    fullWidth
                    value={formData.academicYear}
                    onChange={(e) => setFormData({ ...formData, academicYear: +e.target.value })}
                  />
                </div>
                <div className="mt-3">
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
                </div>
                <div className="mt-4">
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
                </div>
                <div className="mt-4">
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
                </div>
                <div className="mt-4">
                  <LocalizationProvider dateAdapter={DateAdapter}>
                    <MobileDatePicker
                      label="Start Date"
                      inputFormat="DD/MM/yyyy"
                      value={formData.startDate}
                      onChange={val => setFormData({ ...formData, startDate: val })}
                      renderInput={(params) => <TextField fullWidth {...params} />}
                    />
                  </LocalizationProvider>
                </div>
                <div className="mt-4">
                  <LocalizationProvider dateAdapter={DateAdapter}>
                    <MobileDatePicker
                      label="End Date"
                      inputFormat="DD/MM/yyyy"
                      value={formData.endDate}
                      onChange={val => setFormData({ ...formData, endDate: val })}
                      renderInput={(params) => <TextField fullWidth {...params} />}
                    />
                  </LocalizationProvider>
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
};
