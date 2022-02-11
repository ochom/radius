import { Edit, OpenInBrowser } from "@mui/icons-material";
import DeleteIcon from '@mui/icons-material/Delete';
import { Box, Button, TextField, Typography } from "@mui/material";
import React, { useEffect, useMemo, useState } from "react";
import { useHistory } from "react-router-dom";
import { Service } from "../../API/service";
import {
  AlertFailed,
  AlertSuccess,
  AlertWarning,
  ConfirmAlert
} from "../customs/alerts";
import { UserAvatar } from "../customs/avatars";
import { DropdownMenu } from "../customs/menus";
import { DataTable } from "../customs/table";

const AllStudent = () => {
  const [loading, setLoading] = useState(true);

  const [students, setStudents] = useState([]);
  const [allStudents, setAllStudents] = useState([]);
  const [totalRows, setTotalRows] = useState(0);

  let history = useHistory();



  useEffect(() => {
    let query = {
      query: `query students{
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
      }`,
      variables: {}
    }
    new Service().getData(query).then((res) => {
      setAllStudents(res?.students || [])
      setStudents(res?.students || [])
      setTotalRows(res?.students ? res.students.length : 0)
      setLoading(false)
    });
  }, [totalRows])


  const deleteStudent = (student) => {
    ConfirmAlert({ title: "Delete student!" }).then((res) => {
      if (res.isConfirmed) {
        let query = {
          query: `mutation deleteStudent($id: ID!){
            deleteStudent(id: $id)
          }`,
          variables: {
            id: student.id
          }
        }
        new Service().delete(query)
          .then((res) => {
            if (res.status === 200) {
              AlertSuccess({ text: `Student deleted successfully` });
              setTotalRows(totalRows - 1)
            } else {
              AlertFailed({ text: res.message });
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
    { "title": "Delete", action: deleteStudent, icon: <DeleteIcon fontSize="small" color="error" /> }
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

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const subHeader = useMemo(() => {
    return (
      <div className="d-flex justify-content-end px-3">
        <TextField
          label="Search"
          size="small"
          placeholder="Search Reg or Name"
          onChange={searchStudent}
        />
      </div>
    )
  })


  return (
    <>
      <Box sx={{ my: 3, display: 'flex', justifyContent: 'end' }}>
        <Button color="secondary" variant="contained" className="no-transform" onClick={onNewStudent}>
          <Typography><i className="fa fa-plus"></i>  Add New Student</Typography>
        </Button>
      </Box>

      <DataTable
        title="All students"
        progressPending={loading}
        columns={cols}
        subHeader
        subHeaderComponent={subHeader}
        persistTableHead
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
