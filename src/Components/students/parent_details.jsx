import { gql, useQuery } from "@apollo/client";
import { AssignmentInd, Phone, Wc, Work } from "@mui/icons-material";
import { Avatar, Box, Button, Card, Divider, Stack, Typography } from "@mui/material";
import { useHistory, useParams } from "react-router-dom";
import { PageErrorAlert } from "../customs/empty-page";
import { CustomLoader } from "../customs/monitors";
import { DataTable } from "../customs/table";

const FETCH_ONE_QUERY = gql`
query ($id: ID!){
  parent: getParentByID(id: $id) {
    id
    fullName
    gender
    idNumber
    mobile
    email
    occupation
    children{
      id
      fullName
      relationship
      admissionNumber
      classroom
    }
  }
}`

export default function ParentDetails() {
  const history = useHistory()
  const { uid } = useParams()

  const { data, loading, error } = useQuery(FETCH_ONE_QUERY, {
    fetchPolicy: 'network-only',
    variables: {
      id: uid
    }
  })

  const openProfile = row => {
    history.push(`/students/profile/${row.id}`)
  }

  const cols = [
    {
      name: "#REG", selector: (row) => row.reg,
    },
    {
      name: "Name", selector: (row) => row.fullName,
    },
    {
      name: "Relationship", selector: (row) => row.relationship,
    },
    {
      name: "Class", selector: (row) => row.classroom,
    },
  ]

  if (loading) {
    return <CustomLoader />
  }

  if (error) {
    return <PageErrorAlert message={error.message} />
  }

  return (
    <>
      <Box sx={{ my: 3, display: 'flex', justifyContent: 'end' }}>
        <Button color="secondary" variant="contained" className="no-transform" onClick={() => history.push("/students/parents")}>
          <Typography><i className="fa fa-search"></i>  Find another parent</Typography>
        </Button>
      </Box>
      <Card>
        <Box sx={{ p: 3, display: 'flex' }} >
          <Avatar variant="rounded" sx={{ width: "10rem", height: "10rem" }} />
          <Box sx={{ display: 'flex' }}>
            <Stack spacing={1.5} sx={{ ml: 5, alignItems: "start" }}>
              <Typography fontWeight={700} variant='h6'>{data.parent.fullName}
                <Typography fontWeight={300} sx={{ fontSize: ".8rem" }} color="text.secondary">{data.parent.email}</Typography>
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <Wc sx={{ fontSize: "1.2rem" }} color="secondary" />  {data.parent.gender}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <Phone sx={{ fontSize: "1.2rem" }} color="secondary" />  {data.parent.mobile}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <AssignmentInd sx={{ fontSize: "1.2rem" }} color="secondary" />  {data.parent.idNumber}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <Work sx={{ fontSize: "1.2rem" }} color="secondary" />  {data.parent.occupation}
              </Typography>
            </Stack>
          </Box>
        </Box>
        <Divider />
        <Box sx={{ pb: 5 }}>
          <DataTable
            title="Children"
            columns={cols}
            onRowClicked={openProfile}
            paginationPerPage={3}
            paginationRowsPerPageOptions={[3, 5]}
            data={
              (data.parent?.children || []).map(child => {
                return {
                  id: child.id,
                  reg: child.admissionNumber,
                  fullName: child.fullName,
                  relationship: child.relationship,
                  classroom: child.classroom
                };
              })}
          />
        </Box>
      </Card>
    </>
  );
};
