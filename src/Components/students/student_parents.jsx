import { gql, useLazyQuery, useMutation, useQuery } from '@apollo/client';
import { Delete, Edit, Save } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import { Button, FormControl, Stack, FormControlLabel, FormLabel, InputLabel, MenuItem, Radio, RadioGroup, Select, TextField, Box } from "@mui/material";
import { useState } from "react";
import { Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import { Gender, Relationship } from "../../app/constants";
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
query ($studentID: ID!){
  parents: getStudentParents(studentID: $studentID){
    id
    fullName
    gender
    idNumber
    mobile
    email
    occupation
    relationship
  }
}`

const SEARCH_QUERY = gql`
query ($idNumber: ID!){
  parent: getParentByIDNumber(id: $idNumber){
    id
    fullName
    gender
    idNumber
    mobile
    email
    occupation
  }
}`

const CREATE_MUTATION = gql`
mutation ($data: NewParent!){
  createParent(input: $data)
}`

const UPDATE_MUTATION = gql`
mutation ($data: OldParent!){
  updateParent(input: $data)
}`

const DELETE_MUTATION = gql`
mutation ($studentID: ID!, $parentID: ID!){
  deleteParent(studentID: $studentID, parentID: $parentID)
}`

const initForm = {
  fullName: "",
  gender: "",
  email: "",
  mobile: "",
  occupation: "",
  idNumber: "",
  relationship: "",
}

const StudentParents = (props) => {
  const { studentID } = props
  const [searchedIDNumber, setSearchedIDNumber] = useState("")
  const [modal, setModal] = useState(false);
  const [selectedParent, setSelectedParent] = useState(null);
  const [searchedParent, setSearchedParent] = useState(null);
  const [formData, setFormData] = useState(initForm);


  const { data, loading, error, refetch } = useQuery(FETCH_ALL_QUERY, {
    variables: {
      studentID
    },
  })


  const [searchData, { loading: searching, error: searchError }] = useLazyQuery(SEARCH_QUERY, {
    onCompleted: (res) => {
      if (res.parent) {
        setSelectedParent(res.parent)
        setFormData({
          fullName: res.parent.fullName,
          gender: res.parent.gender,
          email: res.parent.email,
          mobile: res.parent.mobile,
          occupation: res.parent.occupation,
          idNumber: res.parent.idNumber,
        })
      }
      setSearchedParent(true)
    },
    onError: () => {
      setSearchedParent(true)
    }
  })

  const [addNew, { loading: creating, reset: resetCreating }] = useMutation(CREATE_MUTATION, {
    onCompleted: () => {
      AlertSuccess({ text: `Parent saved successfully` });
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
      AlertSuccess({ text: `Parent updated successfully` });
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
      AlertSuccess({ text: `Parent deleted successfully` });
      refetch()
    },
    onError: (err) => {
      AlertFailed({ text: err.message });
    }
  })

  const toggleModal = () => setModal(!modal)

  const onNewParent = () => {
    setFormData(initForm)
    setSearchedIDNumber("")
    setSearchedParent(false)
    setSelectedParent(null);
    toggleModal();
  };

  const submitForm = (e) => {
    e.preventDefault();
    if (selectedParent) {
      updateData({
        variables: {
          data: { ...formData, studentID, id: selectedParent.id }
        }
      })
    } else {
      addNew({
        variables: {
          data: { ...formData, studentID }
        }
      })
    }
  };


  const editParent = ({ parent }) => {
    setSelectedParent(parent)
    setFormData({
      fullName: parent.fullName,
      gender: parent.gender,
      email: parent.email,
      mobile: parent.mobile,
      occupation: parent.occupation,
      idNumber: parent.idNumber,
      relationship: parent.relationship,
    })
    toggleModal();
  };

  const deleteParent = (parent) => {
    ConfirmAlert({ title: "Delete parent!" }).then((res) => {
      if (res.isConfirmed) {
        deleteData({
          variables: {
            studentID,
            parentID: parent.id
          }
        })
      } else if (res.isDismissed) {
        AlertWarning({ title: "Cancelled", text: "Request cancelled, parent not deleted" })
      }
    });
  };

  const searchParent = (e) => {
    e.preventDefault()
    if (searchedIDNumber !== formData.idNumber) {
      searchData({
        variables: {
          idNumber: formData.idNumber
        }
      })
      setSearchedIDNumber(formData.idNumber)
    }
  }

  if (loading) {
    return <CustomLoader />
  }

  if (error) {
    return <PageErrorAlert message={error.message} />
  }

  let dropMenuOptions = [{ "title": "Edit", action: editParent, icon: <Edit fontSize="small" /> }, { "title": "Delete", action: deleteParent, icon: <Delete fontSize="small" color="red" /> }]

  const cols = [
    {
      name: "Name", selector: (row) => row.fullName,
    },
    {
      name: "Relationship", selector: (row) => row.relationship,
    },
    {
      name: "Mobile", selector: (row) => row.mobile,
    },
    {
      name: "Email", selector: (row) => row.email,
    },
    // { name: "Occupation", selector: (row) => row.occupation },
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
      <Button variant="contained" color="secondary" onClick={onNewParent}>Add Parent</Button>

      <DataTable
        progressPending={loading}
        columns={cols}
        onRowClicked={editParent}
        data={
          data.parents.map(parent => ({
            parent,
            id: parent.id,
            fullName: parent.fullName,
            relationship: parent.relationship,
            mobile: parent.mobile,
            email: parent.email,
            occupation: parent.occupation,
            action: <DropdownMenu options={dropMenuOptions} row={parent} />
          }))
        } />

      <Modal isOpen={modal}>
        {/* searching parent modal */}
        {searching &&
          <ModalBody>
            <CustomLoader />
          </ModalBody>
        }

        {/* New parent ID modal */}
        {(!searching && !searchedParent && !selectedParent) &&
          <form onSubmit={searchParent} method="post">
            <ModalHeader toggle={toggleModal}>Add parent</ModalHeader>
            <ModalBody>
              <Box sx={{ mt: 3 }}>
                <TextField
                  value={formData.idNumber}
                  label="Parent's ID Number"
                  required
                  color="secondary"
                  fullWidth
                  onChange={(e) => setFormData({ ...formData, idNumber: e.target.value })}
                />
              </Box>
            </ModalBody>
            <ModalFooter>
              <Stack spacing={3} direction='row'>
                <Button color="secondary" variant="outlined" onClick={toggleModal}>Cancel</Button>
                <Button color="secondary" variant="contained" type="submit">Continue</Button>
              </Stack>
            </ModalFooter>
          </form>
        }

        {/* New parent details modal */}
        {(searchedParent || selectedParent) &&
          <>
            <form onSubmit={submitForm} method="post">
              <ModalHeader toggle={toggleModal}>
                {selectedParent ? "Edit details" : "Add parent"}
              </ModalHeader>
              <ModalBody>
                <div className="row px-3">
                  <div className="mt-3">
                    <TextField
                      value={formData.fullName}
                      label="Parent name"
                      required
                      color="secondary"
                      fullWidth
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    />
                  </div>
                  <div className="mt-3">
                    <FormControl>
                      <FormLabel id="gender-radio-buttons-group-label">Gender</FormLabel>
                      <RadioGroup
                        row
                        aria-labelledby="gender-radio-buttons-group-label"
                        name="gender-radio-buttons-group"
                        value={formData.gender}
                        onChange={e => setFormData({ ...formData, gender: e.target.value })}
                      >
                        {Gender.map(g => <FormControlLabel value={g} key={g} control={<Radio color='secondary' required />} label={g} />)}
                      </RadioGroup>
                    </FormControl>
                  </div>
                  <div className="mt-3">
                    <FormControl fullWidth>
                      <InputLabel id="relationship-label">Relationship</InputLabel>
                      <Select
                        labelId="relationship-label"
                        id="relationship"
                        label="Relationship"
                        value={formData.relationship}
                        required
                        fullWidth
                        onChange={e => setFormData({ ...formData, relationship: e.target.value })}
                      >
                        {Relationship[formData.gender].map(k => <MenuItem value={k} key={k}>{k}</MenuItem>)}
                      </Select>
                    </FormControl>
                  </div>
                  <div className="col-6 mt-3">
                    <TextField
                      value={formData.mobile}
                      label="Phone number"
                      required
                      color="secondary"
                      fullWidth
                      onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                    />
                  </div>
                  <div className="col-6 mt-3">
                    <TextField
                      value={formData.idNumber}
                      label="ID Number"
                      required
                      color="secondary"
                      fullWidth
                      onChange={(e) => setFormData({ ...formData, idNumber: e.target.value })}
                    />
                  </div>
                  <div className="mt-3">
                    <TextField
                      type="email"
                      value={formData.email}
                      label="Email"
                      color="secondary"
                      fullWidth
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                  <div className="mt-3">
                    <TextField
                      value={formData.occupation}
                      label="Occupation"
                      required
                      color="secondary"
                      fullWidth
                      onChange={(e) => setFormData({ ...formData, occupation: e.target.value })}
                    />
                  </div>
                </div>
              </ModalBody>
              <ModalFooter>
                <Stack direction='row' spacing={3}>
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
          </>
        }

      </Modal>
    </>
  );
};

export default StudentParents;
