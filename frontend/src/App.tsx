import React, { useEffect } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { Grommet } from "grommet";
import { useAuth0 } from "@auth0/auth0-react";

import { useStore } from "./store";
import Home from "./Views/Home";
import LandingPage from "./Views/LandingPages/LandingPage";
import OrganiserLandingPage from "./Views/LandingPages/OrganiserLandingPage";
import ChannelPage from "./Views/ChannelPage";
import AllSpeakersPage from "./Views/AllSpeakersPage";
import AllVideosPage from "./Views/AllVideosPage";
import HeaderBar from "./Components/Core/HeaderBar";
import { Theme } from "./theme";
import ManageChannelPage from "./Views/ManageChannelPage";
import Preferences from "./Views/Preferences";
import AllPastTalksPage from "./Views/AllPastTalksPage";
import SavedTalksPage from "./Views/SavedTalksPage";
import InformationPage from "./Views/InformationPage";
import GettingStartedPage from "./Views/GettingStartedPage";
import TermsOfServicePage from "./Views/TermsOfServicePage";
import PrivacyPage from "./Views/PrivacyPage";
import ChangePasswordPage from "./Views/ChangePasswordPage";
import AllAgorasPage from "./Views/AllAgorasPage";
import AgoraCreationPage from "./Views/AgoraCreationPage";
import TalkSharingPage from "./Views/TalkSharingPage";
import AvatarPage from "./Views/AvatarPage";
import LivestreamPage from "./Views/Livestream/LivestreamPage";
import AfterTransaction from "./Views/AfterTransaction";
import { useTracking } from "./Components/Core/Analytics/useTracking";
import ProfilePage from "./Views/ProfilePage";

function App() {
  // Initialize google analytics page view tracking
  useTracking("G-J8FEQBCS4H");

  // Auth0
  const { user, isLoading } = useAuth0();

  console.log(`Auth0 user: ${user}`);

  // global state
  const loggedInUser = useStore((state) => state.loggedInUser);
  const setUser = useStore((state) => state.setUser);

  // when the "user" object from Auth0 changes, we copy it to our global store
  useEffect(() => {
    setUser(user);
  }, [user]);

  // don't want to return anything when Auth0 is still loading
  if (isLoading) {
    return <></>;
  }

  console.log(loggedInUser);

  return (
    <Grommet theme={Theme} full>
      <HeaderBar />
      <Switch>
        {/* LANDING PAGES */}
        <Route exact path="/" component={LandingPage} />
        <Route exact path="/organisers" component={OrganiserLandingPage} />

        {/* KEY CTA ENDPOINTS */}
        <Route exact path="/browse" component={Home} />
        <Route exact path="/videos" component={AllVideosPage} />
        <Route exact path="/agoras" component={AllAgorasPage} />
        <Route path="/past" component={AllPastTalksPage} />

        {/* CHANNELS PAGES */}
        <Route path={`/:name/manage`} component={ManageChannelPage} />

        {/* PROFILE PAGES */}
        {/* <Route exact path="/speakers" component={AllSpeakersPage} /> */}
        <Route exact path="/speakers" component={AllSpeakersPage} />

        {/* REFERAL ENDPOINT: not deployed yet */}
        {/* <Route path="/referral/channel" component={ChannelReferralPage} /> */}
        {/* <Route path="/referral/user/:userId/" component={UserReferralPage} /> */}

        {/* EVENT ENDPOINTS: */}
        <Route path="/:event_id/virtual_meeting" component={AvatarPage} />
        <Route
          path="/livestream/:encoded_endpoint"
          component={LivestreamPage}
        />
        <Route path="/event/:name" component={TalkSharingPage} />

        {/* USER ENDPOINT: */}
        <Route path="/preferences" component={Preferences} />
        <Route path="/saved" component={SavedTalksPage} />

        {/* PROFILES ENDPOINTS: */}
        <Route exact path="/profile/:user_id" component={ProfilePage} />

        {/* INFO ENDPOINT: */}
        <Route path="/info/welcome" component={InformationPage} />
        <Route path="/info/agora_creation" component={AgoraCreationPage} />
        <Route path="/info/getting-started" component={GettingStartedPage} />
        <Route path="/info/tos" component={TermsOfServicePage} />
        <Route path="/info/privacy" component={PrivacyPage} />
        <Route path="/changepassword" component={ChangePasswordPage} />
        <Route path="*" component={ChannelPage} />

        {/* PAYMENT ENDPOINTS: */}
        <Route path="/thankyou/:status" component={AfterTransaction} />

        {/* OLD ENDPOINTS: UNUSED */}
        {/* <Route path="/video" component={VideoPage} /> */}
        {/* <Route path="/stream" component={StreamPage} /> */}
        {/* <Route path="/tag" component={TagPage} /> */}
        {/* <Route path="/streaming" component={Streaming} /> */}
        {/* <Route path="/schedule" component={Schedule} /> */}
      </Switch>
    </Grommet>
  );
}

export default () => (
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
