import { Route } from "react-router-dom"
import { PageBody, SubMenu } from "../customs"
import Books from "./books"
import Borrowing from "./borrowing"
import Categories from "./categories"
import Dashboard from "./dashboard"
import Reports from "./reports"
import Publishers from "./publishers"

const menuItems = [
  { title: "Dashboard", href: "/library", icon: "bx bxs-right-arrow", exact: true },
  { title: "Book Categories", href: "/library/categories", icon: "bx bxs-right-arrow" },
  { title: "Publishers", href: "/library/publishers", icon: "bx bxs-right-arrow" },
  { title: "Books", href: "/library/books", icon: "bx bxs-right-arrow" },
  { title: "Issue/Return", href: "/library/issue", icon: "bx bxs-right-arrow" },
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
              <Route path={url} component={Dashboard} exact />
              <Route path={`${url}/categories`} component={Categories} />
              <Route path={`${url}/books`} component={Books} />
              <Route path={`${url}/issue`} component={Borrowing} />
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