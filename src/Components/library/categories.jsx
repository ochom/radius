import { Add, Delete, Edit, Save } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import { Button, Container, TextField } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import { Service } from '../../API/service';
import { AlertFailed, AlertSuccess, AlertWarning, ConfirmAlert } from '../customs/alerts';
import { DropdownMenu } from '../customs/menus';
import { CustomLoader } from '../customs/monitors';
import { DataTable } from '../customs/table';

const initialFormData = {
  name: "",
  description: "",
}

export default function Categories() {
  const [modal, setModal] = useState(false);
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false);
  const [totalRows, setTotalRows] = useState(0);
  const [loadingSelected, setLoadingSelected] = useState(false)
  const [selectedCategoryID, setSelectedCategoryID] = useState(null);


  const [bookCategories, setCategories] = useState([]);
  const [formData, setFormData] = useState(initialFormData)

  const toggleModal = () => setModal(!modal)

  useEffect(() => {
    setLoading(true)
    let query = {
      query: `query{
        bookCategories: getBookCategories{
          id
          name
          description
        }
      }`,
      variables: {}
    }
    new Service().getData(query).then((res) => {
      setCategories(res?.bookCategories || [])
      setLoading(false)
    });
  }, [totalRows]);


  const onNewCategory = () => {
    toggleModal();
    setSelectedCategoryID(null);
    setFormData(initialFormData)
  };

  const submitForm = (e) => {
    e.preventDefault();
    setSaving(true)
    let query = selectedCategoryID
      ? {
        query: `mutation ($id: ID!, $data: NewBookCategory!){
        updateBookCategory(id: $id, input: $data)
     }`,
        variables: {
          id: selectedCategoryID,
          data: formData
        }
      } :
      {
        query: `mutation ($data: NewBookCategory!){
        createBookCategory(input: $data)
      }`,
        variables: {
          data: formData
        }
      }

    new Service().createOrUpdate(query).then((res) => {
      if (res.status === 200) {
        AlertSuccess({ text: `Category saved successfully` });
        toggleModal();
        setTotalRows(totalRows + 1)
      } else {
        AlertFailed({ text: res.message });
      }
    }).finally(() => {
      setSaving(false)
    });
  };

  const editCategory = row => {
    setSelectedCategoryID(row.id);
    setLoadingSelected(true)
    let query = {
      query: `query ($id: ID!){
        category: getBookCategory(id: $id){
          id
          name
          description
        }
      }`,
      variables: {
        id: row.id
      }
    }

    new Service().getData(query).then(res => {
      if (res) {
        let data = res.category
        setFormData({
          name: data.name,
          description: data.description
        })
      }
    }).finally(() => {
      setLoadingSelected(false)
    });
    toggleModal();
  };

  const deleteCategory = row => {
    ConfirmAlert({ title: "Delete category!" }).then((res) => {
      if (res.isConfirmed) {
        let query = {
          query: `mutation ($id: ID!){
            deleteBookCategory(id: $id)
          }`,
          variables: {
            id: row.id
          }
        }
        new Service().delete(query)
          .then((res) => {
            if (res.status === 200) {
              AlertSuccess({ text: `Category deleted successfully` });
              setTotalRows(totalRows - 1)
            } else {
              AlertFailed({ text: res.message });
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

  return (
    <>
      <Container>
        <div className="mb-3 justify-content-end d-flex">
          <Button color="secondary" variant="contained" onClick={onNewCategory}>
            <Add /> Add New Category
          </Button>
        </div>

        <DataTable
          title="Book Categories"
          progressPending={loading}
          defaultSortFieldId={1}
          columns={cols}
          onRowClicked={editCategory}
          data={bookCategories.map((row) => {
            return {
              id: row.id,
              name: row.name,
              description: row.description,
              action: <DropdownMenu options={dropMenuOptions} row={row} />
            };
          })}
        />
      </Container>

      <Modal isOpen={modal}>
        {loadingSelected ?
          <ModalBody>
            <CustomLoader />
          </ModalBody>
          :
          <form onSubmit={submitForm} method="post">
            <ModalHeader toggle={toggleModal}>
              <span>
                <i className={`fa fa-${selectedCategoryID ? "edit" : "plus-circle"}`}></i> {selectedCategoryID ? "Edit category details" : "Create a new category"}
              </span>
            </ModalHeader>
            <ModalBody>
              <div className="row px-3">
                <div className="mt-3">
                  <TextField
                    label="Category name"
                    color="secondary"
                    required
                    fullWidth
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div className="mt-3">
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
        }

      </Modal>
    </>
  );
}
