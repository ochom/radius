import React from "react";
import { Route } from "react-router-dom"
import { PageBody, SubMenu } from "../../components"
import AllTeacher from "./all"
import EditTeacher from "./edit";
import NewTeacher from "./new";
import TeacherDetails from "./details";

const menuItems = [
  { title: "All teacher", href: "/teachers", icon: "bx bxs-group", exact: true },
  { title: "Add New Teacher", href: "/teachers/new", icon: "bx bx-plus-medical" },
]

function Pages() {
  return (
    <Route
      path="/teachers"
      render={({ match: { url } }) => (
        <>
          <Route path={url} component={AllTeacher} exact />
          <Route path={`${url}/new`} component={NewTeacher} />
          <Route path={`${url}/profile/:uid`} component={TeacherDetails} exact />
          <Route path={`${url}/profile/:uid/edit`} component={EditTeacher} />
        </>
      )}
    />
  )
}

function Teacher() {
  return (
    <div>
      <SubMenu titleName="Teacher" titleIcon="bx bx-user" items={menuItems} />
      <PageBody children={<Pages />} />
    </div>
  )
}

export default Teacher
