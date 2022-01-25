import { Container } from "@mui/material";
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
          }
		      topTeachers{
            id
            firstName
            lastName
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
            <span>{data.totalTeachers}</span>

            <span>{data.totalStudents}</span>

            <ul>
              {data.topTeachers.map(t => <li key={t.id}>{t.lastName}</li>)}
            </ul>
          </Box>
        }
      </Container>
    </PageBody>
  )
}

export default Dashboard