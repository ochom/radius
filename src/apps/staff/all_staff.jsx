import { useEffect, useState } from "react";
import { DataTable } from "../../components/table";
import { StaffService } from "../../API/staffs";
import {
  AlertFailed,
  AlertSuccess,
  ConfirmAlert,
} from "../../components/alerts";
import profile from "../../static/profile.jpg";
import { DropdownMenu } from "../../components/menus";
import DeleteIcon from '@mui/icons-material/Delete';
import { OpenInBrowser } from "@mui/icons-material";


const AllStaff = () => {
  const [loading, setLoading] = useState(true);

  const [data, setData] = useState([]);


  useEffect(() => {
    getStaffs()
  }, [])

  const getStaffs = () => {
    new StaffService().getStaffs().then((data) => {
      setData(data);
      setLoading(false);
    });
  }

  const deleteStaff = (staff) => {
    ConfirmAlert().then((res) => {
      if (res.isConfirmed) {
        new StaffService().deleteStaff(staff.id)
          .then((res) => {
            if (res.status === 200) {
              AlertSuccess(res.message);
            } else {
              AlertFailed(res.message);
            }
          })
          .finally(() => {
            getStaffs()
          });
      }
    });
  };


  let dropMenuOptions = [{ "title": "View", action: deleteStaff, icon: <OpenInBrowser fontSize="small" /> }, { "title": "Delete", action: deleteStaff, icon: <DeleteIcon fontSize="small" color="red" /> }]

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
        columns={cols} data={data.map((d) => {
          return {
            photo: <img src={profile} alt="P" className="user-thumbnail" />,
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
