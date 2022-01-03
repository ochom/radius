
import React, { useState, useEffect } from "react";
import { Delete, Edit, Save } from "@mui/icons-material";
import { FormControl, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import { Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import { SessionService as service } from "../../API/classes";
import {
  AlertFailed,
  AlertSuccess,
  ConfirmAlert,
} from "../../components/alerts";
import { DropdownMenu } from "../../components/menus";
import { DataTable } from "../../components/table";
import { LoadingButton, LocalizationProvider, MobileDatePicker } from "@mui/lab";
import DateAdapter from '@mui/lab/AdapterMoment';
import moment from "moment";


const initialFormData = {
  curriculum: "",
  academicYear: 202,
  option: "Term",
  title: "",
  startDate: new Date(),
  endDate: new Date(),
}



export default function Sessions() {
  const [modal, setModal] = useState(false);
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false);
  const [selectedSession, setSelectedSession] = useState(null);

  const [data, setData] = useState([]);
  const [formData, setFormData] = useState(initialFormData)

  const toggleModal = () => {
    if (modal) {
      setModal(false)
    } else {
      setModal(true)
    }
  }

  const onNewSession = () => {
    toggleModal();
    setSelectedSession(null);
    setFormData(initialFormData)
  };

  const submitForm = (e) => {
    e.preventDefault();
    setSaving(true)
    let data = selectedSession
      ? { ...selectedSession, ...formData }
      : formData;

    if (selectedSession) {
      new service().updateSession(selectedSession.id, data).then((res) => {
        if (res.status === 200) {
          AlertSuccess(res.message);
          toggleModal();
          getSessions();
        } else {
          AlertFailed(res.message);
        }
      }).finally(() => {
        setSaving(false)
      });
    } else {
      new service().createSession(data).then((res) => {
        if (res.status === 200) {
          AlertSuccess(res.message);
          toggleModal();
          getSessions();
        } else {
          AlertFailed(res.message);
        }
      }).finally(() => {
        setSaving(false)
      });;
    }
  };

  const editSession = (session) => {
    setSelectedSession(session);
    setFormData({
      curriculum: session.curriculum,
      academicYear: session.academicYear,
      option: session.title.split(" ")[0],
      title: session.title,
      startDate: session.startDate,
      endDate: session.endDate,
    })
    toggleModal();
  };

  const deleteSession = (session) => {
    ConfirmAlert().then((res) => {
      if (res.isConfirmed) {
        new service().deleteSession(session.id)
          .then((res) => {
            if (res.status === 200) {
              AlertSuccess(res.message);
            } else {
              AlertFailed(res.message);
            }
          })
          .finally(() => {
            getSessions();
          });
      }
    });
  };

  const getSessions = () => {
    setLoading(true)
    new service().getSessions().then((data) => {
      setData(data)
      setLoading(false)
    });
  };

  useEffect(() => {
    getSessions()
  }, []);



  let dropMenuOptions = [{ "title": "View", action: editSession, icon: <Edit fontSize="small" /> }, { "title": "Delete", action: deleteSession, icon: <Delete fontSize="small" color="red" /> }]

  const cols = [
    { name: "Academic Year", selector: (row) => row.academicYear, sortable: true, },
    { name: "Curriculum", selector: (row) => row.curriculum, sortable: true, },
    { name: "Session", selector: (row) => row.title, sortable: true },
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

  return (
    <>
      <div className="mb-3 justify-content-end d-flex">
        <button className="btn btn-primary" onClick={onNewSession}>
          <i className="fa fa-plus"></i> Add New Session
        </button>
      </div>

      <DataTable
        title="Sessions list"
        progressPending={loading}
        defaultSortFieldId={1}
        columns={cols}
        data={
          data.map((session) => {
            return {
              academicYear: session.academicYear,
              curriculum: session.curriculum,
              title: session.title,
              startDate: moment(session.startDate).format('MMMM d, YYYY'),
              endDate: moment(session.endDate).format('MMMM d, YYYY'),
              action: <DropdownMenu options={dropMenuOptions} row={session} />
            };
          })} />

      <Modal isOpen={modal}>
        <form onSubmit={submitForm} method="post">
          <ModalHeader toggle={toggleModal}>
            <span>
              <i className={`fa fa-${selectedSession ? "edit" : "plus-circle"}`}></i> {selectedSession ? "Edit session details" : "Create a new session"}
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
                  <InputLabel id="options-label">Session Title</InputLabel>
                  <Select
                    labelId="options-label"
                    id="options"
                    label="Session Title"
                    color="secondary"
                    required
                    fullWidth
                    value={formData.option}
                    onChange={e => setFormData({ ...formData, option: e.target.value })}
                  >
                    {["Term", "Semester"].map(l => <MenuItem key={l} value={l}>{l}</MenuItem>)}
                  </Select>
                </FormControl>
              </div>
              <div className="mt-4">
                <FormControl fullWidth>
                  <InputLabel id="session-label">Session Number</InputLabel>
                  <Select
                    labelId="session-label"
                    id="session"
                    label="Session Number"
                    color="secondary"
                    required
                    fullWidth
                    value={formData.title}
                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                  >
                    {[1, 2, 3].map(l => <MenuItem key={l} value={formData.option + " " + l}>{formData.option + " " + l}</MenuItem>)}
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
      </Modal>
    </>
  );
};
