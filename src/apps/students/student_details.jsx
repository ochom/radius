import { Paper } from "@mui/material";
import { useState, useEffect } from "react";
import { Service } from '../../API/service';
import { ProfileHeader } from "../../components/profile";



const StudentDetails = (props) => {
  const [student, setStudent] = useState(false);

  useEffect(() => {
    let query = {
      query: `query students($id:ID!){
        student: getStudent(id:$id){
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
      variables: {
        "id": props.match.params.uid
      }
    }
    new Service().getData(query).then((res) => {
      setStudent(res?.student || null)
    });
  }, [props]);



  return (
    <Paper sx={{ px: 5, py: 2 }}>
      {student ?
        <ProfileHeader student={student} />
        : <p>Student not found</p>}
    </Paper>
  );
};

export default StudentDetails;
