import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { loadUser } from "./API/auth";
import Academics from "./Components/academics";
import Activity from "./Components/activity";
import Auth from "./Components/auth";
import ClassesAndSessions from "./Components/classrooms";
import DefaultPageLayout from "./Components/customs";
import { CustomLoader } from "./Components/customs/monitors";
import Dashboard from "./Components/dashboard";
import Library from "./Components/library";
import Settings from "./Components/settings";
import SMS from "./Components/sms";
import Student from "./Components/students";
import Teacher from "./Components/teachers";
import { login } from "./reducers/auth-reducer";


function App(props) {
  const user = useSelector(state => state.auth.user)
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);


  useEffect(() => {
    const getUser = () => {
      let token = localStorage.getItem('token')
      if (token) {
        setLoading(true);
        loadUser(token)
          .then((res) => {
            if (res.status === 200) {
              dispatch(login(res.data));
            }
          }).catch(err => {
            console.log(err)
          })
          .finally(() => {
            setLoading(false);
          });
      }
    }
    getUser();
    return () => {
      getUser()
    }
  }, [dispatch]);

  if (loading) {
    return <CustomLoader />;
  }

  if (!loading && !user) {
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