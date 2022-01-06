import React, { useState, useEffect } from "react";
import { Delete, Edit, Save } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import { TextField } from "@mui/material";
import { Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";

import {
  AlertFailed,
  AlertSuccess,
  ConfirmAlert,
} from "../../components/alerts";
import { DropdownMenu } from "../../components/menus";
import { DataTable } from "../../components/table";
import { Service } from "../../API/service";

const initForm = {
  name: "",
  description: ""
}

const StaffRoles = () => {
  const [modal, setModal] = useState(false);
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);

  const [roles, setRoles] = useState([]);

  const [formData, setFormData] = useState(initForm);

  const toggleModal = () => {
    if (modal) {
      setModal(false)
    } else {
      setModal(true)
    }
  }

  const onNewRole = () => {
    toggleModal();
    setSelectedRole(null);
    setFormData(initForm)
  };

  const submitForm = (e) => {
    e.preventDefault();
    setSaving(true)
    let query = selectedRole
      ? {
        query: `mutation updateRole($id: ID!, $data: NewRole!){
        session: updateRole(id: $id, input: $data){
          id
        }
      }`,
        variables: {
          "id": selectedRole.id,
          "data": formData
        }
      } :
      {
        query: `mutation createRole($data: NewRole!){
        session: createRole(input: $data){
          id
        }
      }`,
        variables: {
          "data": formData
        }
      }

    new Service().createOrUpdate(query).then((res) => {
      if (res.status === 200) {
        AlertSuccess(`Role saved successfully`);
        toggleModal();
        getRoles();
      } else {
        AlertFailed(res.message);
      }
    }).finally(() => {
      setSaving(false)
    });
  };

  const editRole = (role) => {
    setSelectedRole(role);
    setFormData({
      name: role.name,
      description: role.description
    })
    toggleModal();
  };

  const deleteRole = (role) => {
    ConfirmAlert().then((res) => {
      if (res.isConfirmed) {
        let query = {
          query: `mutation deleteRole($id: ID!){
            session: deleteRole(id: $id){
              id
            }
          }`,
          variables: {
            "id": role.id
          }
        }
        new Service().delete(query)
          .then((res) => {
            if (res.status === 200) {
              AlertSuccess(`${role.name} Role deleted successfully`);
            } else {
              AlertFailed(res.message);
            }
          })
          .finally(() => {
            getRoles();
          });
      }
    });
  };

  const getRoles = () => {
    setLoading(true)
    let rolesQuery = {
      query: `query roles{
        roles: getRoles{
          id
          name
          description
        }
      }`,
      variables: {}
    }
    new Service().getData(rolesQuery).then((res) => {
      setRoles(res?.roles || [])
      setLoading(false)
    });
  };


  useEffect(() => {
    const timeout = setTimeout(getRoles(), 5000);
    return () => clearTimeout(timeout);
  }, []);



  let dropMenuOptions = [{ "title": "Edit", action: editRole, icon: <Edit fontSize="small" /> }, { "title": "Delete", action: deleteRole, icon: <Delete fontSize="small" color="red" /> }]

  const cols = [
    { name: "Name", selector: (row) => row.name, sortable: true },
    { name: "Description", selector: (row) => row.description },
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
          <i className="fa fa-plus"></i> Add New Role
        </button>
      </div>

      <DataTable
        title="Staff Roles & Positions"
        progressPending={loading}
        defaultSortFieldId={1}
        columns={cols}
        data={
          roles.map((role) => {
            return {
              name: role.name,
              description: role.description,
              action: <DropdownMenu options={dropMenuOptions} row={role} />
            };
          })} />

      <Modal isOpen={modal}>
        <form onSubmit={submitForm} method="post">
          <ModalHeader toggle={toggleModal}>
            {selectedRole ? (
              <span>
                <i className="fa fa-edit"></i> Edit role
              </span>
            ) : (
              <span>
                <i className="fa fa-plus-circle"></i> Create a new role
              </span>
            )}
          </ModalHeader>
          <ModalBody>
            <div className="row px-3">
              <div className="mt-3">
                <TextField
                  value={formData.name}
                  label="Role name"
                  required
                  color="secondary"
                  fullWidth
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div className="mt-4">
                <TextField
                  value={formData.description}
                  label="Role Description"
                  required
                  color="secondary"
                  fullWidth
                  multiline
                  rows={4}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
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

export default StaffRoles;
