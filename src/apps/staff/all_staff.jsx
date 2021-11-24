import React, { useEffect, useState } from 'react'
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap'

const AllStaff = () => {
    const [showModal, setShowModal] = useState(false)
    const [staffID, setStaffID] = useState(null)
    const [staffs, setStaffs] = useState([])

    const toggleModal = () => setShowModal(!showModal)

    const NewStaff = () => {
        toggleModal()
        setStaffID(null)
    }

    useEffect(() => {
        let data = [
            { name: "Richard Otieno", address: "44th St, Suna Migori", type: "Teaching", employmentType: "T.S.C", gender: "Male" },
            { name: "Cynthia Woramas", address: "44th St, Suna Migori", type: "Non-Teaching", employmentType: "B.O.M", gender: "Female" }
        ]
        setStaffs(data)
    }, [])


    const SubmitStaff = (e) => {
        e.preventDefault()
    }

    return (
        <>
            <div className="mb-3 justify-content-end d-flex">
                <div className="btn-group" role="group">
                    <button className="btn btn-light" onClick={NewStaff}><i className="fa fa-plus"></i> Add Staff</button>
                    <button className="btn btn-success"><i className="fa fa-cloud-upload"></i> Upload</button>
                    <button className="btn btn-primary"><i className="fa fa-cloud-download"></i> Download</button>
                </div>
            </div>
            <table className="table table-responsive-sm table-hover">
                <thead className="bg-light">
                    <tr>
                        <td>Name</td>
                        <td>Staff Type</td>
                        <td>Gender</td>
                        <td>Action</td>
                    </tr>
                </thead>
                <tbody>
                    {staffs.map((staff, index) =>
                        <tr key={index}>
                            <td>{staff.name} <br /> <small>{staff.address}</small></td>
                            <td>{staff.type}<br /> <small>{staff.employmentType}</small></td>
                            <td>{staff.gender}</td>
                            <td>
                                <button className="btn btn-light"><i className="fa fa-edit"></i> Edit</button>
                                <button className="btn btn-info ms-2"><i className="fa fa-file"></i> View</button>
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>

            <Modal isOpen={showModal}>
                <ModalHeader toggle={toggleModal}>
                    {staffID ?
                        <span><i className="fa fa-edit"></i> Edit staff details</span> :
                        <span><i className="fa fa-plus-circle"></i> Add a new staff</span>
                    }
                </ModalHeader>
                <ModalBody>
                    <form action="" method="post">
                        <div className="row">
                            <div className="col-6 my-1">
                                <label>First name *</label>
                                <input type="text" className="form-control" />
                            </div>
                            <div className="col-6 my-1">
                                <label>Last name *</label>
                                <input type="text" className="form-control" />
                            </div>
                            <div className="col-12 my-1">
                                <label>Staff Serial Numbber *</label>
                                <input type="text" className="form-control" placeholder="e.g 001" />
                            </div>
                            <div className="col-6 my-1">
                                <label>Gender *</label>
                                <select className="form-control">
                                    <option value="">Select</option>
                                    <option value="">Female</option>
                                    <option value="">Male</option>
                                </select>
                            </div>
                            <div className="col-6 my-1">
                                <label>Date of birth</label>
                                <input type="date" className="form-control" />
                            </div>
                            <div className="col-6 my-1">
                                <label>Phone number *</label>
                                <input type="text" className="form-control" />
                            </div>
                            <div className="col-6 my-1">
                                <label>Email *</label>
                                <input type="text" className="form-control" />
                            </div>
                            <div className="col-12 my-1">
                                <label>Staff type</label>
                                <select className="form-control">
                                    <option value="">Select</option>
                                    <option value="">Teaching</option>
                                    <option value="">Non-teaching</option>
                                </select>
                            </div>
                            <div className="col-12 my-1">
                                <label>Employer</label>
                                <select className="form-control">
                                    <option value="">Select</option>
                                    <option value="">Teachers Service Commission (T.S.C)</option>
                                    <option value="">Board of Management (B.O.M)</option>
                                </select>
                            </div>
                            <div className="col-12 my-1">
                                <label>Employment Number</label>
                                <input type="text" className="form-control" placeholder="e.g T.S.C Number" />
                            </div>
                        </div>
                    </form>
                </ModalBody>
                <ModalFooter>
                    <button type="button" className="btn btn-sm btn-light"
                        onClick={toggleModal}>
                        <i className="fa fa-close"></i> Cancel</button>
                    <button type="submit" className="btn btn-sm btn-secondary"
                        onSubmit={(e) => SubmitStaff(e)}>
                        <i className="fa fa-check"></i> Add Staff</button>
                </ModalFooter>
            </Modal >
        </>
    )
}

export default AllStaff;