import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import Academics from "./apps/academics";
import Activity from "./apps/activity";
import Auth from "./apps/auth";
import ClassesAndSessions from "./apps/classrooms";
import Dashboard from "./apps/dashboard";
import Library from "./apps/library";
import Settings from "./apps/settings";
import SMS from "./apps/sms";
import Teacher from "./apps/teachers";
import Student from "./apps/students";
import { DefaultPageLayout } from "./components";

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/register" component={Auth} />
        <DefaultPageLayout>
          <Route path="/sms" component={SMS} />
          <Route path="/teachers" component={Teacher} />
          <Route path="/classes" component={ClassesAndSessions} />
          <Route path="/students" component={Student} />
          <Route path="/academics" component={Academics} />
          <Route path="/library" component={Library} />
          <Route path="/activity" component={Activity} />
          <Route path="/settings" component={Settings} />
          <Route exact path="/" component={Dashboard} />
        </DefaultPageLayout>
      </Switch>
    </Router>
  );
}

export default App;
