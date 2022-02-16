import {
  gql, useQuery
} from "@apollo/client";
import { AddPhotoAlternate, Assignment, Close, Event, Wc, Numbers } from "@mui/icons-material";
import { Avatar, Button, Card, Divider, Stack, Typography } from "@mui/material";
import { Box } from "@mui/system";
import moment from "moment";
import { useHistory, useParams } from "react-router-dom";
import { PageErrorAlert } from "../customs/errors";
import { CustomLoader } from "../customs/monitors";
import { DataTable } from "../customs/table";
import LendingModal, { LEND_TO } from "./modals/lending_modal";


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


  const { loading, error, data, refetch } = useQuery(TEACHER_QUERY, {
    variables: { id: uid },
  })

  const cols = [
    { name: "", selector: (row) => row.cover, width: '76px' },
    { name: "Title", selector: (row) => row.title },
    { name: "Number", selector: (row) => row.bookNumber },
    { name: "Status", selector: (row) => row.status },
    { name: "Borrowed", selector: (row) => row.createdAt },
  ]

  if (loading) return <CustomLoader />

  if (error) {
    return <PageErrorAlert message={error.message} />
  }

  return <>
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
              <Typography fontWeight={700}>
                {data.teacher.fullName}
                <Typography variant="body2" color="text.secondary">
                  {data.teacher.email}
                </Typography>
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
        data={data.books.map(row => ({
          cover: <Avatar src={row.book.cover} variant='rounded'><Assignment /> </Avatar>,
          title: row.book.title,
          bookNumber: row.bookNumber,
          status: row.status,
          createdAt: moment(row.createdAt).format("DD/MM/yyyy hh:mm a"),
        }))} />
    </Card>
  </>

}