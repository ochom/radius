
import React, { useState, useEffect } from "react";
import { Delete, Edit, Save } from "@mui/icons-material";
import { FormControl, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import { Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import { Service } from "../../API/service";
import {
  AlertFailed,
  AlertSuccess,
  ConfirmAlert,
} from "../../components/alerts";
import { DropdownMenu } from "../../components/menus";
import { DataTable } from "../../components/table";
import { LoadingButton } from "@mui/lab";
import { CustomLoader } from "../../components/monitors";




const initialFormData = {
  curriculum: "",
  level: "",
  stream: "",
  classTeacherID: "",
}

const levels = {
  "8-4-4": [...[1, 2, 3, 4, 5, 6, 7, 8].map(i => `Class ${i}`), ...[1, 2, 3, 4].map(i => `Form ${i}`), ...[1, 2, 3, 4].map(i => `Year ${i}`)],
  "2-6-6-3": [...[1, 2].map(i => `PP ${i}`), ...[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(i => `Grade ${i}`), ...[1, 2, 3].map(i => `Year ${i}`)],
}

export default function Classrooms() {
  const [modal, setModal] = useState(false);
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false);
  const [totalRows, setTotalRows] = useState(0);
  const [loadingSelected, setLoadingSelected] = useState(false)
  const [selectedClassID, setSelectedClassID] = useState(null);


  const [classes, setClasses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [formData, setFormData] = useState(initialFormData)

  const toggleModal = () => {
    if (modal) {
      setModal(false)
    } else {
      setModal(true)
    }
  }

  useEffect(() => {
    setLoading(true)
    let classesQuery = {
      query: `query classes{
        classes: getClasses{
          id
          curriculum
          level
          stream
          classTeacher{
            id
            firstName
            lastName
          }
        }
        teachers: getStaffs{
          id
          firstName
          lastName
        }
      }`,
      variables: {}
    }
    new Service().getData(classesQuery).then((res) => {
      setClasses(res?.classes || [])
      setTeachers(res?.teachers || [])
      setLoading(false)
    });
  }, [totalRows]);


  const onNewClass = () => {
    toggleModal();
    setSelectedClassID(null);
    setFormData(initialFormData)
  };

  const submitForm = (e) => {
    e.preventDefault();
    setSaving(true)
    let query = selectedClassID
      ? {
        query: `mutation updateClass($id: ID!, $data: NewClass!){
        session: updateClass(id: $id, input: $data){
          id
        }
      }`,
        variables: {
          id: selectedClassID,
          data: formData
        }
      } :
      {
        query: `mutation createClass($data: NewClass!){
        session: createClass(input: $data){
          id
        }
      }`,
        variables: {
          data: formData
        }
      }

    new Service().createOrUpdate(query).then((res) => {
      if (res.status === 200) {
        AlertSuccess(`Classroom saved successfully`);
        toggleModal();
        setTotalRows(totalRows + 1)
      } else {
        AlertFailed(res.message);
      }
    }).finally(() => {
      setSaving(false)
    });
  };

  const editClassroom = row => {
    setSelectedClassID(row.id);
    setLoadingSelected(true)
    let query = {
      query: `query ($id: ID!){
        classroom: getClass(id: $id){
          id
          curriculum
          level
          stream
          classTeacher{
            id
            firstName
            lastName
          }
        }
      }`,
      variables: {
        id: row.id
      }
    }

    new Service().getData(query).then(res => {
      if (res) {
        let data = res.classroom
        setFormData({
          curriculum: data.curriculum,
          level: data.level,
          stream: data.stream,
          classTeacherID: data.classTeacher.id,
        })
      }
    }).finally(() => {
      setLoadingSelected(false)
    });
    toggleModal();
  };

  const deleteClassroom = row => {
    ConfirmAlert().then((res) => {
      if (res.isConfirmed) {
        let query = {
          query: `mutation deleteClass($id: ID!){
            session: deleteClass(id: $id){
              id
            }
          }`,
          variables: {
            id: row.id
          }
        }
        new Service().delete(query)
          .then((res) => {
            if (res.status === 200) {
              AlertSuccess(`Class deleted successfully`);
              setTotalRows(totalRows - 1)
            } else {
              AlertFailed(res.message);
            }
          })
      }
    });
  };

  let dropMenuOptions = [{ "title": "Edit", action: editClassroom, icon: <Edit fontSize="small" /> }, { "title": "Delete", action: deleteClassroom, icon: <Delete fontSize="small" color="red" /> }]

  const cols = [
    { name: "Curriculum", selector: (row) => row.curriculum, sortable: true },
    { name: "Level", selector: (row) => row.level, sortable: true },
    { name: "Stream", selector: (row) => row.stream, sortable: true },
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
        <button className="btn btn-primary" onClick={onNewClass}>
          <i className="fa fa-plus"></i> Add New Class
        </button>
      </div>

      <DataTable
        title="Classes list"
        progressPending={loading}
        defaultSortFieldId={1}
        columns={cols}
        onRowClicked={editClassroom}
        data={
          classes.map((cl) => {
            return {
              id: cl.id,
              curriculum: cl.curriculum,
              level: cl.level,
              stream: cl.stream,
              classTeacher: `${cl.classTeacher.firstName} ${cl.classTeacher.lastName}`,
              action: <DropdownMenu options={dropMenuOptions} row={cl} />
            };
          })} />

      {loadingSelected ?
        <Modal isOpen={modal}>
          <ModalBody>
            <CustomLoader />
          </ModalBody>
        </Modal> :

        <Modal isOpen={modal}>
          <form onSubmit={submitForm} method="post">
            <ModalHeader toggle={toggleModal}>
              <span>
                <i className={`fa fa-${selectedClassID ? "edit" : "plus-circle"}`}></i> {selectedClassID ? "Edit class details" : "Create a new class"}
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
                  <FormControl fullWidth>
                    <InputLabel id="teacher-label">Class Teacher</InputLabel>
                    <Select
                      labelId="teacher-label"
                      id="teacher"
                      label="Class Teacher"
                      color="secondary"
                      required
                      fullWidth
                      value={formData.classTeacherID}
                      onChange={e => setFormData({ ...formData, classTeacherID: e.target.value })}
                    >
                      {teachers.map(l => <MenuItem key={l.id} value={l.id}>{l.firstName} {l.lastName}</MenuItem>)}
                    </Select>
                  </FormControl>
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
      }
    </>
  );
};
