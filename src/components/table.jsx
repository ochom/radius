import React from "react";
import DataTable from 'react-data-table-component';
import Checkbox from '@material-ui/core/Checkbox';

import ArrowDownward from '@material-ui/icons/ArrowDownward';

const DataWithCaption = ({ data, caption }) => <div>{data} <br /><small>{caption}</small></div>

const sortIcon = <ArrowDownward />;
const selectProps = { indeterminate: isIndeterminate => isIndeterminate };

function DataTableBase(props) {
    return (
        <DataTable
            pagination
            selectableRowsComponent={Checkbox}
            selectableRowsComponentProps={selectProps}
            sortIcon={sortIcon}
            dense
            {...props}
        />
    );
}

export { DataWithCaption, DataTableBase as DataTable };
