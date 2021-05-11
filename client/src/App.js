import './App.css';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom'
import Intro from './pages/intro'
import SignInPage from './pages/signin';
import SignUpPage from './pages/signup';

import RecommendedVideos from './components/RecommendedVideos/RecommendedVideos';
import AccountRecovery from './components/auth/SignIn/AccountRecovery';

function App() {
  let isAuthenticated = localStorage.getItem("user");
  //for testing purpose,u can set isAuthenticated value as false or true
  if(isAuthenticated){
    return <Router>
              <Switch>
                  <Route path="/recommended" component={RecommendedVideos}></Route>
              </Switch>
           </Router>
  }
  return (
    <Router>
      <Switch>
        <Route exact path = "/" component={Intro}></Route>
        <Route path="/signin" component={SignInPage}></Route>
        <Route path="/signup" component={SignUpPage}></Route>        
        <Route path="/AccountRecovery" component={AccountRecovery}></Route>
      </Switch>
    </Router>
  );
}

export default App;