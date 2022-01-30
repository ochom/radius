import { useEffect, useState } from "react";
import { DataTable } from "../customs/table";
import {
  AlertFailed,
  AlertSuccess,
  AlertWarning,
  ConfirmAlert,
} from "../customs/alerts";
import { DropdownMenu } from "../customs/menus";
import DeleteIcon from '@mui/icons-material/Delete';
import { Edit, OpenInBrowser } from "@mui/icons-material";
import { Service } from "../../API/service";
import { UserAvatar } from "../customs/avatars";
import { useHistory } from "react-router-dom";


const AllTeacher = () => {
  const history = useHistory()

  const [loading, setLoading] = useState(true);
  const [teachers, setTeachers] = useState([]);


  useEffect(() => {
    getTeachers()
  }, [])

  const getTeachers = () => {
    let query = {
      query: `query{
        teachers: getTeachers{
          id
          serialNumber
          title
          fullName
          employer
          gender
          passport
        }
      }`,
      variables: {}
    }
    new Service().getData(query).then((res) => {
      setTeachers(res?.teachers || [])
      setLoading(false)
    });
  };


  const deleteTeacher = (teacher) => {
    ConfirmAlert({ title: "Delete teacher!" }).then((res) => {
      if (res.isConfirmed) {
        let query = {
          query: `mutation deleteTeacher($id: ID!){
            deleteTeacher(id: $id)
          }`,
          variables: {
            id: teacher.id
          }
        }
        new Service().delete(query)
          .then((res) => {
            if (res.status === 200) {
              AlertSuccess({ text: `Teacher deleted successfully` });
            } else {
              AlertFailed({ text: res.message });
            }
          })
          .finally(() => {
            getTeachers();
          });
      } else if (res.isDismissed) {
        AlertWarning({ title: "Cancelled", text: "Request cancelled, teacher not deleted" })
      }
    });
  };

  const openProfile = (row) => {
    history.push(`teachers/profile/${row.id}`)
  }

  const editDetails = (row) => {
    history.push(`teachers/profile/${row.id}/edit`)
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

  return (
    <>
      <DataTable
        title="Registered Employees & Teacher"
        defaultSortFieldId={2}
        progressPending={loading}
        onRowClicked={openProfile}
        columns={cols} data={teachers.map((d) => {
          return {
            id: d.id,
            photo: <UserAvatar src={d.passport} alt={d.title} />,
            serialNumber: d.serialNumber,
            name: `${d.title} ${d.fullName}`,
            employer: d.employer,
            gender: d.gender,
            action: <DropdownMenu options={dropMenuOptions} row={d} />
          };
        })} />

    </>
  );
};

export default AllTeacher;
