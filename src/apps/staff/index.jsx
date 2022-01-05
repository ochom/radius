import React from "react";
import { Route } from "react-router-dom"
import { PageBody, SubMenu } from "../../components"
import AllStaff from "./all_staff"
import NewStaff from "./new_staff";
import StaffRoles from "./roles"

const menuItems = [
  { title: "All staff", href: "/staff", icon: "bx bxs-group", exact: true },
  { title: "Add New Staff", href: "/staff/new", icon: "bx bx-plus-medical" },
  { title: "Roles", href: "/staff/roles", icon: "bx bx-list-ul" },
]

function Pages() {
  return (
    <Route
      path="/staff"
      render={({ match: { url } }) => (
        <>
          <Route path={url} component={AllStaff} exact />
          <Route path={`${url}/new`} component={NewStaff} />
          <Route path={`${url}/roles`} component={StaffRoles} />
        </>
      )}
    />
  )
}

function Staff() {
  return (
    <div>
      <SubMenu titleName="Staff" titleIcon="bx bx-user" items={menuItems} />
      <PageBody children={<Pages />} />
    </div>
  )
}

export default Staff
