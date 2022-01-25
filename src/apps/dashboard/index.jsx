import { Card, Container, Grid, Stack } from "@mui/material";
import { Box } from "@mui/system";
import { useEffect, useState } from "react";
import { Service } from "../../API/service";
import { PageBody } from "../../components"

function Dashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    let query = {
      query: `query {
        data: loadDashboard{
          totalTeachers
          totalStudents
          totalSessions
          totalClassrooms
          recentStudents{
            id
            fullName
          }
		      topTeachers{
            id
            title
            fullName
          }
        }
      }`,
      variables: {}
    }

    new Service().getData(query).then((res) => {
      setData(res?.data || null)
    });

  }, [])

  return (
    <PageBody>
      <Container>
        {!data && <p>loading</p>}
        {data &&
          <Box>
            <Grid container spacing={3}>
              <Grid item md={4}>
                <Card sx={{ p: 4 }}>Teachers {data.totalTeachers}</Card>
              </Grid>
              <Grid item md={4} sx={{ p: 4 }}>
                <Card sx={{ p: 4 }}>Students {data.totalStudents}</Card>
              </Grid>
              <Grid item md={4} sx={{ p: 4 }}>
                <Card sx={{ p: 4 }}>Sessions {data.totalSessions}</Card>
              </Grid>
              <Grid item md={4} sx={{ p: 4 }}>
                <Card sx={{ p: 4 }}>Classrooms {data.totalClassrooms}</Card>
              </Grid>
            </Grid>

            Top teachers
            <Stack direction="row" spacing={5} className='mb-5'>
              {data.topTeachers.map(t => <Card sx={{ px: 4, py: 6, minWidth: '250px' }} key={t.id}>{t.title} {t.fullName}</Card>)}
            </Stack>

            Recent Students
            <Stack direction="row" spacing={5}>
              {data.recentStudents.map(t => <Card sx={{ px: 4, py: 6 }} key={t.id}>{t.id} {t.fullName}</Card>)}
            </Stack>

          </Box>
        }
      </Container>
    </PageBody>
  )
}

export default Dashboard