import { useEffect, useState } from "react";
import { DataTable } from "../../components/table";
import {
  AlertFailed,
  AlertSuccess,
  ConfirmAlert,
} from "../../components/alerts";
import { DropdownMenu } from "../../components/menus";
import DeleteIcon from '@mui/icons-material/Delete';
import { Edit, OpenInBrowser } from "@mui/icons-material";
import { Service } from "../../API/service";
import { UserAvatar } from "../../components/avatars";
import { useHistory } from "react-router-dom";


const AllStaff = () => {
  const history = useHistory()

  const [loading, setLoading] = useState(true);
  const [staffs, setStaffs] = useState([]);


  useEffect(() => {
    getStaffs()
  }, [])

  const getStaffs = () => {
    let staffsQuery = {
      query: `query staffs{
        staffs: getStaffs{
          id
          serialNumber
          firstName
          lastName
          employer
          gender
          passport
        }
      }`,
      variables: {}
    }
    new Service().getData(staffsQuery).then((res) => {
      setStaffs(res?.staffs || [])
      setLoading(false)
    });
  };


  const deleteStaff = (staff) => {
    ConfirmAlert().then((res) => {
      if (res.isConfirmed) {
        let query = {
          query: `mutation deleteStaff($id: ID!){
            session: deleteStaff(id: $id){
              id
            }
          }`,
          variables: {
            id: staff.id
          }
        }
        new Service().delete(query)
          .then((res) => {
            if (res.status === 200) {
              AlertSuccess(`Staff deleted successfully`);
            } else {
              AlertFailed(res.message);
            }
          })
          .finally(() => {
            getStaffs();
          });
      }
    });
  };

  const openProfile = (staff) => {
    history.push(`staffs/profile/${staff.id}`)
  }

  const editDetails = (staff) => {
    history.push(`staffs/profile/${staff.id}/edit`)
  }

  let dropMenuOptions = [
    { "title": "Open", action: openProfile, icon: <OpenInBrowser fontSize="small" color="secondary" /> },
    { "title": "Edit", action: editDetails, icon: <Edit fontSize="small" color="success" /> },
    { "title": "Delete", action: deleteStaff, icon: <DeleteIcon fontSize="small" color="error" /> }
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
        title="Registered Employees & Staff"
        defaultSortFieldId={2}
        progressPending={loading}
        columns={cols} data={staffs.map((d) => {
          return {
            photo: <UserAvatar src={d.passport} alt={d.firstName} />,
            serialNumber: d.serialNumber,
            name: `${d.firstName} ${d.lastName}`,
            employer: d.employer,
            gender: d.gender,
            action: <DropdownMenu options={dropMenuOptions} row={d} />
          };
        })} />

    </>
  );
};

export default AllStaff;
