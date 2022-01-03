import { Route } from "react-router-dom"
import { PageBody, SubMenu } from "../../components"
import Classrooms from "./classes"
import Sessions from "./sessions"

const menuItems = [
  { title: "Classes", href: "/classes", icon: "bx bxs-right-arrow", exact: true },
  { title: "Sessions", href: "/classes/sessions", icon: "bx bxs-right-arrow" },
  { title: "Class Register", href: "/classes/register", icon: "bx bxs-right-arrow" },
]

function Classes() {
  return (
    <div>
      <SubMenu titleName="Classes" titleIcon="bx bxs-school" items={menuItems} />
      <PageBody>
        <Route
          path="/classes"
          render={({ match: { url } }) => (
            <>
              <Route path={url} component={Classrooms} exact />
              <Route path={`${url}/sessions`} component={Sessions} />
              {/* <Route path={`${url}/register`} component={StaffRoles} /> */}
            </>
          )}
        />
      </PageBody>
    </div>
  )
}

export default Classes