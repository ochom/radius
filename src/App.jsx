import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import Academics from "./apps/academics";
import Activity from "./apps/activity";
import Classes from "./apps/classrooms";
import Library from "./apps/library";
import Parents from "./apps/parents";
import Settings from "./apps/settings";
import SMS from "./apps/sms";
import Staff from "./apps/staff";
import Student from "./apps/students";
import { Sidenav } from "./components";

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/">
          <Sidenav />
          <div className="home_content">
            <div className="topbar">
              <img src="https://media.istockphoto.com/vectors/black-and-white-illustration-of-a-school-logo-vector-id1136343416?k=6&m=1136343416&s=170667a&w=0&h=sztUR6SSjxwCNjRhfJGmdVoIbGUTADrbDde98A_x4qc=" alt="brand" className="school_brand" />
              <b className="school_name">Demo Secondary School</b>
            </div>
            <Route path="/sms" component={SMS} />
            <Route path="/staff" component={Staff} />
            <Route path="/classes" component={Classes} />
            <Route path="/students" component={Student} />
            <Route path="/parents" component={Parents} />
            <Route path="/academics" component={Academics} />
            <Route path="/library" component={Library} />
            <Route path="/activity" component={Activity} />
            <Route path="/settings" component={Settings} />
          </div>
        </Route>
      </Switch>
    </Router>
  )
}

export default App;
