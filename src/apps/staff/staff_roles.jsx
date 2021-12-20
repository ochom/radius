import React, { useState, useEffect } from "react";
import { Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import { CreateRole, DeleteRole, GetRoles } from "../../API/staffs";
import { AlertFailed, AlertSuccess } from "../../components/alerts";
import { DataTable } from "../../components/table";
import { Response } from "../../Models/common";

const StaffRoles = () => {
  const [modal, setModal] = useState(false);
  const [roleID, setRoleID] = useState(null);
  const [columns, setColumns] = useState([]);
  const [rows, setRows] = useState([]);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const toggleModal = () => setModal(!modal);

  const onNewRole = () => {
    toggleModal();
    setRoleID(null)
    setName("")
    setDescription("")
  };

  const SubmitRole = (e: any) => {
    e.preventDefault();
    let data = { name, description }
    CreateRole(data).then((res: Response) => {
      if (res.status === 200) {
        AlertSuccess(res.message);
        toggleModal()
        getRoles()
      } else {
        AlertFailed(res.message);
      }
    })
  };

  const editRole = (role: any) => {
    setRoleID(role.id)
    setName(role.name)
    setDescription(role.description)
    toggleModal()
  }

  const deleteRole = (roleID: any) => {
    DeleteRole(roleID).then((res: Response) => {
      if (res.status === 200) {
        AlertSuccess(res.message);
      } else {
        AlertFailed(res.message);
      }
    }).finally(() => {
      getRoles();
    })
  }

  const getRoles = () => {
    GetRoles().then((data) => {
      let rowData = data.map((d) => {
        return {
          name: d.name,
          description: d.description,
          action: (
            <>
              <button className="btn btn-sm btn-outline-success" onClick={() => editRole(d)}>
                <i className="fa fa-edit"></i> Edit
              </button>
              <button className="btn btn-sm btn-danger ms-2" onClick={() => deleteRole(d.id)}>
                <i className="fa fa-trash" ></i> Delete
              </button>
            </>
          ),
        };
      });

      let cols: any = [
        { name: "Name", selector: (row) => row.name, sortable: true },
        { name: "Description", selector: (row) => row.description },
        { name: "Action", selector: (row) => row.action },
      ];

      setColumns(cols);
      setRows(rowData);
    });
  }


  useEffect(() => {
    getRoles();
  }, []);

  return (
    <>
      <div className="mb-3 justify-content-end d-flex">
        <div className="" role="group">
          <button className="btn btn-primary" onClick={onNewRole}>
            <i className="fa fa-plus"></i> Add New Role
          </button>
          <button className="btn btn-success ms-3">
            <i className="fa fa-cloud-upload"></i> Upload
          </button>
          <button className="btn btn-secondary  ms-3">
            <i className="fa fa-cloud-download"></i> Download
          </button>
        </div>
      </div>

      <DataTable columns={columns} data={rows} selectableRows />

      <Modal isOpen={modal}>
        <form onSubmit={SubmitRole} method="post">
          <ModalHeader toggle={toggleModal}>
            {roleID !== null ? (
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
                >
                </textarea>
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <button
              type="submit"
              className="btn btn-sm btn-primary"
              onSubmit={SubmitRole}
            >
              <i className="fa fa-check"></i> Save
            </button>
            <button
              type="button"
              className="btn btn-sm btn-secondary"
              onClick={toggleModal}
            >
              <i className="fa fa-close"></i> Cancel
            </button>
          </ModalFooter>
        </form>
      </Modal>
    </>
  );
};

export default StaffRoles;
