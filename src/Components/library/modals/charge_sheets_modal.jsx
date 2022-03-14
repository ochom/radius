import { gql, useMutation, useQuery } from "@apollo/client";
import { Assignment } from "@mui/icons-material";
import DateAdapter from '@mui/lab/AdapterMoment';
import { LoadingButton, LocalizationProvider, MobileDatePicker } from "@mui/lab";
import { Avatar, Box, Button, Divider, FormControl, Grid, InputLabel, MenuItem, Select, Stack, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { Modal, ModalBody, ModalHeader } from "reactstrap";
import { AlertFailed, AlertSuccess, AlertWarning } from "../../customs/alerts";

const studentTemplate = `Your child has overdue library books which have not been return. This makes him/her unable to check out books.
The student is required to return the books not later than {notice due} and show responsibility for returning borrowed materials in time`

const teachersTemplate = `You have overdue library books which have not been return. This makes you unable to check out books.
You are required to return the books not later than {notice due} and show responsibility for returning borrowed materials in time`

const initFormData = {
  charge: 0, // 0 is students, 1 is teachers
  subject: "RE: OVERDUE LIBRARY BOOKS",
  template: studentTemplate,
  noticeDue: new Date(),
  classroomID: ""
}

const FETCH_CLASSES_QUERY = gql`query {
  classrooms: getClassrooms{
    id
    level
    stream
  }
}`

const DOWNLOAD_MUTATION = gql`mutation($data:ChargeSheet!){
    uri: downloadChargeSheets(input: $data)
}`

export default function ChargeSheetModal({ modal, toggleModal }) {
  const [formData, setFormData] = useState(initFormData)

  const { data, loading, error } = useQuery(FETCH_CLASSES_QUERY)

  const [printChargeSheets, { loading: printing, reset }] = useMutation(DOWNLOAD_MUTATION, {
    onCompleted: (res) => {
      if (res.uri) downloadReport(res.uri)
      toggleModal()
      setFormData(initFormData)
      reset()
    },
    onError: (err) => {
      reset()
      AlertFailed({ text: err.message })
    }
  })

  const downloadReport = (uri) => {
    var link = document.createElement("a");
    link.download = formData.charge == 0 ? "Students Charge Sheet.pdf" : "Teachers Charge Sheet.pdf";
    link.href = uri;
    link.target = "_blank"
    link.click();
  }

  const cancel = () => {
    setFormData(initFormData)
    toggleModal()
  }

  const submit = e => {
    e.preventDefault()
    printChargeSheets({
      variables: {
        data: formData
      }
    })
  }

  if (loading) {
    return <span>loading...</span>
  }

  if (error) {
    return <span>{error.message}</span>
  }

  return (
    <>
      <Modal isOpen={modal}>
        <form onSubmit={submit}>
          <ModalHeader toggle={toggleModal}>Print Charge Sheets</ModalHeader>
          <ModalBody>
            <Box className="row px-3">
              <Box>
                <FormControl fullWidth>
                  <InputLabel id="charge-label">Charge</InputLabel>
                  <Select
                    labelId="charge-label"
                    id="charge"
                    label="Charge"
                    color="secondary"
                    required
                    fullWidth
                    value={formData.charge}
                    onChange={e => setFormData({ ...formData, charge: e.target.value, template: e.target.value == 0 ? studentTemplate : teachersTemplate })}
                  >
                    <MenuItem value={0}>Students</MenuItem>
                    <MenuItem value={1}>Teachers</MenuItem>
                  </Select>
                </FormControl>
              </Box>
              {(formData.charge == 0 && data.classrooms) && <Box sx={{ mt: 4 }}>
                <FormControl fullWidth>
                  <InputLabel id="classrooms-label">Classroom</InputLabel>
                  <Select
                    labelId="classrooms-label"
                    id="classrooms"
                    label="Classroom"
                    color="secondary"
                    required
                    fullWidth
                    value={formData.classroomID}
                    onChange={e => setFormData({ ...formData, classroomID: e.target.value })}
                  >{data.classrooms.map(cl => <MenuItem key={cl.id} value={cl.id}>{cl.level} {cl.stream}</MenuItem>)}
                  </Select>
                </FormControl>
              </Box>}
              <Box sx={{ mt: 4 }}>
                <LocalizationProvider dateAdapter={DateAdapter}>
                  <MobileDatePicker
                    label="Notice Due"
                    inputFormat="DD/MM/yyyy"
                    value={formData.noticeDue}
                    onChange={val => setFormData({ ...formData, noticeDue: val })}
                    renderInput={(params) => <TextField fullWidth {...params} />}
                  />
                </LocalizationProvider>
              </Box>
              <Box sx={{ mt: 4 }}>
                <TextField
                  label="Subject Line"
                  required
                  autoFocus={true}
                  color="secondary"
                  fullWidth
                  value={formData.subject}
                  onChange={e => setFormData({ ...formData, subject: e.target.value })}
                />
              </Box>
              <Box sx={{ mt: 4 }}>
                <TextField
                  label="Template"
                  required
                  autoFocus={true}
                  color="secondary"
                  fullWidth
                  multiline
                  rows={5}
                  value={formData.template}
                  onChange={e => setFormData({ ...formData, template: e.target.value })}
                />
              </Box>
            </Box>
            <Divider sx={{ my: 2 }} />
            <Stack direction='row' spacing={3} sx={{ display: 'flex', justifyContent: 'end', mt: 2, pr: 3 }}>
              <Button color="secondary" variant="outlined" type="button" onClick={cancel}>Cancel</Button>
              <LoadingButton color="secondary" variant="contained" type="submit" loading={printing}>Print</LoadingButton>
            </Stack>
          </ModalBody>
        </form>
      </Modal>
    </>
  )
}