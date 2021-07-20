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
import { DefaultPagelayout } from "./components";



function App() {
  return (
    <Router>
        <DefaultPagelayout>
          <Switch>
            <Route path="/sms"  component={SMS} />
            <Route path="/staff" component={Staff}/>
            <Route path="/classes" component={Classes}/>
            <Route path="/students" component={Student}/>
            <Route path="/parents" component={Parents}/>
            <Route path="/academics" component={Academics}/>
            <Route path="/library" component={Library}/>
            <Route path="/activity" component={Activity}/>
            <Route path="/settings" component={Settings}/>
            <Route exact path="/" component=""/>
          </Switch>
        </DefaultPagelayout>
    </Router>
  )
}

export default App;
