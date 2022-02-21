import { Route } from "react-router-dom"
import { PageBody, SubMenu } from "../customs"
import Books from "./books"
import Borrowing from "./borrowing"
import Categories from "./categories"
import Dashboard from "./dashboard"
import Reports from "./reports"
import Publishers from "./publishers"
import StudentsLender from "./student_lender"
import TeachersLender from "./teachers_lender"
import NewBook from "./new_book"
import EditBook from "./edit_book"

const menuItems = [
  { title: "Issue/Return", href: "/library/issue", icon: "bx bxs-right-arrow" },
  { title: "Book Categories", href: "/library/categories", icon: "bx bxs-right-arrow" },
  { title: "Publishers", href: "/library/publishers", icon: "bx bxs-right-arrow" },
  { title: "Books", href: "/library/books", icon: "bx bxs-right-arrow", exact: true },
  { title: "Add New Book", href: "/library/books/new", icon: "bx bx-plus-medical" },
  { title: "Reports", href: "/library/reports", icon: "bx bxs-right-arrow" },
]

function Library() {

  return (
    <div>
      <SubMenu titleName="Library" titleIcon="bx bx-book-open" items={menuItems} />
      <PageBody>
        <Route
          path="/library"
          render={({ match: { url } }) => (
            <>
              <Route path={url} component={Borrowing} exact />
              <Route path={`${url}/categories`} component={Categories} />
              <Route path={`${url}/books`} component={Books} exact />
              <Route path={`${url}/books/new`} component={NewBook} exact />
              <Route path={`${url}/books/edit/:uid`} component={EditBook} exact />
              <Route path={`${url}/issue`} component={Borrowing} exact />
              <Route path={`${url}/issue/students/:uid`} component={StudentsLender} />
              <Route path={`${url}/issue/teachers/:uid`} component={TeachersLender} />
              <Route path={`${url}/publishers`} component={Publishers} />
              <Route path={`${url}/reports`} component={Reports} />
            </>
          )}
        />
      </PageBody>
    </div>
  )
}

export default Library