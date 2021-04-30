import './App.css';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom'
import Intro from './pages/intro'
import SignInPage from './pages/signin';
import SignUpPage from './pages/signup';
function App() {
  return (
    <Router>
      <Switch>
        <Route exact path = "/" component={Intro}></Route>
        <Route path="/signin" component={SignInPage}></Route>
        <Route path="/signup" component={SignUpPage}></Route>
      </Switch>
    </Router>
  );
}

export default App;