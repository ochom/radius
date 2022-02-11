import { gql, useQuery } from "@apollo/client";
import { AccessTimeOutlined, LibraryBooksOutlined, PeopleOutline, PersonOutlined } from "@mui/icons-material";
import { Alert, Avatar, Button, Card, Chip, Grid, List, ListItem, ListItemAvatar, ListItemText, Stack, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { PageBody } from "../customs";
import { UserAvatar } from "../customs/avatars";
import { CustomLoader } from "../customs/monitors";

const QUERY = gql`query {
  content: loadDashboard{
    totalTeachers
    totalStudents
    totalSessions
    totalClassrooms
    recentStudents{
      id
      fullName
      admissionNumber
      passport
      active
      classroom{
        level
        stream
      }
    }
    topTeachers{
      id
      title
      fullName
      passport
      email
    }
  }
}`


function Dashboard() {
  let history = useHistory()
  const user = useSelector(state => state.auth.user)
  const { loading, error, data } = useQuery(QUERY)

  const [hour, setHour] = useState(null);


  useEffect(() => {
    const date = new Date();
    const hours = date.getHours()
    let greetTime = "morning"
    if (hours > 12 && hours <= 17) {
      greetTime = "afternoon"
    } else if (hours > 17 && hours <= 24) {
      greetTime = "evening"
    }
    setHour(greetTime)
  }, [])

  const studentCols = [
    { name: "", selector: row => row.photo, width: '70px' },
    { name: "#REG", selector: row => row.serialNumber, sortable: true, width: '100px', },
    { name: "Name", selector: row => row.name, sortable: true },
    { name: "Level", selector: row => row.level, sortable: true },
    { name: "Status", selector: row => row.status, width: '150px' },
  ]

  const viewStudents = () => {
    history.push("/students")
  }


  if (loading) {
    return (
      <PageBody>
        <Card>
          <CustomLoader />
        </Card>
      </PageBody>
    )
  }

  if (error) {
    return (
      <PageBody>
        <Card>
          <Alert severity='error'>Oops! {error.message} </Alert>
        </Card>
      </PageBody>
    )
  }

  return (
    <PageBody>
      <Box className="dashboard">
        <Typography sx={{ my: 2, mx: 5 }}>
          Hi <b>{user.firstName}</b>, good {hour}!
        </Typography>
        <Grid container spacing={3} className="card-widgets">
          <Grid item sm={6} lg={3}>
            <Card className="card" sx={{ p: 4 }}>
              <Grid container>
                <Grid item sm={8}>
                  <Typography variant="h4" color="secondary"
                    className="count">{data.content.totalStudents}</Typography>
                  <Typography className="label">Students</Typography>
                </Grid>
                <Grid item>
                  <PeopleOutline className="icon" />
                </Grid>
              </Grid>
            </Card>
          </Grid>
          <Grid item sm={6} lg={3}>
            <Card className="card" sx={{ p: 4 }}>
              <Grid container>
                <Grid item sm={8}>
                  <Typography variant="h4" color="secondary"
                    className="count">{data.content.totalTeachers}</Typography>
                  <Typography className="label">Teachers</Typography>
                </Grid>
                <Grid item>
                  <PersonOutlined className="icon" />
                </Grid>
              </Grid>
            </Card>
          </Grid>
          <Grid item sm={6} lg={3}>
            <Card className="card" sx={{ p: 4 }}>
              <Grid container>
                <Grid item sm={8}>
                  <Typography variant="h4" color="secondary"
                    className="count">0</Typography>
                  <Typography className="label">Books</Typography>
                </Grid>
                <Grid item>
                  <LibraryBooksOutlined className="icon" />
                </Grid>
              </Grid>
            </Card>
          </Grid>
          <Grid item sm={6} lg={3}>
            <Card className="card" sx={{ p: 4 }}>
              <Grid container>
                <Grid item sm={8}>
                  <Typography variant="h4" color="secondary"
                    className="count">{data.content.totalSessions}</Typography>
                  <Typography className="label">Sessions</Typography>
                </Grid>
                <Grid item sm={4}>
                  <AccessTimeOutlined className="icon" />
                </Grid>
              </Grid>
            </Card>
          </Grid>
        </Grid>

        <Grid container sx={{ my: 3 }} spacing={3}>
          <Grid item sm={12} lg={8}>
            <Box className="recent-students">
              <Stack direction="row" justifyContent="space-between" sx={{ px: 5 }}>
                <Typography color="secondary" variant="h5" sx={{ my: 2 }}>
                  Recent Students
                </Typography>
                <Box sx={{ my: 2 }}>
                  <Button variant="contained" color="secondary"
                    onClick={viewStudents}>View All</Button>
                </Box>
              </Stack>
              <DataTable
                columns={studentCols}
                data={data.content.recentStudents.map(row => ({
                  id: row.id,
                  photo: <UserAvatar src={row.passport} alt={row.fullName} />,
                  serialNumber: row.admissionNumber,
                  name: row.fullName,
                  level: `${row.classroom.level} ${row.classroom.stream}`,
                  status: row.active ? <Chip label="Active" color="secondary" size="small" /> : <Chip label="Inactive" color="default" size="small" />
                }))} />
            </Box>
          </Grid>
          <Grid item sm={12} lg={4}>
            <Box className="top-teachers">
              <Stack>
                <Typography color="secondary" variant="h5" sx={{ mt: 2, mx: 3 }}>
                  Top Teachers
                </Typography>
                <List sx={{ width: '100%' }}>
                  {data.content.topTeachers.map(t =>
                    <ListItem key={t.id} alignItems="flex-start">
                      <ListItemAvatar>
                        <Avatar src={t.passport} alt={t.fullName} />
                      </ListItemAvatar>
                      <ListItemText primary={t.fullName} secondary={t.email} />
                    </ListItem>
                  )}
                </List>
              </Stack>
            </Box>
          </Grid>
        </Grid>
      </Box >
    </PageBody >
  )
}

export default Dashboard