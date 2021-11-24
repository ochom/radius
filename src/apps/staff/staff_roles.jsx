import React, { Component } from 'react'
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap'

export default class StaffRoles extends Component {
    state = {
        showModal: false,
        selectedRole: null,
    }
    myRef = React.createRef()

    toggleModal = () => { this.setState({ showModal: !this.state.showModal }) }

    onNewRole = () => {
        this.toggleModal()
        this.setState({ selectedRole: null })
    }


    onSubmitRole = (e) => {
        e.preventDefault()
    }


    render() {
        const { showModal } = this.state
        const roles = [
            { title: "Principal", description: "Head of the school" },
            { title: "D. Principal", description: "Assistant Head of the school" },
            { title: "HOD Boarding", description: "Head of Department, boarding" },
            { title: "HOD Academics", description: "Head of Department, academics" },
            { title: "HOD Games", description: "Head of Department, games" },
            { title: "HOS English/Literature", description: "Head of Subject/Studies, English and Literature" },
        ]

        const modal =
            <Modal isOpen={showModal} ref={this.myRef}>
                <ModalHeader toggle={this.toggleModal}>
                    {this.state.selectedRole ?
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
                    <button type="button" className="btn btn-sm btn-light"
                        onClick={this.toggleModal}>
                        <i className="fa fa-close"></i> Cancel</button>
                    <button type="submit" className="btn btn-sm btn-primary"
                        onSubmit={this.onSubmitRole}>
                        <i className="fa fa-check"></i> Add Role</button>
                </ModalFooter>
            </Modal >

        return (
            <>
                {modal}
                <div className="mb-3 justify-content-end d-flex">
                    <div className="btn-group" role="group">
                        <button className="btn btn-primary" onClick={this.onNewRole}><i className="fa fa-plus"></i> Add Role</button>
                    </div>
                </div>
                <table className="table table-responsive-sm table-hover">
                    <thead className="bg-light">
                        <tr>
                            <td>Name</td>
                            <td>Description</td>
                            <td>Action</td>
                        </tr>
                    </thead>
                    <tbody>
                        {roles.map((role, index) =>
                            <tr key={index}>
                                <td>{role.title}</td>
                                <td>{role.description}</td>
                                <td>
                                    <button className="btn btn-light"><i className="fa fa-edit"></i> Edit</button>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </>
        )
    }
}
