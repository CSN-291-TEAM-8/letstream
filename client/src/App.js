import React from "react";
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom'
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import './App.css';
import { ThemeProvider } from "styled-components";
import Intro from './pages/intro'
import SignInPage from './pages/signin';
import SignUpPage from './pages/signup';
//import {lightTheme} from "./utils/theme";
import Home from './components/RecommendedVideos/Home';
import AccountRecovery from './components/auth/SignIn/AccountRecovery';
import GlobalStyle from './utils/GlobalStyle';
import Navbar2 from "./components/Navbar2/Navbar2";
import History from './pages/history';
import LiveVideos from './pages/liveVideos';
import TrendingVideos from './pages/Trending';
import MyVideos from './pages/myVideos';
import LikedVideos from './pages/likedVideos';
import SavedVideos from "./pages/savedVideos";
import SearchVideos from './pages/SearchPage';
import VideoForm from './components/Upload/Upload';
import Suggestions from './pages/suggestions';
import Notifications from './pages/Notifications';
import { ThemeContext } from "./utils/ThemeContext";
import Channel from "./pages/channel";
import VideoPlayer from "./components/VideoPlayer/VideoPlayer";
import Broadcast from "./pages/Broadcast";
import Broadcastroom from "./pages/Broadcastroom";

function App() {
  let isAuthenticated = localStorage.getItem("user");
  const { theme } = React.useContext(ThemeContext);
  //for testing purpose,u can set isAuthenticated value as false or true
  const Part = () => {
    if (isAuthenticated) {
      return (
      <Router>
        <Navbar2 />
        <Switch>          
          <Route exact path="/" component={Home}></Route>
          <Route path="/user/uploadvideo" component={VideoForm}></Route>
          <Route path="/video/search/:term" component={()=><SearchVideos key={window.location.pathname}/>}></Route>
          <Route path="/highlight" component={TrendingVideos}></Route>
          <Route path="/user/myvideos" component={MyVideos}></Route>
          
          <Route path="/user/savedvideos" component={SavedVideos}></Route>
          <Route path="/user/notifications" component={Notifications}></Route>
          <Route path="/user/likedvideos" component={LikedVideos}></Route>
          <Route path="/user/startlive" component={Broadcast}></Route>
          <Route path="/user/history" component={History}></Route>
          <Route path="/livestreaming/:roomid" component={()=><Broadcastroom key={window.location.pathname}/>}></Route>
          <Route path="/user/suggestions" component={Suggestions}></Route>
          <Route path="/user/livevideos" component={LiveVideos}></Route>
          <Route path="/user/:userId" component={()=><Channel key={window.location.pathname}/>}></Route>
          <Route path="/video/:videoId" component={()=><VideoPlayer key={window.location.pathname}/>}></Route>
        </Switch>
      </Router>
      )
      
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

  return <ThemeProvider theme={theme}>
          <GlobalStyle/>
            <ToastContainer autoClose={3000} closeButton={false} />
            <Part/>
        </ThemeProvider>
}

export default App;