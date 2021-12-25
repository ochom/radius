
import React, { useState, useEffect } from "react";
import { Delete, Edit, Save } from "@mui/icons-material";
import { FormControl, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import { Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import { ClassroomsService as service } from "../../API/classes";
import {
  AlertFailed,
  AlertSuccess,
  ConfirmAlert,
} from "../../components/alerts";
import { DropdownMenu } from "../../components/menus";
import { DataTable } from "../../components/table";
import { LoadingButton } from "@mui/lab";


const initialFormData = {
  curriculum: "",
  academicYear: "",
  level: "",
  stream: "",
  classTeacher: "",
}

const levels = {
  "8-4-4": [...[1, 2, 3, 4, 5, 6, 7, 8].map(i => `Class ${i}`), ...[1, 2, 3, 4].map(i => `Form ${i}`), ...[1, 2, 3, 4].map(i => `Year ${i}`)],
  "2-6-6-3": [...[1, 2].map(i => `PP ${i}`), ...[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(i => `Grade ${i}`), ...[1, 2, 3].map(i => `Year ${i}`)],
}

export default function Classrooms() {
  const [modal, setModal] = useState(false);
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false);
  const [selectedClassroom, setSelectedClassroom] = useState(null);

  const [data, setData] = useState([]);
  const [formData, setFormData] = useState(initialFormData)

  const toggleModal = () => {
    if (modal) {
      setModal(false)
    } else {
      setModal(true)
    }
  }

  const onNewRole = () => {
    toggleModal();
    setSelectedClassroom(null);
    setFormData(initialFormData)
  };

  const submitForm = (e) => {
    e.preventDefault();
    setSaving(true)
    let data = selectedClassroom
      ? { ...selectedClassroom, ...formData }
      : formData;

    if (selectedClassroom) {
      new service().updateClassroom(selectedClassroom.id, data).then((res) => {
        if (res.status === 200) {
          AlertSuccess(res.message);
          toggleModal();
          getClassrooms();
        } else {
          AlertFailed(res.message);
        }
      }).finally(() => {
        setSaving(false)
      });
    } else {
      new service().createClassroom(data).then((res) => {
        if (res.status === 200) {
          AlertSuccess(res.message);
          toggleModal();
          getClassrooms();
        } else {
          AlertFailed(res.message);
        }
      }).finally(() => {
        setSaving(false)
      });;
    }
  };

  const editClassroom = (classroom) => {
    setSelectedClassroom(classroom);
    setFormData({
      curriculum: classroom.curriculum,
      academicYear: classroom.academicYear,
      level: classroom.level,
      stream: classroom.stream,
      classTeacher: classroom.classTeacher,
    })
    toggleModal();
  };

  const deleteClassroom = (classroom) => {
    ConfirmAlert().then((res) => {
      if (res.isConfirmed) {
        new service().deleteClassroom(classroom.id)
          .then((res) => {
            if (res.status === 200) {
              AlertSuccess(res.message);
            } else {
              AlertFailed(res.message);
            }
          })
          .finally(() => {
            getClassrooms();
          });
      }
    });
  };

  const getClassrooms = () => {
    setLoading(true)
    new service().getClassrooms().then((data) => {
      setData(data)
      setLoading(false)
    });
  };

  useEffect(() => {
    getClassrooms()
  }, []);



  let dropMenuOptions = [{ "title": "View", action: editClassroom, icon: <Edit fontSize="small" /> }, { "title": "Delete", action: deleteClassroom, icon: <Delete fontSize="small" color="red" /> }]

  const cols = [
    { name: "Curriculum", selector: (row) => row.curriculum, sortable: true },
    { name: "Level", selector: (row) => row.level },
    { name: "Stream", selector: (row) => row.stream },
    { name: "Class Teacher", selector: (row) => row.classTeacher },
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
        <button className="btn btn-primary" onClick={onNewRole}>
          <i className="fa fa-plus"></i> Add New Class
        </button>
      </div>

      <DataTable
        progressPending={loading}
        defaultSortFieldId={1}
        columns={cols}
        data={
          data.map((classroom) => {
            return {
              curriculum: classroom.curriculum,
              level: classroom.level,
              stream: classroom.stream,
              classTeacher: classroom.classTeacher,
              action: <DropdownMenu options={dropMenuOptions} row={classroom} />
            };
          })} />

      <Modal isOpen={modal}>
        <form onSubmit={submitForm} method="post">
          <ModalHeader toggle={toggleModal}>
            <span>
              <i className={`fa fa-${selectedClassroom ? "edit" : "plus-circle"}`}></i> {selectedClassroom ? "Edit class details" : "Create a new class"}
            </span>
          </ModalHeader>
          <ModalBody>
            <div className="row px-3">
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
                  <InputLabel id="curriculum-label">Level</InputLabel>
                  <Select
                    labelId="level-label"
                    id="level"
                    label="Level"
                    color="secondary"
                    required
                    fullWidth
                    value={formData.level}
                    onChange={e => setFormData({ ...formData, level: e.target.value })}
                  >
                    {(levels[formData.curriculum] || []).map(l => <MenuItem key={l} value={l}>{l}</MenuItem>)}
                  </Select>
                </FormControl>
              </div>
              <div className="mt-4">
                <TextField
                  label="Stream"
                  color="secondary"
                  placeholder="(optional)"
                  fullWidth
                  value={formData.stream}
                  onChange={(e) => setFormData({ ...formData, stream: e.target.value })}
                />
              </div>
              <div className="mt-4">
                <TextField
                  label="Class Teacher"
                  required
                  color="secondary"
                  fullWidth
                  value={formData.classTeacher}
                  onChange={(e) => setFormData({ ...formData, classTeacher: e.target.value })}
                />
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <LoadingButton
              type='submit'
              variant='contained'
              color='secondary'
              size='large'
              loading={saving}
              loadingPosition="start"
              startIcon={<Save />}>Save</LoadingButton>
          </ModalFooter>
        </form>
      </Modal>
    </>
  );
};
