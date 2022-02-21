import { gql, useQuery } from '@apollo/client';
import { Add, Delete, Edit, Save } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import { Box, Button, TextField } from '@mui/material';
import { useState } from 'react';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import { Service } from '../../API/service';
import { AlertFailed, AlertSuccess, AlertWarning, ConfirmAlert } from '../customs/alerts';
import { PageErrorAlert } from '../customs/empty-page';
import { DropdownMenu } from '../customs/menus';
import { CustomLoader } from '../customs/monitors';
import { DataTable } from '../customs/table';

const initialFormData = {
  name: ""
}

const QUERY = gql`query{
  publishers: getPublishers{
    id
    name
  }
}`

export default function Publishers() {
  const [modal, setModal] = useState(false);
  const { loading, error, data, refetch } = useQuery(QUERY)

  const [saving, setSaving] = useState(false);
  const [loadingSelected, setLoadingSelected] = useState(false)
  const [selectedPublisherID, setSelectedPublisherID] = useState(null);


  const [formData, setFormData] = useState(initialFormData)

  const toggleModal = () => setModal(!modal)



  const onNewPublisher = () => {
    toggleModal();
    setSelectedPublisherID(null);
    setFormData(initialFormData)
  };

  const submitForm = (e) => {
    e.preventDefault();
    setSaving(true)
    let query = selectedPublisherID
      ? {
        query: `mutation ($id: ID!, $data: NewPublisher!){
        updatePublisher(id: $id, input: $data)
     }`,
        variables: {
          id: selectedPublisherID,
          data: formData
        }
      } :
      {
        query: `mutation ($data: NewPublisher!){
        createPublisher(input: $data)
      }`,
        variables: {
          data: formData
        }
      }

    new Service().createOrUpdate(query).then((res) => {
      if (res.status === 200) {
        AlertSuccess({ text: `Publisher saved successfully` });
        toggleModal();
        refetch();
      } else {
        AlertFailed({ text: res.message });
      }
    }).finally(() => {
      setSaving(false)
    });
  };

  const editPublisher = row => {
    setSelectedPublisherID(row.id);
    setLoadingSelected(true)
    let query = {
      query: `query ($id: ID!){
        publisher: getPublisher(id: $id){
          id
          name
        }
      }`,
      variables: {
        id: row.id
      }
    }

    new Service().getData(query).then(res => {
      if (res) {
        let data = res.publisher
        setFormData({
          name: data.name
        })
      }
    }).finally(() => {
      setLoadingSelected(false)
    });
    toggleModal();
  };

  const deletePublisher = row => {
    ConfirmAlert({ title: "Delete publisher!" }).then((res) => {
      if (res.isConfirmed) {
        let query = {
          query: `mutation ($id: ID!){
            deletePublisher(id: $id)
          }`,
          variables: {
            id: row.id
          }
        }
        new Service().delete(query)
          .then((res) => {
            if (res.status === 200) {
              AlertSuccess({ text: `Publisher deleted successfully` });
              refetch();
            } else {
              AlertFailed({ text: res.message });
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
        title="Book Publishers"
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
              <span>
                <i className={`fa fa-${selectedPublisherID ? "edit" : "plus-circle"}`}></i> {selectedPublisherID ? "Edit publisher details" : "Create a new publisher"}
              </span>
            </ModalHeader>
            <ModalBody>
              <div className="row px-3">
                <div className="mt-3">
                  <TextField
                    label="Publisher name"
                    color="secondary"
                    required
                    fullWidth
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
