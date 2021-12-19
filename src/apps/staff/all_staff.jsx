import Axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap'
import { API_ROOT } from '../../common/config';
import { DataTable, DataWithCaption } from "../../components/table";

const AllStaff = () => {
  const [showModal, setShowModal] = useState(false);
  const [staffID, setStaffID] = useState(null);
  const [columns, setColumns] = useState([]);
  const [rows, setRows] = useState([]);

  const toggleModal = () => setShowModal(!showModal);

  const onNewStaff = () => {
    toggleModal();
    setStaffID(null);
  };

  useEffect(() => {
    Axios.get(`${API_ROOT}/staffs`)
    let data = [
      {
        name: "Richard Ochom",
        address: "44-40402 Migori, Kenya",
        type: "Teaching Staff",
        employment: "T.S.C",
        sex: "Male",
      },
      {
        name: "Aketch Wiko",
        address: "Kilundezy, Nairobi",
        type: "Support Staff",
        employment: "B.O.M",
        sex: "Female",
      },
    ];

    let rowData = data.map((d, i) => {
      return {
        name: <DataWithCaption data={d.name} caption={d.address} />,
        group: <DataWithCaption data={d.type} caption={d.employment} />,
        gender: d.sex,
        action: (
          <>
            <button className="btn btn-sm btn-primary">
              <i className="fa fa-edit"></i> Edit
            </button>
            <button className="btn btn-sm btn-danger ms-2">
              <i className="fa fa-trash"></i> Delete
            </button>
          </>
        ),
      };
    });

    let cols = [
      { name: "Name", selector: (row) => row.name },
      { name: "Group", selector: (row) => row.group },
      { name: "Gender", selector: (row) => row.gender, sortable: true },
      { name: "Action", selector: (row) => row.action },
    ];

    setColumns(cols);
    setRows(rowData);
  }, []);

  const SubmitStaff = (e) => {
    e.preventDefault();
  };

  return (
    <>
      <div className="mb-3 justify-content-end d-flex">
        <div>
          <button className="btn btn-primary" onClick={onNewStaff}>
            <i className="fa fa-plus"></i> Add New Staff
          </button>
          <button className="btn btn-success ms-3">
            <i className="fa fa-cloud-upload"></i> Upload
          </button>
          <button className="btn btn-secondary ms-3">
            <i className="fa fa-cloud-download"></i> Download
          </button>
        </div>
      </div>
      <DataTable columns={columns} data={rows} selectableRows />

      <Modal isOpen={showModal} size="md">
        <ModalHeader toggle={toggleModal}>
          {staffID ? (
            <span>
              <i className="fa fa-edit"></i> Edit staff details
            </span>
          ) : (
            <span>
              <i className="fa fa-plus-circle"></i> Add a new staff
            </span>
          )}
        </ModalHeader>
        <ModalBody>
          <form action="" method="post">
            <div className="row">
              <div className="col-6 mt-3">
                <label>First name *</label>
                <input type="text" className="form-control" />
              </div>
              <div className="col-6 mt-3">
                <label>Last name *</label>
                <input type="text" className="form-control" />
              </div>
              <div className="col-6 mt-3">
                <label>Gender *</label>
                <select className="form-control">
                  <option value="">Select</option>
                  <option value="">Female</option>
                  <option value="">Male</option>
                </select>
              </div>
              <div className="col-6 my-2">
                <label>Date of birth</label>
                <input type="date" className="form-control" />
              </div>

              <div className="col-12 mt-3">
                <label>Phone number *</label>
                <input type="text" className="form-control" />
              </div>
              <div className="col-12 mt-3">
                <label>Email *</label>
                <input type="text" className="form-control" />
              </div>
              <div className="col-12 mt-3">
                <label>Staff Serial Number *</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g 001"
                />
              </div>
              <div className="col-6 mt-3">
                <label>Staff type</label>
                <select className="form-control">
                  <option value="">Select</option>
                  <option value="">Teaching</option>
                  <option value="">Non-teaching</option>
                </select>
              </div>
              <div className="col-6 mt-3">
                <label>Employer</label>
                <select className="form-control">
                  <option value="">Select</option>
                  <option value="">Teachers Service Commission (T.S.C)</option>
                  <option value="">Board of Management (B.O.M)</option>
                </select>
              </div>
              <div className="col-12 mt-3">
                <label>Employment Number</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g T.S.C Number"
                />
              </div>
            </div>
          </form>
        </ModalBody>
        <ModalFooter>
          <button
            type="submit"
            className="btn btn-sm btn-primary"
            onSubmit={(e) => SubmitStaff(e)}
          >
            <i className="fa fa-check"></i> Add Staff
          </button>
          <button
            type="button"
            className="btn btn-sm btn-secondary"
            onClick={toggleModal}
          >
            <i className="fa fa-close"></i> Cancel
          </button>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default AllStaff;
