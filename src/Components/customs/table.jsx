import DataTable from "react-data-table-component";
import { Checkbox, TextField } from "@mui/material";

import { ArrowDownward } from "@mui/icons-material";
import { CustomLoader } from "./monitors";
import { Box } from "@mui/system";

const sortIcon = <ArrowDownward style={{ color: "grey", marginLeft: "5px" }} />;
const selectProps = { indeterminate: (isIndeterminate) => isIndeterminate };



const customStyles = {
  headRow: {
    style: {
      border: 'none',
    },
  },
  headCells: {
    style: {
      color: '#202124',
      fontSize: '14px',
    },
  },
  rows: {
    highlightOnHoverStyle: {
      backgroundColor: '#4e0c8b1c',
      borderBottomColor: '#FFFFFF',
      borderRadius: '15px',
      outline: '1px solid #FFFFFF',
    },
  },
  pagination: {
    style: {
      border: 'none',
    },
  },
};


function DataTableBase(props) {
  return (
    <DataTable
      progressComponent={<CustomLoader />}
      pagination
      customStyles={customStyles}
      selectableRowsComponent={Checkbox}
      selectableRowsComponentProps={selectProps}
      sortIcon={sortIcon}
      highlightOnHover
      pointerOnHover
      {...props}
    />
  )
}


function SearchableTable(props) {
  let { handleSearch } = props
  return (
    <DataTable
      progressComponent={<CustomLoader />}
      pagination
      subHeader
      subHeaderComponent={
        <Box sx={{ my: 2, display: 'flex', justifyContent: 'end' }}>
          <TextField
            label="Search"
            size="small"
            placeholder="Search ..."
            onChange={handleSearch}
          />
        </Box>
      }
      customStyles={customStyles}
      selectableRowsComponent={Checkbox}
      selectableRowsComponentProps={selectProps}
      sortIcon={sortIcon}
      highlightOnHover
      pointerOnHover
      {...props}
    />
  )
}

export { SearchableTable };

export { DataTableBase as DataTable };
