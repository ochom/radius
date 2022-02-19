import {
  gql, useQuery
} from "@apollo/client";
import { AddPhotoAlternate, Assignment, Close, Event, Wc, Numbers } from "@mui/icons-material";
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


const TEACHER_QUERY = gql`
  query ($id: ID!){
    teacher: getTeacher(id: $id){
      id
      email
      fullName
      idNumber
      passport
      gender
      age
    }
    books: getTeacherBorrowedBooks(teacherID: $id){
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

  const [returnIndex, setReturnIndex] = useState(0)
  const [selectedRow, setSelectedRow] = useState(null)
  const [returnModal, setReturnModal] = useState(null)

  const { loading, error, data, refetch } = useQuery(TEACHER_QUERY, {
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
          <Avatar variant="rounded" src={data.teacher.passport} alt={data.teacher.fullName} sx={{ width: "10rem", height: "10rem", mb: 1, cursor: 'pointer' }}>
            <AddPhotoAlternate sx={{ fontSize: "8rem" }} />
          </Avatar>
        </Stack>
        <Box >
          <Box sx={{ display: 'flex' }}>
            <Stack spacing={1.5} sx={{ ml: 5, alignItems: "start" }}>
              <Typography fontWeight={700}>{data.teacher.fullName}</Typography>
              <Typography variant="body2" color="text.secondary">
                {data.teacher.email}
              </Typography>

              <Typography variant="body2" color="text.secondary">
                <Wc sx={{ fontSize: "1.2rem" }} color="secondary" />  {data.teacher.gender}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <Event sx={{ fontSize: "1.2rem" }} color="secondary" />  {data.teacher.age} yrs old
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <Numbers sx={{ fontSize: "1.2rem" }} /> {data.teacher.idNumber}
              </Typography>
            </Stack>
            <Stack spacing={1.5} sx={{ ml: 5, alignItems: "start" }}>
              <Stack direction="column">
                <Typography variant="body2" color="text.secondary">Library Rating</Typography>
                <Typography variant='h4'>{returnIndex}</Typography>
                <Rating precision={0.5} max={5} value={parseFloat(returnIndex)} />
              </Stack>
            </Stack>
          </Box>

          <Stack sx={{ ml: 5, mt: 3 }} direction="row" spacing={3}>
            <LendingModal
              id={uid}
              refetch={refetch}
              lendTo={LEND_TO.TEACHER} />

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
          status: row.status === 'returned' ? <Chip color='secondary' variant='outlined' label={row.status} /> : <Chip color='default' label={row.status} />,
        }))} />
    </Card>
  </>

}