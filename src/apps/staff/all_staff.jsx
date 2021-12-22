import { Checkbox } from "@material-ui/core";
import { useState, useEffect } from "react";
import { Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import { DataTable } from "../../components/table";
import { RolesService, StaffService } from "../../API/staffs";
import {
  AlertFailed,
  AlertSuccess,
  ConfirmAlert,
} from "../../components/alerts";

const cols = [
  { name: "#", selector: (row) => row.serialNumber },
  { name: "Name", selector: (row) => row.name },
  { name: "Employer", selector: (row) => row.employer },
  { name: "Gender", selector: (row) => row.gender, sortable: true },
  { name: "Action", selector: (row) => row.action },
];

const AllStaff = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const [staffRoles, setStaffRoles] = useState([]);
  const [data, setData] = useState([]);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState(new Date());
  const [gender, setGender] = useState("");
  const [idNumber, setIDNumber] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [serialNumber, setSerialNumber] = useState("");
  const [employer, setEmployer] = useState("");
  const [employmentNumber, setEmploymentNumber] = useState("");
  const [staffType, setStaffType] = useState("");
  const [roles, setRoles] = useState("");
  const [createAccount, setCreateAccount] = useState(false);


  const toggleModal = () => setShowModal(!showModal);

  const onNewStaff = () => {
    toggleModal();
  };

  const getStaffs = () => {
    new StaffService().getStaffs().then((data) => {
      setData(data);
      setLoading(false);
    });
  }

  useEffect(() => {
    new RolesService().getRoles().then(data => {
      let roleData = data.sort((a, b) => a.name > b.name)
      setStaffRoles(roleData)
    })
    getStaffs();
  }, []);

  const submitForm = (e) => {
    e.preventDefault();
    setSaving(true)
    let payload = { firstName, lastName, dateOfBirth, gender, idNumber, email, phoneNumber, serialNumber, employer, employmentNumber, staffType, createAccount, roles }
    new StaffService().createStaff(payload).then(res => {
      if (res.status === 200) {
        AlertSuccess(res.message);
        toggleModal()
        getStaffs()
      } else {
        AlertFailed(res.message);
      }
    }).finally(() => {
      setSaving(false)
    })
  };


  const deleteStaff = (ID) => {
    ConfirmAlert().then((res) => {
      if (res.isConfirmed) {
        new StaffService().deleteStaff(ID)
          .then((res) => {
            if (res.status === 200) {
              AlertSuccess(res.message);
            } else {
              AlertFailed(res.message);
            }
          })
          .finally(() => {
            getStaffs()
          });
      }
    });
  };


  return (
    <>
      <div className="mb-3 justify-content-end d-flex">
        <button className="btn btn-primary" onClick={onNewStaff}>
          <i className="fa fa-plus"></i> Add New Staff
        </button>
      </div>

      <DataTable
        defaultSortFieldId={1}
        progressPending={loading}
        columns={cols} data={data.map((d) => {
          return {
            serialNumber: d.serialNumber,
            name: `${d.firstName} ${d.lastName}`,
            employer: d.employer,
            gender: d.gender,
            action: (
              <>
                <button className="btn btn-sm btn-danger ms-2"
                  onClick={() => deleteStaff(d.id)}>
                  <i className="fa fa-trash"></i> Delete
                </button>
              </>
            ),
          };
        })} />


      <Modal isOpen={showModal} size="lg">
        <form onSubmit={submitForm} method="post">
          <ModalHeader toggle={toggleModal}>
            <i className="fa fa-plus-circle"></i> Add a new staff
          </ModalHeader>
          <ModalBody>
            <div className="row">
              <div className="col-6 mt-3">
                <label>First name *</label>
                <input type="text" className="form-control"
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)} />
              </div>
              <div className="col-6 mt-3">
                <label>Last name *</label>
                <input type="text" className="form-control"
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)} />
              </div>
              <div className="col-6 mt-3">
                <label>Gender *</label>
                <select className="form-control"
                  required
                  value={gender}
                  onChange={(e) => setGender(e.target.value)} >
                  <option value="">Select</option>
                  <option value="female">Female</option>
                  <option value="male">Male</option>
                </select>
              </div>
              <div className="col-6 mt-3">
                <label>Date of birth</label>
                <input type="date" className="form-control"
                  required
                  defaultValue={dateOfBirth}
                  onChange={(e) => setDateOfBirth(new Date(Date.parse(e.target.value)))} />
              </div>
              <div className="col-12 mt-3">
                <label>Email *</label>
                <input type="email" className="form-control"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div className="col-6 mt-3">
                <label>ID Number *</label>
                <input type="text" className="form-control"
                  required
                  value={idNumber}
                  onChange={(e) => setIDNumber(e.target.value)} />
              </div>
              <div className="col-6 mt-3">
                <label>Phone number *</label>
                <input type="text" className="form-control"
                  required
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)} />
              </div>
              <div className="col-3 mt-3">
                <label>Staff Serial Number *</label>
                <input
                  type="text"
                  className="form-control"
                  required
                  placeholder="e.g 001"
                  value={serialNumber}
                  onChange={(e) => setSerialNumber(e.target.value)} />
              </div>
              <div className="col-4 mt-3">
                <label>Employment Number</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g T.S.C Number"
                  value={employmentNumber}
                  onChange={(e) => setEmploymentNumber(e.target.value)} />
              </div>
              <div className="col-5 mt-3">
                <label>Primary role</label>
                <select className="form-control"
                  onChange={(e) => setRoles([e.target.value,])} >
                  <option value="">Select</option>
                  {staffRoles.map(r => <option key={r.id} value={r.name}>{r.name}</option>)}
                </select>
              </div>
              <div className="col-6 mt-3">
                <label>Staff type</label>
                <select className="form-control"
                  value={staffType}
                  required
                  onChange={(e) => setStaffType(e.target.value)} >
                  <option value="">Select</option>
                  <option value="Teaching">Teaching</option>
                  <option value="Support Staff">Support staff</option>
                </select>
              </div>
              <div className="col-6 mt-3">
                <label>Employer</label>
                <select className="form-control"
                  required
                  value={employer}
                  onChange={(e) => setEmployer(e.target.value)} >
                  <option value="">Select</option>
                  <option value="Teachers Service Commission">Teachers Service Commission (T.S.C)</option>
                  <option value="Board of Management">Board of Management (B.O.M)</option>
                </select>
              </div>
              <div className="col-12 mt-3">
                <Checkbox checked={createAccount} onChange={() => setCreateAccount(!createAccount)} /> Create user account?
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

export default AllStaff;
