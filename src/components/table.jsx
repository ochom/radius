import DataTable from "react-data-table-component";
import { Checkbox } from "@mui/material";

import { ArrowDownward } from "@mui/icons-material";
import { CustomLoader } from "./monitors";

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
      backgroundColor: 'rgb(230, 244, 244)',
      borderBottomColor: '#FFFFFF',
      borderRadius: '25px',
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
      subHeader
      customStyles={customStyles}
      selectableRowsComponent={Checkbox}
      selectableRowsComponentProps={selectProps}
      sortIcon={sortIcon}
      highlightOnHover
      pointerOnHover
      {...props}
    />
  );
}

export { DataTableBase as DataTable };
