import { useEffect, useState } from "react";
import { DataTable } from "../../components/table";
import {
  AlertFailed,
  AlertSuccess,
  ConfirmAlert,
} from "../../components/alerts";
import profile from "../../static/profile.jpg";
import { DropdownMenu } from "../../components/menus";
import DeleteIcon from '@mui/icons-material/Delete';
import { OpenInBrowser } from "@mui/icons-material";
import { Service } from "../../API/service";


const AllStudent = () => {
  const [loading, setLoading] = useState(true);

  const [students, setStudents] = useState([]);


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
          class{
            level
            stream
          }
        }
      }`,
      variables: {}
    }
    new Service().getData(query).then((res) => {
      setStudents(res.students || [])
      setLoading(false)
    });
  };


  const deleteStudent = (student) => {
    ConfirmAlert().then((res) => {
      if (res.isConfirmed) {
        let query = {
          query: `mutation deleteStudent($id: ID!){
            session: deleteStudent(id: $id){
              id
            }
          }`,
          variables: {
            "id": student.id
          }
        }
        new Service().delete(query)
          .then((res) => {
            if (res.status === 200) {
              AlertSuccess(`Student deleted successfully`);
            } else {
              AlertFailed(res.message);
            }
          })
          .finally(() => {
            getStudents();
          });
      }
    });
  };


  let dropMenuOptions = [{ "title": "View", action: deleteStudent, icon: <OpenInBrowser fontSize="small" /> }, { "title": "Delete", action: deleteStudent, icon: <DeleteIcon fontSize="small" color="red" /> }]

  const cols = [
    { name: "", selector: row => row.photo, width: '70px' },
    { name: "#", selector: row => row.serialNumber, sortable: true, width: '80px' },
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
      <DataTable
        title="All students"
        defaultSortFieldId={2}
        progressPending={loading}
        columns={cols}
        data={students.map((d) => {
          return {
            photo: <img src={profile} alt="P" className="user-thumbnail" />,
            serialNumber: d.admissionNumber,
            name: d.fullName,
            level: d.class.level,
            stream: d.class.stream,
            gender: d.gender,
            action: <DropdownMenu options={dropMenuOptions} row={d} />
          };
        })} />

    </>
  );
};

export default AllStudent;
