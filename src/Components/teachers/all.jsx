import { gql, useQuery, useMutation } from "@apollo/client";
import { Add, Edit, OpenInBrowser } from "@mui/icons-material";
import DeleteIcon from '@mui/icons-material/Delete';
import { Box, Button } from "@mui/material";
import { useHistory } from "react-router-dom";

import {
  AlertFailed,
  AlertSuccess,
  AlertWarning,
  ConfirmAlert
} from "../customs/alerts";
import { UserAvatar } from "../customs/avatars";
import { DropdownMenu } from "../customs/menus";
import { CustomLoader } from "../customs/monitors";
import { PageErrorAlert } from "../customs/empty-page";
import { DataTable } from "../customs/table";

const FETCH_ALL_QUERY = gql`
query{
  teachers: getTeachers{
    id
    serialNumber
    title
    fullName
    employer
    gender
    passport
  }
}`

const DELETE_MUTATION = gql`
mutation deleteTeacher($id: ID!){
  deleteTeacher(id: $id)
}`

const AllTeacher = () => {
  const history = useHistory()

  const { data, loading, error, refetch } = useQuery(FETCH_ALL_QUERY, {
    fetchPolicy: 'network-only'
  })

  const [deleteData] = useMutation(DELETE_MUTATION, {
    onCompleted: () => {
      AlertSuccess({ text: `Teacher deleted successfully` });
      refetch()
    },
    onError: (err) => {
      AlertFailed({ text: err.message });
    }
  })

  const deleteTeacher = (teacher) => {
    ConfirmAlert({ title: "Delete teacher!" }).then((res) => {
      if (res.isConfirmed) {
        deleteData({
          variables: {
            id: teacher.id
          }
        })
      } else if (res.isDismissed) {
        AlertWarning({ title: "Cancelled", text: "Request cancelled, teacher not deleted" })
      }
    });
  };

  const openProfile = (row) => {
    history.push(`/teachers/profile/${row.id}`)
  }

  const editDetails = (row) => {
    history.push(`/teachers/profile/${row.id}/edit`)
  }

  const onNewTeacher = () => {
    history.push("/teachers/new")
  }

  let dropMenuOptions = [
    { "title": "Open", action: openProfile, icon: <OpenInBrowser fontSize="small" color="secondary" /> },
    { "title": "Edit", action: editDetails, icon: <Edit fontSize="small" color="success" /> },
    { "title": "Delete", action: deleteTeacher, icon: <DeleteIcon fontSize="small" color="error" /> }
  ]

  const cols = [
    { name: "", selector: row => row.photo, width: '70px' },
    { name: "#", selector: row => row.serialNumber, sortable: true, width: '80px' },
    { name: "Name", selector: row => row.name, sortable: true },
    { name: "Employer", selector: row => row.employer, sortable: true },
    { name: "Gender", selector: row => row.gender, sortable: true, width: '150px' },
    {
      selector: row => row.action,
      style: {
        color: "grey"
      },
      allowOverflow: true,
      button: true,
      width: '56px',
    },
  ];

  if (loading) {
    return <CustomLoader />
  }

  if (error) {
    return <PageErrorAlert message={error.message} />
  }

  return (
    <>
      <Box sx={{ my: 3, display: 'flex', justifyContent: 'end' }}>
        <Button color="secondary" variant="contained" className="no-transform" onClick={onNewTeacher}>
          <Add /> Add New Teacher
        </Button>
      </Box>
      <DataTable
        defaultSortFieldId={2}
        progressPending={loading}
        onRowClicked={openProfile}
        columns={cols}
        data={data.teachers.map((d) => {
          return {
            id: d.id,
            photo: <UserAvatar src={d.passport} alt={d.title} />,
            serialNumber: d.serialNumber,
            name: `${d.title} ${d.fullName}`,
            employer: d.employer,
            gender: d.gender,
            action: <DropdownMenu options={dropMenuOptions} row={d} />
          };
        })}
      />
    </>
  );
};

export default AllTeacher;
