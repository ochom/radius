import React from "react";
import { Route } from "react-router-dom"
import { PageBody, SubMenu } from "../../components"
import AllStaff from "./all_staff"
import StaffRoles from "./staff_roles"

const menuItems = [
  { title: "Roles", href: "/staff/roles", icon: "bx bxs-right-arrow" },
  { title: "All staff", href: "/staff", icon: "bx bxs-right-arrow", exact: true },
]

function Staff() {
  return (
    <div>
      <SubMenu titleName="Staff" titleIcon="bx bx-user" items={menuItems} />
      <PageBody>
        <Route
          path="/staff"
          render={({ match: { url } }) => (
            <>
              <Route path={`${url}`} component={AllStaff} exact />
              <Route path={`${url}/roles`} component={StaffRoles} />
            </>
          )}
        />
      </PageBody>
    </div>
  )
}

export default Staff
