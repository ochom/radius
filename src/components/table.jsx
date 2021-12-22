import DataTable from "react-data-table-component";
import Checkbox from "@material-ui/core/Checkbox";

import ArrowDownward from "@material-ui/icons/ArrowDownward";

const sortIcon = <ArrowDownward style={{ color: "grey", marginLeft: "5px" }} />;
const selectProps = { indeterminate: (isIndeterminate) => isIndeterminate };

function DataTableBase(props) {
  return (
    <DataTable
      pagination
      selectableRowsComponent={Checkbox}
      selectableRowsComponentProps={selectProps}
      sortIcon={sortIcon}
      pointerOnHover
      {...props}
    />
  );
}

export { DataTableBase as DataTable };
