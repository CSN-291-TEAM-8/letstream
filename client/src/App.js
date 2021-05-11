
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom'
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import './App.css';
import { ThemeProvider } from "styled-components";
import Intro from './pages/intro'
import SignInPage from './pages/signin';
import SignUpPage from './pages/signup';
import {lightTheme} from "./utils/theme";
import RecommendedVideos from './components/RecommendedVideos/RecommendedVideos';
import AccountRecovery from './components/auth/SignIn/AccountRecovery';
import GlobalStyle from './utils/GlobalStyle';

function App() {
  let isAuthenticated = localStorage.getItem("user");
  //for testing purpose,u can set isAuthenticated value as false or true
  const Part = () => {
    if (isAuthenticated) {
      return <Router>
        <Switch>
          <Route path="/recommended" component={RecommendedVideos}></Route>
        </Switch>
      </Router>
    }
    return (
      <Router>
        <Switch>
          <Route exact path="/" component={Intro}></Route>
          <Route path="/signin" render={(props) => <SignInPage {...props} />} />
          <Route path="/signup" component={SignUpPage}></Route>
          <Route path="/AccountRecovery" component={AccountRecovery}></Route>
          <Route path="/*" render={({ location }) => (
            <Redirect
              to={{
                pathname: "/signin",
                state: { next: location }
              }} />)} />

        </Switch>
      </Router>
    );
  }

  return <ThemeProvider theme={lightTheme}>
          <GlobalStyle/>
            <ToastContainer autoClose={3000} closeButton={false} />
            <Part/>
        </ThemeProvider>
}

export default App;