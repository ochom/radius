import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Academics from "./Components/academics";
import Activity from "./Components/activity";
import Auth from "./Components/auth";
import ClassesAndSessions from "./Components/classrooms";
import Dashboard from "./Components/dashboard";
import Library from "./Components/library";
import Settings from "./Components/settings";
import SMS from "./Components/sms";
import Teacher from "./Components/teachers";
import Student from "./Components/students";
import DefaultPageLayout from "./Components/customs";
import { loadUser } from "./API/auth"
import { useEffect, useState } from "react";
import { CustomLoader } from "./Components/customs/monitors";

import { useSelector, useDispatch } from 'react-redux'
import { login } from './reducers/auth-reducer'

function App(props) {

  const dispatch = useDispatch()
  const [loading, setLoading] = useState(false)

  const user = useSelector(state => state.auth.user)

  useEffect(() => {
    if (user) {
      setLoading(true)
      loadUser(user.token).then(res => {
        console.log(res.data);
        dispatch(login(res.data))
      }).finally(() => {
        setLoading(false)
      })
    }

  }, [dispatch, user]);

  if (!user && loading) {
    return <CustomLoader />
  }

  if (!user) {
    return <Auth />
  }

  return (
    <Router>
      <Switch>
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
  )
}


export default App