import { gql, useMutation, useQuery } from "@apollo/client";
import { Edit, OpenInBrowser } from "@mui/icons-material";
import DeleteIcon from '@mui/icons-material/Delete';
import { Avatar, Box, Button, Typography } from "@mui/material";
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
query {
  parents: getParents{
    id
    fullName
    idNumber
    occupation
    mobile
    children{
      id
    }
  }
}`


const DELETE_MUTATION = gql`
 mutation deleteParent($id: ID!){
    deleteParent(id: $id)
  }`

export default function AllParents() {
  let history = useHistory();
  const [filteredParents, setFilteredParents] = useState([]);
  const [allParents, setAllParents] = useState([]);

  const { loading, error, refetch } = useQuery(FETCH_ALL_QUERY, {
    fetchPolicy: 'network-only',
    onCompleted: (res) => {
      if (res.parents) {
        setFilteredParents(res.parents)
        setAllParents(res.parents)
      }
    },
  })

  const [deleteParent] = useMutation(DELETE_MUTATION, {
    onError: (err) => {
      AlertFailed({ text: err.message });
    },
    onCompleted: () => {
      AlertSuccess({ text: `Parent deleted successfully` });
      refetch()
    }
  })


  const handleDelete = (student) => {
    ConfirmAlert({ title: "Delete student!" }).then((res) => {
      if (res.isConfirmed) {
        deleteParent({
          variables: {
            id: student.id
          }
        })
      } else if (res.isDismissed) {
        AlertWarning({ title: "Cancelled", text: "Request cancelled, student not deleted" })
      }
    });
  };

  const openProfile = ({ id }) => {
    history.push(`/students/parents/${id}`);
  }

  const cols = [
    { name: "", selector: row => row.photo, width: '70px' },
    { name: "Name", selector: row => row.name, sortable: true },
    { name: "ID Number", selector: row => row.idNumber, sortable: true },
    { name: "Mobile", selector: row => row.mobile, sortable: true },
    { name: "Children", selector: row => row.children, sortable: true, width: '150px' },
    { name: "Occupation", selector: row => row.occupation, sortable: true }
  ];

  const searchParent = e => {
    var val = e.target.value.toLowerCase();
    if (val) {
      var newParents = allParents.filter(s => s.idNumber.toLowerCase().includes(val) || s.fullName.toLowerCase().includes(val));
      setFilteredParents(newParents)
    } else {
      setFilteredParents(allParents)
    }
  }

  if (loading) {
    return <CustomLoader />
  }

  if (error) {
    return <PageErrorAlert message={error.message} />
  }

  return (
    <Box>
      <SearchableTable
        handleSearch={searchParent}
        columns={cols}
        onRowClicked={openProfile}
        data={(filteredParents || []).map((d) => {
          return {
            id: d.id,
            photo: <UserAvatar alt={d.fullName} />,
            idNumber: d.idNumber,
            name: d.fullName,
            mobile: d.mobile,
            children: d.children?.length || 0,
            occupation: d.occupation
          };
        })} />

    </Box>
  );
};
