import { gql, useMutation, useQuery } from "@apollo/client";
import { Edit, OpenInBrowser } from "@mui/icons-material";
import DeleteIcon from '@mui/icons-material/Delete';
import { Box, Button, Typography } from "@mui/material";
import { useState } from "react";
import { useHistory } from "react-router-dom";
import {
  AlertFailed,
  AlertSuccess,
  AlertWarning,
  ConfirmAlert
} from "../customs/alerts";
import { UserAvatar } from "../customs/avatars";
import { PageErrorAlert } from "../customs/empty-page";
import { DropdownMenu } from "../customs/menus";
import { CustomLoader } from "../customs/monitors";
import { SearchableTable } from "../customs/table";

const FETCH_ALL_QUERY = gql`
  query students{
    students: getStudents{
      id
      fullName
      admissionNumber
      gender
      passport
      classroom{
        level
        stream
      }
    }
  }`


const DELETE_MUTATION = gql`
 mutation deleteStudent($id: ID!){
    deleteStudent(id: $id)
  }`

const AllStudent = () => {
  let history = useHistory();
  const [students, setStudents] = useState([]);
  const [allStudents, setAllStudents] = useState([]);

  const { loading, error, refetch } = useQuery(FETCH_ALL_QUERY, {
    fetchPolicy: 'network-only',
    onCompleted: (res) => {
      if (res) {
        setStudents(res.students)
        setAllStudents(res.students)
      }
    },
  })

  const [deleteStudent] = useMutation(DELETE_MUTATION, {
    onError: (err) => {
      AlertFailed({ text: err.message });
    },
    onCompleted: () => {
      AlertSuccess({ text: `Student deleted successfully` });
      refetch()
    }
  })


  const handleDelete = (student) => {
    ConfirmAlert({ title: "Delete student!" }).then((res) => {
      if (res.isConfirmed) {
        deleteStudent({
          variables: {
            id: student.id
          }
        })
      } else if (res.isDismissed) {
        AlertWarning({ title: "Cancelled", text: "Request cancelled, student not deleted" })
      }
    });
  };


  const editDetails = row => {
    history.push(`/students/profile/${row.id}/edit`);
  }

  const openProfile = row => {
    history.push(`/students/profile/${row.id}`);
  }

  const onNewStudent = () => {
    history.push(`/students/new`);
  }


  let dropMenuOptions = [
    { "title": "Open", action: openProfile, icon: <OpenInBrowser fontSize="small" color="secondary" /> },
    { "title": "Edit", action: editDetails, icon: <Edit fontSize="small" color="success" /> },
    { "title": "Delete", action: handleDelete, icon: <DeleteIcon fontSize="small" color="error" /> }
  ]

  const cols = [
    { name: "", selector: row => row.photo, width: '70px' },
    { name: "#REG", selector: row => row.serialNumber, sortable: true, width: '100px', },
    { name: "Name", selector: row => row.name, sortable: true },
    { name: "Level", selector: row => row.level, sortable: true },
    { name: "Stream", selector: row => row.stream, sortable: true },
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

  const searchStudent = e => {
    var val = e.target.value.toLowerCase();
    if (val) {
      var newStudents = allStudents.filter(s => s.admissionNumber.toLowerCase().includes(val) || s.fullName.toLowerCase().includes(val));
      setStudents(newStudents)
    } else {
      setStudents(allStudents)
    }
  }

  if (loading) {
    return <CustomLoader />
  }

  if (error) {
    return <PageErrorAlert message={error.message} />
  }

  return (
    <>
      <Box sx={{ my: 3, display: 'flex', justifyContent: 'end' }}>
        <Button color="secondary" variant="contained" className="no-transform" onClick={onNewStudent}>
          <Typography><i className="fa fa-plus"></i>  Add New Student</Typography>
        </Button>
      </Box>

      <SearchableTable
        handleSearch={searchStudent}
        columns={cols}
        onRowClicked={openProfile}
        data={students.map((d) => {
          return {
            id: d.id,
            photo: <UserAvatar src={d.passport} alt={d.fullName} />,
            serialNumber: d.admissionNumber,
            name: d.fullName,
            level: d.classroom.level,
            stream: d.classroom.stream,
            gender: d.gender,
            action: <DropdownMenu options={dropMenuOptions} row={d} />
          };
        })} />

    </>
  );
};

export default AllStudent;
