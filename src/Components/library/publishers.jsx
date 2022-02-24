import { gql, useLazyQuery, useMutation, useQuery } from '@apollo/client';
import { Add, Delete, Edit, Save } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import { Box, Button, Stack, TextField } from '@mui/material';
import { useState } from 'react';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import { AlertFailed, AlertSuccess, AlertWarning, ConfirmAlert } from '../customs/alerts';
import { PageErrorAlert } from '../customs/empty-page';
import { DropdownMenu } from '../customs/menus';
import { CustomLoader } from '../customs/monitors';
import { DataTable } from '../customs/table';



const FETCH_ALL_QUERY = gql`
query{
  publishers: getPublishers{
    id
    name
  }
}`

const FETCH_ONE_QUERY = gql`
query ($id: ID!){
  publisher: getPublisher(id: $id){
    id
    name
  }
}`

const CREATE_MUTATION = gql`
mutation ($data: NewParent!){
  createParent(input: $data)
}`

const UPDATE_MUTATION = gql`
mutation ($id: ID!, $data: NewPublisher!){
  updatePublisher(id: $id, input: $data)
}`

const DELETE_MUTATION = gql`
mutation ($studentID: ID!, $parentID: ID!){
  deleteParent(studentID: $studentID, parentID: $parentID)
}`

const initialFormData = {
  name: ""
}

export default function Publishers() {
  const [modal, setModal] = useState(false);
  const [selectedPublisher, setSelectedPublisher] = useState(null);
  const [formData, setFormData] = useState(initialFormData)

  const { loading, error, data, refetch } = useQuery(FETCH_ALL_QUERY)

  const [fetchOne, { loading: loadingSelected, error: selectedError }] = useLazyQuery(FETCH_ONE_QUERY, {
    onCompleted: (res) => {
      if (res.publisher) {
        let publisher = res.publisher
        setSelectedPublisher(publisher)
        setFormData({
          name: publisher.name,
          description: publisher.description
        })
      }
    }
  })

  const [addNew, { loading: creating, reset: resetCreating }] = useMutation(CREATE_MUTATION, {
    onCompleted: () => {
      AlertSuccess({ text: `Publisher saved successfully` });
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
      AlertSuccess({ text: `Publisher updated successfully` });
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
      AlertSuccess({ text: `Publisher deleted successfully` });
      refetch()
    },
    onError: (err) => {
      AlertFailed({ text: err.message });
    }
  })

  const toggleModal = () => setModal(!modal)

  const onNewPublisher = () => {
    setSelectedPublisher(null);
    setFormData(initialFormData)
    toggleModal();
  };

  const submitForm = (e) => {
    e.preventDefault();
    if (selectedPublisher) {
      updateData({
        variables: {
          id: selectedPublisher.id,
          data: formData
        }
      })
    } else {
      addNew({
        variables: {
          data: formData
        }
      })
    }
  };

  const editPublisher = ({ id }) => {
    fetchOne({
      variables: {
        id: id
      }
    })
    toggleModal();
  };


  const deletePublisher = ({ id }) => {
    ConfirmAlert({ title: "Delete publisher!" }).then((res) => {
      if (res.isConfirmed) {
        deleteData({
          variables: {
            id: id
          }
        })
      } else if (res.isDismissed) {
        AlertWarning({ title: "Cancelled", text: "Request cancelled, publisher not deleted" })
      }
    });
  };

  let dropMenuOptions = [{ "title": "Edit", action: editPublisher, icon: <Edit fontSize="small" /> }, { "title": "Delete", action: deletePublisher, icon: <Delete fontSize="small" color="red" /> }]

  const cols = [
    { name: "Name", selector: (row) => row.name, sortable: true },
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

  if (loading) {
    return <CustomLoader />
  }

  if (error) {
    return <PageErrorAlert message={error.message} />
  }

  return (
    <>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'end' }}>
        <Button color="secondary" variant="contained" onClick={onNewPublisher}>
          <Add /> Add New Publisher
        </Button>
      </Box>

      <DataTable
        title=" Publishers"
        progressPending={loading}
        defaultSortFieldId={1}
        columns={cols}
        onRowClicked={editPublisher}
        data={data.publishers.map((row) => {
          return {
            id: row.id,
            name: row.name,
            action: <DropdownMenu options={dropMenuOptions} row={row} />
          };
        })}
      />

      <Modal isOpen={modal}>
        {loadingSelected ?
          <ModalBody>
            <CustomLoader />
          </ModalBody>
          :
          <form onSubmit={submitForm} method="post">
            <ModalHeader toggle={toggleModal}>
              {selectedPublisher ? "Edit publisher details" : "Create a new publisher"}
            </ModalHeader>
            <ModalBody>
              <Box className="row px-3">
                <Box className="mt-3">
                  <TextField
                    label="Publisher name"
                    color="secondary"
                    required
                    fullWidth
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </Box>
              </Box>
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
        }

      </Modal>
    </>
  );
}
