import {
  gql, useQuery
} from "@apollo/client";
import { Add, AddPhotoAlternate, Adjust, Apartment, Close, Event, Wc } from "@mui/icons-material";
import { Alert, Avatar, Button, Card, Divider, Stack, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { useHistory, useParams } from "react-router-dom";
import { CustomLoader } from "../customs/monitors";
import { DataTable } from "../customs/table";


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
  }
`

export default function StudentsLender() {
  let { uid } = useParams()
  let history = useHistory()

  const { loading, error, data } = useQuery(STUDENT_QUERY, {
    variables: { id: uid },
  })

  if (loading) return <CustomLoader />

  if (error) {
    return <Alert severity="error">Error :( {error.message} </Alert>
  }

  return <>
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
          </Box>

          <Stack sx={{ ml: 5, mt: 3 }} direction="row" spacing={3}>
            <Button variant="contained" color='secondary'>
              <Add /> <Typography sx={{ ml: 1 }}>Add Book</Typography>
            </Button>

            <Button variant="outlined" color='secondary' onClick={() => history.push("/library/issue")}>
              <Close /> <Typography sx={{ ml: 1 }}>Close</Typography>
            </Button>
          </Stack>
        </Box>
      </Box>
      <Divider />
      <DataTable
        title="Books borrowed" />
    </Card>
  </>

}