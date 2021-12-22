import React, { useState, useEffect } from "react";
import { Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import { RolesService as service } from "../../API/staffs";
import {
  AlertFailed,
  AlertSuccess,
  ConfirmAlert,
} from "../../components/alerts";
import { DataTable } from "../../components/table";

const StaffRoles = () => {
  const [modal, setModal] = useState(false);
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);

  const [data, setData] = useState([]);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

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
    setName("");
    setDescription("");
  };

  const submitForm = (e) => {
    e.preventDefault();
    setSaving(true)
    let data = selectedRole
      ? { ...selectedRole, name: name, description: description }
      : { name, description };

    if (selectedRole) {
      new service().updateRole(selectedRole.id, data).then((res) => {
        if (res.status === 200) {
          AlertSuccess(res.message);
          toggleModal();
          getRoles();
        } else {
          AlertFailed(res.message);
        }
      }).finally(() => {
        setSaving(false)
      });
    } else {
      new service().createRole(data).then((res) => {
        if (res.status === 200) {
          AlertSuccess(res.message);
          toggleModal();
          getRoles();
        } else {
          AlertFailed(res.message);
        }
      }).finally(() => {
        setSaving(false)
      });;
    }
  };

  const editRole = (role) => {
    setSelectedRole(role);
    setName(role.name);
    setDescription(role.description);
    toggleModal();
  };

  const deleteRole = (roleID) => {
    ConfirmAlert().then((res) => {
      if (res.isConfirmed) {
        new service().deleteRole(roleID)
          .then((res) => {
            if (res.status === 200) {
              AlertSuccess(res.message);
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
    new service().getRoles().then((data) => {
      setData(data)
      setLoading(false)
    });
  };

  useEffect(() => {
    const timeout = setTimeout(getRoles(), 5000);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <>
      <div className="mb-3 justify-content-end d-flex">
        <button className="btn btn-primary" onClick={onNewRole}>
          <i className="fa fa-plus"></i> Add New Role
        </button>
      </div>

      <DataTable
        progressPending={loading}
        defaultSortFieldId={1}
        columns={[
          { name: "Name", selector: (row) => row.name, sortable: true },
          { name: "Description", selector: (row) => row.description },
          { name: "Action", selector: (row) => row.action },
        ]}
        data={
          data.map((role) => {
            return {
              name: role.name,
              description: role.description,
              action: (
                <>
                  <button
                    className="btn btn-sm btn-outline-success"
                    onClick={() => editRole(role)}
                  >
                    <i className="fa fa-edit"></i> Edit
                  </button>
                  <button
                    className="btn btn-sm btn-danger ms-2"
                    onClick={() => deleteRole(role.id)}
                  >
                    <i className="fa fa-trash"></i> Delete
                  </button>
                </>
              ),
            };
          })} selectableRows />

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
            <div className="row">
              <div className="col-12 my-1">
                <label>Role name</label>
                <input
                  type="text"
                  value={name}
                  required
                  onChange={(e) => setName(e.target.value)}
                  className="form-control"
                />
              </div>
              <div className="col-12 my-1">
                <label>Role Description</label>
                <textarea
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="form-control"
                ></textarea>
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <div className="col-12 d-flex justify-content-start ps-4">
              {saving ?
                <button className="btn btn-primary" disabled
                >
                  <i className="fa fa-spin"></i> Saving...
                </button> :
                <>
                  <button
                    type="submit"
                    className="btn btn-primary"
                  >
                    <i className="fa fa-check"></i> Save
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary ms-3"
                    onClick={toggleModal}
                  >
                    <i className="fa fa-close"></i> Cancel
                  </button>
                </>
              }
            </div>
          </ModalFooter>
        </form>
      </Modal>
    </>
  );
};

export default StaffRoles;
