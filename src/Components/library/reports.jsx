import React, { useEffect, useState } from 'react';
import { Service } from '../../API/service';
import { DataTable } from '../customs/table';


export default function Reports() {
  const [loading, setLoading] = useState(true)

  const [bookCategories, setCategories] = useState([]);

  useEffect(() => {
    setLoading(true)
    let query = {
      query: `query{
        bookCategories: getBookCategories{
          id
          name
          description
        }
      }`,
      variables: {}
    }
    new Service().getData(query).then((res) => {
      setCategories(res?.bookCategories || [])
      setLoading(false)
    });
  }, []);




  const cols = [
    { name: "Name", selector: (row) => row.name, sortable: true },
    { name: "Description", selector: (row) => row.description, sortable: true },
  ]

  return (
    <>
      <DataTable
        title="Borrowing Reports"
        progressPending={loading}
        defaultSortFieldId={1}
        columns={cols}
        data={bookCategories.map((row) => {
          return {
            id: row.id,
            name: row.name,
            description: row.description,
          };
        })}
      />

    </>
  );
}
