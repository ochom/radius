import { Route } from "react-router-dom"
import { PageBody, SubMenu } from "../customs"
import Classrooms from "./classes"
import Sessions from "./sessions"

const menuItems = [
  { title: "Classrooms", href: "/classes", icon: "bx bxs-school", exact: true },
  { title: "Sessions", href: "/classes/sessions", icon: "bx bx-time-five" },
]

function ClassesAndSessions() {
  return (
    <div>
      <SubMenu titleName="Classrooms" titleIcon="bx bxs-school" items={menuItems} />
      <PageBody>
        <Route
          path="/classes"
          render={({ match: { url } }) => (
            <>
              <Route path={url} component={Classrooms} exact />
              <Route path={`${url}/sessions`} component={Sessions} />
            </>
          )}
        />
      </PageBody>
    </div>
  )
}

export default ClassesAndSessions