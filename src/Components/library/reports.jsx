import { useQuery, gql } from '@apollo/client';
import { Button, Chip, Grid } from '@mui/material';
import moment from 'moment';
import { useState } from 'react';
import { PageErrorAlert } from '../customs/empty-page';
import { CustomLoader } from '../customs/monitors';
import { DataTable } from '../customs/table';

const FETCH_ALL_QUERY = gql`query{
  books: geLibraryHistory{
  fullName
  number
  bookTitle
  bookISBN
  borrower
  borrowed
  returned
  dueDate
  }
}`


export default function Reports() {
  const [modal, setModal] = useState(false)

  const { data, loading, error } = useQuery(FETCH_ALL_QUERY, {
    fetchPolicy: 'network-only'
  })

  const toggleModal = () => setModal(!modal)

  const cols = [
    { name: "Name", selector: (row) => row.fullName },
    { name: "Borrower", selector: (row) => row.borrower },
    { name: "Title", selector: (row) => row.title },
    { name: "ISBN", selector: (row) => row.isbn },
    { name: "Borrowed", selector: (row) => row.borrowed },
    { name: "Due", selector: (row) => row.dueDate },
    { name: "Status", selector: (row) => row.returned },
  ]

  if (loading) {
    return <CustomLoader />
  }

  if (error) {
    return <PageErrorAlert message={error.message} />
  }

  return (
    <>
      <Grid container rowSpacing={3} columnSpacing={3} sx={{ my: 4 }}>
        <Grid item>
          <Button variant='contained' color='secondary'
            onClick={toggleModal}>Charge sheets</Button>
        </Grid>
        <Grid item >
          <Button color='secondary'>Download Books</Button>
        </Grid>
        <Grid item>
          <Button color='secondary'>Download History</Button>
        </Grid>
      </Grid>

      <DataTable
        progressPending={loading}
        defaultSortFieldId={1}
        columns={cols}
        data={data.books.map((row) => {
          return {
            fullName: row.fullName,
            borrower: row.borrower,
            isbn: row.bookISBN,
            title: row.bookTitle,
            borrowed: moment(row.borrowed).format("DD-MM-yyyy"),
            dueDate: moment(row.dueDate).format("DD-MM-yyyy"),
            returned: row.returned ? <Chip color='success' label="Returned" variant='outlined' /> : "Borrowed",
          };
        })}
      />
    </>
  );
}
