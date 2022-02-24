import { gql, useQuery, useLazyQuery, useMutation } from '@apollo/client';
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
  categories: getBookCategories{
    id
    name
    description
  }
}`

const FETCH_ONE_QUERY = gql`
query ($id: ID!){
  category: getBookCategory(id: $id){
    id
    name
    description
  }
}`

const CREATE_MUTATION = gql`
mutation ($data: NewBookCategory!){
  createBookCategory(input: $data)
}`
const UPDATE_MUTATION = gql`
mutation ($id: ID!, $data: NewBookCategory!){
  updateBookCategory(id: $id, input: $data)
}`
const DELETE_MUTATION = gql`
mutation ($id: ID!){
  deleteBookCategory(id: $id)
}`
const initialFormData = {
  name: "",
  description: "",
}

export default function Categories() {
  const [modal, setModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [formData, setFormData] = useState(initialFormData)

  const { loading, error, data, refetch } = useQuery(FETCH_ALL_QUERY)

  const [fetchOne, { loading: loadingSelected, error: selectedError }] = useLazyQuery(FETCH_ONE_QUERY, {
    onCompleted: (res) => {
      if (res.category) {
        let category = res.category
        setSelectedCategory(category)
        setFormData({
          name: category.name,
          description: category.description
        })
      }
    }
  })

  const [addNew, { loading: creating, reset: resetCreating }] = useMutation(CREATE_MUTATION, {
    onCompleted: () => {
      AlertSuccess({ text: `Category saved successfully` });
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
      AlertSuccess({ text: `Category updated successfully` });
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
      AlertSuccess({ text: `Category deleted successfully` });
      refetch()
    },
    onError: (err) => {
      AlertFailed({ text: err.message });
    }
  })

  const toggleModal = () => setModal(!modal)

  const onNewCategory = () => {
    setSelectedCategory(null);
    setFormData(initialFormData)
    toggleModal();
  };

  const submitForm = (e) => {
    e.preventDefault();
    if (selectedCategory) {
      updateData({
        variables: {
          id: selectedCategory.id,
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

  const editCategory = ({ id }) => {
    fetchOne({
      variables: {
        id: id
      }
    })
    toggleModal();
  };

  const deleteCategory = ({ id }) => {
    ConfirmAlert({ title: "Delete category!" }).then((res) => {
      if (res.isConfirmed) {
        deleteData({
          variables: {
            id: id
          }
        })
      } else if (res.isDismissed) {
        AlertWarning({ title: "Cancelled", text: "Request cancelled, category not deleted" })
      }
    });
  };

  let dropMenuOptions = [{ "title": "Edit", action: editCategory, icon: <Edit fontSize="small" /> }, { "title": "Delete", action: deleteCategory, icon: <Delete fontSize="small" color="red" /> }]

  const cols = [
    { name: "Name", selector: (row) => row.name, sortable: true },
    { name: "Description", selector: (row) => row.description, sortable: true },
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
        <Button color="secondary" variant="contained" onClick={onNewCategory}>
          <Add /> Add New Category
        </Button>
      </Box>

      <DataTable
        title="Book Categories"
        progressPending={loading}
        defaultSortFieldId={1}
        columns={cols}
        onRowClicked={editCategory}
        data={data.categories.map((row) => {
          return {
            id: row.id,
            name: row.name,
            description: row.description,
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
              {selectedCategory ? "Edit category details" : "Create a new category"}
            </ModalHeader>
            <ModalBody>
              <Box className="row px-3">
                <Box className="mt-3">
                  <TextField
                    label="Category name"
                    color="secondary"
                    required
                    fullWidth
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </Box>
                <Box className="mt-3">
                  <TextField
                    label="Description"
                    color="secondary"
                    placeholder="(optional)"
                    multiline
                    rows={4}
                    fullWidth
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </Box>
              </Box>
            </ModalBody>
            <ModalFooter>
              <Stack direction='row' spacing={3} justifyContent='left'>
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
