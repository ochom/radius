import { useEffect, useState } from "react";
import { DataTable } from "../../components/table";
import {
  AlertFailed,
  AlertSuccess,
  AlertWarning,
  ConfirmAlert,
} from "../../components/alerts";
import { DropdownMenu } from "../../components/menus";
import DeleteIcon from '@mui/icons-material/Delete';
import { Edit, OpenInBrowser } from "@mui/icons-material";
import { Service } from "../../API/service";
import { UserAvatar } from "../../components/avatars";
import { useHistory } from "react-router-dom";
import { Button } from "@mui/material";
import { Typography } from "@mui/material";

const AllStudent = () => {
  const [loading, setLoading] = useState(true);

  const [students, setStudents] = useState([]);

  let history = useHistory();



  useEffect(() => {
    getStudents()
  }, [])

  const getStudents = () => {
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
      setStudents(res?.students || [])
      setLoading(false)
    });
  };


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
            } else {
              AlertFailed({ text: res.message });
            }
          })
          .finally(() => {
            getStudents();
          });
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
    { name: "#", selector: row => row.serialNumber, sortable: true, width: '100px', },
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

  return (
    <>
      <div className="d-flex justify-content-end mb-3">
        <Button color="secondary" onClick={onNewStudent}>
          <Typography><i className="fa fa-plus"></i>  Add New Student</Typography>
        </Button>
      </div>

      <DataTable
        title="All students"
        progressPending={loading}
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
