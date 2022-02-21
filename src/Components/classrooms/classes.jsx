import { gql, useQuery } from "@apollo/client";
import { Add, Delete, Edit, Save } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import { Box, Button, FormControl, InputLabel, MenuItem, Select, TextField } from "@mui/material";
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
  query classrooms{
    classrooms: getClassrooms{
      id
      curriculum
      level
      stream
      classTeacher{
        id
        title
        fullName
      }
    }
    teachers: getTeachers{
      id
      title
      fullName
    }
  }
`

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
  const { data, loading, error, refetch } = useQuery(FETCH_QUERY)

  const [modal, setModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loadingSelected, setLoadingSelected] = useState(false)
  const [selectedClassroomID, setSelectedClassroomID] = useState(null);


  const [formData, setFormData] = useState(initialFormData)

  const toggleModal = () => setModal(!modal)


  const onNewClass = () => {
    toggleModal();
    setSelectedClassroomID(null);
    setFormData(initialFormData)
  };

  const submitForm = (e) => {
    e.preventDefault();
    setSaving(true)
    let query = selectedClassroomID
      ? {
        query: `mutation ($id: ID!, $data: NewClassroom!){
        updateClassroom(id: $id, input: $data)
     }`,
        variables: {
          id: selectedClassroomID,
          data: formData
        }
      } :
      {
        query: `mutation ($data: NewClassroom!){
        createClassroom(input: $data)
      }`,
        variables: {
          data: formData
        }
      }

    new Service().createOrUpdate(query).then((res) => {
      if (res.status === 200) {
        AlertSuccess({ text: `Classroom saved successfully` });
        toggleModal();
        refetch()
      } else {
        AlertFailed({ text: res.message });
      }
    }).finally(() => {
      setSaving(false)
    });
  };

  const editClassroom = row => {
    setSelectedClassroomID(row.id);
    setLoadingSelected(true)
    let query = {
      query: `query ($id: ID!){
        classroom: getClassroom(id: $id){
          id
          curriculum
          level
          stream
          classTeacher{
            id
            title
            fullName
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
    ConfirmAlert({ title: "Delete classroom!" }).then((res) => {
      if (res.isConfirmed) {
        let query = {
          query: `mutation ($id: ID!){
            deleteClassroom(id: $id)
          }`,
          variables: {
            id: row.id
          }
        }
        new Service().delete(query)
          .then((res) => {
            if (res.status === 200) {
              AlertSuccess({ text: `Classroom deleted successfully` });
              refetch()
            } else {
              AlertFailed({ text: res.message });
            }
          })
      } else if (res.isDismissed) {
        AlertWarning({ title: "Cancelled", text: "Request cancelled, classroom not deleted" })
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


  if (loading) {
    return <CustomLoader />
  }

  if (error) {
    return <PageErrorAlert message={error.message} />
  }

  return (
    <>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'end' }}>
        <Button color="secondary" variant="contained" className="no-transform" onClick={onNewClass}>
          <Add /> Add New Classroom
        </Button>
      </Box>

      <DataTable
        defaultSortFieldId={1}
        columns={cols}
        onRowClicked={editClassroom}
        data={
          data.classrooms.map((cl) => {
            return {
              id: cl.id,
              curriculum: cl.curriculum,
              level: cl.level,
              stream: cl.stream,
              classTeacher: `${cl.classTeacher.title} ${cl.classTeacher.fullName}`,
              action: <DropdownMenu options={dropMenuOptions} row={cl} />
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
                <i className={`fa fa-${selectedClassroomID ? "edit" : "plus-circle"}`}></i> {selectedClassroomID ? "Edit classroom details" : "Create a new classroom"}
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
                      {data.teachers.map(l => <MenuItem key={l.id} value={l.id}>{l.title} {l.fullName}</MenuItem>)}
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
        }

      </Modal>
    </>
  );
};
