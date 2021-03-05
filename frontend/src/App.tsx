import React from "react";
import { BrowserRouter, Route, Switch} from "react-router-dom";
import { Grommet } from "grommet";
import Home from "./Views/Home";
import LandingPage from "./Views/LandingPage";
import ChannelPage from "./Views/ChannelPage";
import VideoPage from "./Views/VideoPage";
// import StreamPage from "./Views/StreamPage";
import TagPage from "./Views/TagPage";
import Streaming from "./Views/Streaming";
import AllVideosPage from "./Views/AllVideosPage";
import HeaderBar from "./Components/HeaderBar";
import { Theme } from "./theme";
import ManageChannelPage from "./Views/ManageChannelPage";
import Preferences from "./Views/Preferences";
import Schedule from "./Views/Schedule";
import AllUpcomingTalksPage from "./Views/AllUpcomingTalksPage";
import AllPastTalksPage from "./Views/AllPastTalksPage";
import SavedTalksPage from "./Views/SavedTalksPage";
import InformationPage from "./Views/InformationPage";
import GettingStartedPage from "./Views/GettingStartedPage";
import TermsOfServicePage from "./Views/TermsOfServicePage";
import PrivacyPage from "./Views/PrivacyPage";
import ChangePasswordPage from "./Views/ChangePasswordPage";
import AllAgorasPage from "./Views/AllAgorasPage";
import AllSpeakersPage from "./Views/AllSpeakersPage";
import TalkSharingPage from "./Views/TalkSharingPage";
import AvatarPage from "./Views/AvatarPage";
import AgoraStreamSpeakerPage from "./Views/AgoraStreamSpeakerPage";
import AgoraStreamAudiencePage from "./Views/AgoraStreamAudiencePage";
import {useTracking} from './Components/Core/Analytics/useTracking';















function App() {
  // // Initialize google analytics page view tracking
  useTracking("G-J8FEQBCS4H");
  
  return (
      <Grommet theme={Theme} full>
      <HeaderBar />
        <Switch>
          <Route exact path="/" component={LandingPage} />
          <Route exact path="/browse" component={Home} />
          <Route exact path="/videos" component={AllVideosPage} />
          <Route exact path="/agoras" component={AllAgorasPage} />
          {/* <Route exact path="/speakers" component={AllSpeakersPage} /> */}
          <Route path="/:event_id/virtual_meeting" component={AvatarPage} />
          <Route path="/agora/:room_id/speaker/" component={AgoraStreamSpeakerPage} />
          <Route path="/agora/:room_id/" component={AgoraStreamAudiencePage} />
          <Route path="/video" component={VideoPage} />
          {/* <Route path="/stream" component={StreamPage} /> */}
          <Route path={`/:name/manage`} component={ManageChannelPage} />
          <Route path="/tag" component={TagPage} />
          <Route path="/event/:name" component={TalkSharingPage}/>
          <Route path="/streaming" component={Streaming} />
          <Route path="/preferences" component={Preferences} />
          <Route path="/schedule" component={Schedule} />
          <Route path="/saved" component={SavedTalksPage} />
          <Route path="/upcoming" component={AllUpcomingTalksPage} />
          <Route path="/past" component={AllPastTalksPage} />
          <Route path="/info/welcome" component={InformationPage} />
          <Route path="/info/getting-started" component={GettingStartedPage} />
          <Route path="/info/tos" component={TermsOfServicePage} />
          <Route path="/info/privacy" component={PrivacyPage} />
          <Route path="/changepassword" component={ChangePasswordPage} />
          <Route path="*" component={ChannelPage} />
        </Switch>
      </Grommet>
  );
}

export default () => (
  <BrowserRouter>
    <App />
  </BrowserRouter>

)
