import {
  gql, useQuery
} from "@apollo/client";
import { AddPhotoAlternate, Adjust, Apartment, Assignment, Close, Event, Wc } from "@mui/icons-material";
import { Avatar, Button, Card, Chip, Divider, Rating, Stack, Typography } from "@mui/material";
import { Box } from "@mui/system";
import moment from "moment";
import { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { PageErrorAlert } from "../customs/errors";
import { CustomLoader } from "../customs/monitors";
import { DataTable } from "../customs/table";
import LendingModal, { LEND_TO } from "./modals/lending_modal";
import ReturningModal from "./modals/return_modal";


const STUDENT_QUERY = gql`
  query ($id: ID!){
    student: getStudent(id: $id){
      id
      fullName
      passport
      gender
      age
      active
      classroom{
        id
        level
        stream
      }
    }
    books: getStudentBorrowedBooks(studentID: $id){
      id
      bookNumber
      createdAt
      returned
      dueDate
      status
      book{
        id
        title
        cover
      }
    }
  }
`

export default function StudentsLender() {
  let { uid } = useParams()
  let history = useHistory()

  const [returnIndex, setReturnIndex] = useState(0.0)
  const [selectedRow, setSelectedRow] = useState(null)
  const [returnModal, setReturnModal] = useState(null)

  const { loading, error, data, refetch } = useQuery(STUDENT_QUERY, {
    variables: { id: uid },
  })

  useEffect(() => {
    if (!error && !loading) {
      let returned = data.books.filter(b => b.status === 'returned').length
      let borrowed = data.books.length
      if (returned) {
        setReturnIndex((returned * 5.0 / borrowed).toFixed(1))
      }
    }
  }, [error, loading, data])

  const cols = [
    { name: "", selector: (row) => row.cover, width: '76px' },
    { name: "Title", selector: (row) => row.title },
    { name: "Number", selector: (row) => row.bookNumber },
    { name: "Borrowed", selector: (row) => row.createdAt },
    { name: "Returned", selector: (row) => row.returned },
    { name: "Status", selector: (row) => row.status, width: '120px' },
  ]

  const toggleReturnModal = () => setReturnModal(!returnBook)

  const returnBook = ({ id, title, bookNumber }) => {
    setSelectedRow({ id, title, bookNumber })
    setReturnModal(true)
  }

  if (loading) return <CustomLoader />

  if (error) {
    return <PageErrorAlert message={error.message} />
  }

  return <>
    {selectedRow && <ReturningModal book={selectedRow} modal={returnModal} toggleModal={toggleReturnModal} refetch={refetch} />}
    <Card>
      <Box sx={{ p: 3, display: 'flex' }} >
        <Stack>
          <Avatar variant="rounded" src={data.student.passport} alt={data.student.fullName} sx={{ width: "10rem", height: "10rem", mb: 1, cursor: 'pointer' }}>
            <AddPhotoAlternate sx={{ fontSize: "8rem" }} />
          </Avatar>
        </Stack>
        <Box >
          <Box sx={{ display: 'flex' }}>
            <Stack spacing={1.5} sx={{ ml: 5, alignItems: "start" }}>
              <Typography fontWeight={700}>{data.student.fullName}</Typography>
              <Typography variant="body2" color="text.secondary">
                <Apartment sx={{ fontSize: "1.2rem" }} color="secondary" /> {data.student.classroom.level} {data.student.classroom.stream}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <Wc sx={{ fontSize: "1.2rem" }} color="secondary" />  {data.student.gender}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <Event sx={{ fontSize: "1.2rem" }} color="secondary" />  {data.student.age} yrs old
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <Adjust sx={{ fontSize: "1.2rem" }} color={data.student.active ? "success" : "disabled"} />  {data.student.active ? "Active" : "Not active"}
              </Typography>
            </Stack>

            <Stack spacing={1.5} sx={{ ml: 5, alignItems: "start" }}>
              <Stack direction="column">
                <Typography variant="body2" color="text.secondary">Library Rating</Typography>
                <Typography variant='h4'>{returnIndex}</Typography>
                <Rating precision={0.5} max={5} value={returnIndex} />
              </Stack>
            </Stack>
          </Box>

          <Stack sx={{ ml: 5, mt: 3 }} direction="row" spacing={3}>
            <LendingModal
              id={uid}
              refetch={refetch}
              lendTo={LEND_TO.STUDENT} />

            <Button variant="outlined" color='secondary' onClick={() => history.push("/library/issue")}>
              <Close /> <Typography sx={{ ml: 1 }}>Close</Typography>
            </Button>
          </Stack>
        </Box>
      </Box>
      <Divider />
      <DataTable
        columns={cols}
        onRowClicked={returnBook}
        data={data.books.map(row => ({
          id: row.id,
          cover: <Avatar src={row.book.cover} variant='rounded'><Assignment /> </Avatar>,
          title: row.book.title,
          bookNumber: row.bookNumber,
          createdAt: moment(row.createdAt).format("DD/MM/yyyy"),
          returned: row.dueDate < new Date() ? <Chip label={row.returned ? moment(row.returned).format("DD/MM/yyyy") : "overdue"} color='error' variant="outlined" /> :
            <Chip variant="outlined" color='success' label={row.returned ? moment(row.returned).format("DD/MM/yyyy") : "reading"} />,
          status: <Chip color={row.status === 'returned' ? 'secondary' : 'default'} label={row.status} />,
        }))} />
    </Card>
  </>

}