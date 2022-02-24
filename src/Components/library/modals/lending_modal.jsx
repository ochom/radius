import { gql, useLazyQuery, useMutation } from "@apollo/client";
import { Add, Assignment } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import { Alert, Avatar, Button, Divider, Grid, Stack, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { Modal, ModalBody, ModalHeader } from "reactstrap";
import { AlertFailed, AlertSuccess } from "../../customs/alerts";
import { CustomLoader } from "../../customs/monitors";

export const LEND_TO = {
  TEACHER: "TEACHER",
  STUDENT: "STUDENT"
}

const BOOK_QUERY = gql`
query ($data:String!){
  book: getBookByISBN(isbn: $data){
    id
    isbn
    title
    cover
  }
}`

const LEND_STUDENT_MUTATION = gql`
  mutation($data:LendStudent!){
    lendToStudent(input: $data)
  }`

const LEND_TEACHER_MUTATION = gql`
  mutation($data:LendTeacher!){
    lendToTeacher(input: $data)
  }`

export default function LendingModal({ lendTo, id, refetch }) {
  const [bookNumber, setBookNumber] = useState("")
  const [isbn, setISBN] = useState("")
  const [searchedISBN, setSearchedISBN] = useState("")
  const [book, setBook] = useState(null)
  const [modal, setModal] = useState(false)
  const toggleModal = () => setModal(!modal)

  const newLending = () => {
    setISBN("")
    setBookNumber("")
    setSearchedISBN("")
    setBook(null)
    toggleModal()
  }

  const [getBook, { loading, error }] = useLazyQuery(BOOK_QUERY, {
    onCompleted: (data) => {
      if (data.book) {
        setBook(data.book)
      }
    },
  })

  const [lendStudent, { loading: lendingStudent, reset: resetLendingStudent }] = useMutation(LEND_STUDENT_MUTATION, {
    onCompleted: () => {
      toggleModal()
      refetch()
      resetLendingStudent()
      AlertSuccess({ text: "Book lent to student successfully" })
    },
    onError: (err) => {
      AlertFailed({ text: err.message })
      resetLendingStudent()
    }
  })

  const [lendTeacher, { loading: lendingTeacher, reset: resetLendingTeacher }] = useMutation(LEND_TEACHER_MUTATION, {
    onCompleted: () => {
      toggleModal()
      refetch()
      resetLendingTeacher()
      AlertSuccess({ text: "Book lent successfully" })
    },
    onError: (err) => {
      AlertFailed({ text: err.message })
      resetLendingTeacher()
    }
  })


  const lendToStudent = () => {
    lendStudent({
      variables: {
        data: {
          studentID: id,
          bookID: book.id,
          bookNumber
        }
      }
    })
  }


  const lendToTeacher = () => {
    lendTeacher({
      variables: {
        data: {
          teacherID: id,
          bookID: book.id,
          bookNumber
        }
      }
    })
  }

  const searchBook = (e) => {
    e.preventDefault()

    // prevent searching if isbn has not changed
    if (isbn !== searchedISBN) {
      getBook({
        variables: {
          data: isbn
        }
      })
      setSearchedISBN(isbn)
    }
  }

  const submit = e => {
    e.preventDefault()
    if (lendTo === LEND_TO.TEACHER) {
      lendToTeacher()
    } else {
      lendToStudent()
    }
  }

  return (
    <>
      <Button variant="contained" color='secondary' onClick={newLending}>
        <Add /> <Typography sx={{ ml: 1 }}>Add Book</Typography>
      </Button>

      <Modal isOpen={modal}>
        {(!book && loading) ?
          <CustomLoader /> :
          (!book || error) ?
            <form onSubmit={searchBook}>
              <ModalHeader toggle={toggleModal}>Find Book</ModalHeader>
              <ModalBody>
                <TextField
                  label="Enter Book ISBN"
                  required
                  autoFocus={true}
                  color="secondary"
                  fullWidth
                  value={isbn}
                  onChange={(e) => setISBN(e.target.value)}
                />
                {error && <Alert severity="error" sx={{ my: 2 }}>{error.message}</Alert>}
                <Divider sx={{ mt: 3 }} />
                <Stack direction='row' spacing={3} sx={{ display: 'flex', justifyContent: 'end', mt: 2, pr: 3 }}>
                  <Button color="secondary" variant="outlined" type="button" onClick={toggleModal}>Cancel</Button>
                  <LoadingButton color="secondary" variant="contained" type="submit"
                    loading={loading}>Continue</LoadingButton>
                </Stack>
              </ModalBody>
            </form>
            : book &&
            <>
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
                      <Typography variant="h6" color='gray'>code: {book.isbn}</Typography>
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
                    <Button color="secondary" variant="outlined" type="button" onClick={toggleModal}>Cancel</Button>
                    <LoadingButton color="secondary" variant="contained" type="submit" loading={lendingStudent || lendingTeacher}>Save</LoadingButton>
                  </Stack>
                </form>
              </ModalBody>
            </>
        }
      </Modal>
    </>
  )
}