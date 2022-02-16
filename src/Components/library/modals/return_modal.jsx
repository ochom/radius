import { gql, useMutation } from "@apollo/client";
import { Assignment } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import { Avatar, Button, Divider, Grid, Stack, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { Modal, ModalBody, ModalHeader } from "reactstrap";
import { AlertFailed, AlertSuccess, AlertWarning } from "../../customs/alerts";



const RETURN_MUTATION = gql`
  mutation($id:ID!){
    returnBook(borrowID: $id)
  }
`

export default function ReturningModal({ book, modal, toggleModal, refetch }) {
  const [bookNumber, setBookNumber] = useState("")

  const [returnBook, { loading, reset }] = useMutation(RETURN_MUTATION, {
    onCompleted: () => {
      setBookNumber("")
      toggleModal()
      refetch()
      reset()
      AlertSuccess({ text: "Book returned successfully" })
    },
    onError: (err) => {
      reset()
      AlertFailed({ text: err.message })
    }
  })

  const cancelReturn = () => {
    setBookNumber("")
    toggleModal()
  }

  const submit = e => {
    e.preventDefault()
    if (bookNumber === book.bookNumber) {
      returnBook({
        variables: {
          id: book.id,
        }
      })
    } else {
      AlertWarning({ text: "book numbers do not match" })
    }
  }

  return (
    <>
      <Modal isOpen={modal}>
        <ModalHeader toggle={toggleModal}>Issue Book</ModalHeader>
        <ModalBody>
          <form onSubmit={submit}>
            <Grid container sx={{ p: 2 }}>
              <Grid item sm={4} sx={{ pr: 3 }}>
                <Avatar src={book.cover} sx={{ height: '100%', width: '100%' }} variant='rounded'>
                  <Assignment sx={{ width: "7rem", height: 'auto' }} />
                </Avatar>
              </Grid>
              <Grid item sm={8}>
                <Typography variant="h5">{book.title}</Typography>
                <Typography sx={{ mt: 2 }}>Type here: <b>{book.bookNumber}</b></Typography>
                <TextField
                  label="Book Number"
                  required
                  autoFocus={true}
                  color="secondary"
                  fullWidth
                  value={bookNumber}
                  onChange={(e) => setBookNumber(e.target.value)}
                  sx={{ mt: 4 }}
                />
              </Grid>
            </Grid>
            <Divider />
            <Stack direction='row' spacing={3} sx={{ display: 'flex', justifyContent: 'end', mt: 2, pr: 3 }}>
              <Button color="secondary" variant="outlined" type="button" onClick={cancelReturn}>Cancel</Button>
              <LoadingButton color="secondary" variant="contained" type="submit" loading={loading}>Return</LoadingButton>
            </Stack>
          </form>
        </ModalBody>
      </Modal>
    </>
  )
}