import { Route } from "react-router-dom"
import { PageBody, SubMenu } from "../../components"
import AllStudent from "./all_students"
import NewStudent from "./new_student"

const menuItems = [
  { title: "All students", href: "/students", icon: "bx bxs-group", exact: true },
  { title: "Create New Student", href: "/students/new", icon: "bx bx-plus-medical", },
  { title: "Import Students", href: "/students/import", icon: "bx bxs-file-import" },
  { title: "Export List", href: "/students/export", icon: "bx bxs-file-export" },
]

function Pages() {
  return (
    <Route
      path="/students"
      render={({ match: { url } }) => (
        <>
          <Route path={url} component={AllStudent} exact />
          <Route path={`${url}/new`} component={NewStudent} />
        </>
      )}
    />
  )
}

function Student() {
  return (
    <div>
      <SubMenu titleName="Students" titleIcon="bx bx-group" items={menuItems} />
      <PageBody children={<Pages />} />
    </div>
  )
}

export default Student