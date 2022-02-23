import { gql, useLazyQuery, useMutation, useQuery } from "@apollo/client";
import { Add, Delete, Edit, Save } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import { Box, Button, FormControl, InputLabel, MenuItem, Select, Stack, TextField } from "@mui/material";
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
const FETCH_ONE_QUERY = gql`
  query ($id: ID!){
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
  }
`

const CREATE_MUTATION = gql`
  mutation ($data: NewClassroom!){
    createClassroom(input: $data)
  }
`

const UPDATE_MUTATION = gql`
  mutation ($id: ID!, $data: NewClassroom!){
    updateClassroom(id: $id, input: $data)
  }
`

const DELETE_MUTATION = gql`
  mutation ($id: ID!){
    deleteClassroom(id: $id)
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
  const [modal, setModal] = useState(false);
  const [formData, setFormData] = useState(initialFormData)
  const [selectedClassroom, setSelectedClassroom] = useState(null)

  const { data, loading, error, refetch } = useQuery(FETCH_ALL_QUERY)

  const [fetchOne, { loading: loadingSelected, error: selectedError }] = useLazyQuery(FETCH_ONE_QUERY, {
    onCompleted: (res) => {
      if (res.classroom) {
        let classroom = res.classroom
        setSelectedClassroom(classroom)
        setFormData({
          curriculum: classroom.curriculum,
          level: classroom.level,
          stream: classroom.stream,
          classTeacherID: classroom.classTeacher.id
        })
      }
    }
  })

  const [addNew, { loading: creating, reset: resetCreating }] = useMutation(CREATE_MUTATION, {
    onCompleted: () => {
      AlertSuccess({ text: `Classroom saved successfully` });
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
      AlertSuccess({ text: `Classroom updated successfully` });
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
      AlertSuccess({ text: `Classroom deleted successfully` });
      refetch()
    },
    onError: (err) => {
      AlertFailed({ text: err.message });
    }
  })

  const toggleModal = () => setModal(!modal)

  const onNewClass = () => {
    setSelectedClassroom(null)
    setFormData(initialFormData)
    toggleModal();
  };

  const submitForm = (e) => {
    e.preventDefault();
    if (selectedClassroom) {
      updateData({
        variables: {
          id: selectedClassroom.id,
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

  const editClassroom = ({ id }) => {
    fetchOne({
      variables: {
        id: id
      }
    })
    toggleModal();
  };

  const deleteClassroom = ({ id }) => {
    ConfirmAlert({ title: "Delete classroom!" }).then((res) => {
      if (res.isConfirmed) {
        deleteData({
          variables: {
            id: id
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
              {selectedClassroom ? "Edit classroom details" : "Create a new classroom"}
            </ModalHeader>
            <ModalBody>
              <Box className="row px-3">
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
                </Box>
                <Box className="mt-4">
                  <TextField
                    label="Stream"
                    color="secondary"
                    placeholder="(optional)"
                    fullWidth
                    value={formData.stream}
                    onChange={(e) => setFormData({ ...formData, stream: e.target.value })}
                  />
                </Box>
                <Box className="mt-4">
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
