import React, { useState, useEffect } from 'react'
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap'
import DataTable from '../../components/table'

const StaffRoles = () => {
    const [modal, setModal] = useState(false)
    const [roleID, setRoleID] = useState(null)
    const [columns, setColumns] = useState([])
    const [rows, setRows] = useState([])

    const toggleModal = () => setModal(!modal)

    const onNewRole = () => {
        toggleModal()
        setRoleID(null)
    }

    const onSubmitRole = (e) => {
        e.preventDefault();
    }


    useEffect(() => {
        let data = [
            { title: "Principal", description: "Head of the school" },
            { title: "D. Principal", description: "Assistant Head of the school" },
            { title: "HOD Boarding", description: "Head of Department, boarding" },
            { title: "HOD Academics", description: "Head of Department, academics" },
            { title: "HOD Games", description: "Head of Department, games" },
            { title: "HOS English/Literature", description: "Head of Subject/Studies, English and Literature" },
            { title: "Principal", description: "Head of the school" },
            { title: "D. Principal", description: "Assistant Head of the school" },
            { title: "HOD Boarding", description: "Head of Department, boarding" },
            { title: "HOD Academics", description: "Head of Department, academics" },
            { title: "HOD Games", description: "Head of Department, games" },
            { title: "HOS English/Literature", description: "Head of Subject/Studies, English and Literature" },
        ]

        let rowData = data.map((d, i) => {
            return {
                name: <td>{d.title}</td>,
                description: <td>{d.description}</td>,
                action: <>
                    <button className='btn btn-sm btn-primary'><i className='fa fa-edit'></i> Edit</button>
                    <button className='btn btn-sm btn-danger ms-2'><i className='fa fa-trash'></i> Delete</button>
                </>
            }
        })

        let cols = [
            { name: "Name", selector: row => row.name, sortable: true },
            { name: "Description", selector: row => row.description },
            { name: "Action", selector: row => row.action }
        ]

        setColumns(cols)
        setRows(rowData)
    }, [])

    return (
        <>
            <div className="mb-3 justify-content-end d-flex">
                <div className="" role="group">
                    <button className="btn btn-primary" onClick={onNewRole}><i className="fa fa-plus"></i> Add New Role</button>
                    <button className="btn btn-success ms-3"><i className="fa fa-cloud-upload"></i> Upload</button>
                    <button className="btn btn-secondary  ms-3"><i className="fa fa-cloud-download"></i> Download</button>
                </div>
            </div>

            <DataTable
                columns={columns}
                data={rows}
                selectableRows
            />

            <Modal isOpen={modal}>
                <ModalHeader toggle={toggleModal}>
                    {roleID !== null ?
                        <span><i className="fa fa-edit"></i> Edit role</span> :
                        <span><i className="fa fa-plus-circle"></i> Create a new role</span>
                    }
                </ModalHeader>
                <ModalBody>
                    <form action="" method="post">
                        <div className="row">
                            <div className="col-12 my-1">
                                <label>Role name</label>
                                <input type="text" className="form-control" />
                            </div>
                            <div className="col-12 my-1">
                                <label>Role Description</label>
                                <textarea type="text" className="form-control"></textarea>
                            </div>
                        </div>
                    </form>
                </ModalBody>
                <ModalFooter>
                    <button type="submit" className="btn btn-sm btn-primary"
                        onSubmit={onSubmitRole}>
                        <i className="fa fa-check"></i> Add Role</button>
                    <button type="button" className="btn btn-sm btn-secondary"
                        onClick={toggleModal}>
                        <i className="fa fa-close"></i> Cancel</button>
                </ModalFooter>
            </Modal >
        </>
    )
}

export default StaffRoles;

