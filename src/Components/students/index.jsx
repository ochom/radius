import { Route } from "react-router-dom"
import { PageBody, SubMenu } from "../customs"
import AllParents from "./all_parents"
import AllStudent from "./all_students"
import EditStudent from "./edit_profile"
import NewStudent from "./new_student"
import ParentDetails from "./parent_details"
import StudentDetails from "./student_details"

const menuItems = [
  { title: "All students", href: "/students", icon: "bx bxs-group", exact: true },
  { title: "Add New Student", href: "/students/new", icon: "bx bx-plus-medical" },
  { title: "Parents", href: "/students/parents", icon: "bx bx-male" }
]

function Pages() {
  return (
    <Route
      path="/students"
      render={({ match: { url } }) => (
        <>
          <Route path={url} component={AllStudent} exact />
          <Route path={`${url}/parents`} component={AllParents} exact />
          <Route path={`${url}/parents/:uid`} component={ParentDetails} />
          <Route path={`${url}/new`} component={NewStudent} />
          <Route path={`${url}/profile/:uid`} component={StudentDetails} exact />
          <Route path={`${url}/profile/:uid/edit`} component={EditStudent} />
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