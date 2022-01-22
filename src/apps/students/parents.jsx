import React, { useState, useEffect } from "react";
import { Delete, Edit, Save } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import { Button, FormControl, FormControlLabel, FormLabel, InputLabel, MenuItem, Radio, RadioGroup, Select, TextField } from "@mui/material";
import { Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";

import {
  AlertFailed,
  AlertSuccess,
  ConfirmAlert,
} from "../../components/alerts";
import { DropdownMenu } from "../../components/menus";
import { DataTable } from "../../components/table";
import { Service } from "../../API/service";
import { Gender, Relationship } from "../../Models/enums";
import { CustomLoader } from "../../components/monitors";

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

  const [modal, setModal] = useState(false);
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false);

  const [selectedParent, setSelectedParent] = useState(null);
  const [searchedParent, setSearchedParent] = useState(null);
  const [searchingParent, setSearchingParent] = useState(false);

  const [totalParents, setTotalParents] = useState(0);
  const [parents, setParents] = useState([]);

  const [formData, setFormData] = useState(initForm);


  useEffect(() => {
    setLoading(true)
    let query = {
      query: `query ($studentID: ID!){
        parents: getParents(studentID: $studentID){
          id
          fullName
          relationship
          gender
          idNumber
          mobile
          email
          occupation
        }
      }`,
      variables: {
        studentID
      }
    }
    new Service().getData(query).then((res) => {
      setParents(res?.parents || [])
      setLoading(false)
    });
  }, [studentID, totalParents]);


  const toggleModal = () => {
    if (modal) {
      setModal(false)
    } else {
      setModal(true)
    }
  }

  const onNewParent = () => {
    setFormData(initForm)
    setSearchedParent(false)
    setSearchingParent(false)
    setSelectedParent(null);
    toggleModal();
  };

  const submitForm = (e) => {
    e.preventDefault();
    setSaving(true)
    let query = selectedParent
      ? {
        query: `mutation ($data: OldParent!){
        updateParent(input: $data)
      }`,
        variables: {
          data: { ...formData, studentID, id: selectedParent.id }
        }
      } :
      {
        query: `mutation ($data: NewParent!){
        createParent(input: $data)
      }`,
        variables: {
          data: { ...formData, studentID }
        }
      }

    new Service().createOrUpdate(query).then((res) => {
      if (res.status === 200) {
        AlertSuccess(`Parent saved successfully`);
        toggleModal();
        setTotalParents(totalParents + 1)
      } else {
        AlertFailed(res.message);
      }
    }).finally(() => {
      setSaving(false)
    });
  };


  const editParent = (data) => {
    setSelectedParent(data);
    setFormData({
      ...formData,
      fullName: data.fullName,
      gender: data.gender,
      email: data.email,
      mobile: data.mobile,
      occupation: data.occupation,
      idNumber: data.idNumber,
      relationship: data.relationship,
    })
    toggleModal();
  };

  const deleteParent = (parent) => {
    ConfirmAlert().then((res) => {
      if (res.isConfirmed) {
        let query = {
          query: `mutation ($studentID: ID!, $parentID: ID!){
            deleteParent(studentID: $studentID, parentID: $parentID)
          }`,
          variables: {
            studentID,
            parentID: parent.id
          }
        }
        new Service().delete(query)
          .then((res) => {
            if (res.status === 200) {
              AlertSuccess("Parent deleted successfully");
              setTotalParents(totalParents - 1)
            } else {
              AlertFailed(res.message);
            }
          })
      }
    });
  };

  const searchParent = (e) => {
    e.preventDefault()
    setSearchingParent(true)
    let query = {
      query: `query ($data: ID!){
        parent: getParentByIDNumber(id: $data){
          id
          fullName
          relationship
          gender
          idNumber
          mobile
          email
          occupation
        }
      }`,
      variables: {
        data: formData.idNumber
      }
    }
    new Service().getData(query).then((res) => {
      if (res.parent) {
        setFormData({
          ...formData,
          fullName: res?.parent.fullName,
          gender: res?.parent.gender,
          email: res?.parent.email,
          mobile: res?.parent.mobile,
          occupation: res?.parent.occupation,
          idNumber: res?.parent.idNumber,
          relationship: res?.parent.relationship,
        })
      }
      setSearchingParent(false)
      setSearchedParent(true)
    });
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
        data={
          parents.map((parent) => {
            return {
              fullName: parent.fullName,
              relationship: parent.relationship,
              mobile: parent.mobile,
              email: parent.email,
              occupation: parent.occupation,
              action: <DropdownMenu options={dropMenuOptions} row={parent} />
            };
          })} />

      <Modal isOpen={modal}>
        <form onSubmit={(!searchedParent && !selectedParent) ? searchParent : submitForm} method="post">
          <ModalHeader toggle={toggleModal}>
            {selectedParent ? "Edit details" : "Add parent"}
          </ModalHeader>
          <ModalBody>
            {(!searchedParent && !selectedParent) &&
              <div className="row px-3">
                {searchingParent ? <CustomLoader /> :
                  <div>
                    <div className="mt-3">
                      <TextField
                        value={formData.idNumber}
                        label="Parent's ID Number"
                        required
                        color="secondary"
                        fullWidth
                        onChange={(e) => setFormData({ ...formData, idNumber: e.target.value })}
                      />
                    </div>
                    <div className="my-5">
                      <Button color="secondary" variant="contained" type="submit">Continue</Button>
                    </div>
                  </div>
                }
              </div>
            }
            {(searchedParent || selectedParent) &&
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
            }
          </ModalBody>
          {(searchedParent || selectedParent) &&
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
          }
        </form>
      </Modal>
    </>
  );
};

export default StudentParents;
