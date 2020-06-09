import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { Grommet } from "grommet";
import Home from "./Views/Home";
import ChannelPage from "./Views/ChannelPage";
import VideoPage from "./Views/VideoPage";
import StreamPage from "./Views/StreamPage";
import TagPage from "./Views/TagPage";
import Streaming from "./Views/Streaming";
import AllVideosPage from "./Views/AllVideosPage";
import HeaderBar from "./Components/HeaderBar";
import { theme } from "./theme";
import ManageChannelPage from "./Views/ManageChannelPage";
import Preferences from "./Views/Preferences";
import Schedule from "./Views/Schedule";
import AllUpcomingTalksPage from "./Views/AllUpcomingTalksPage";
import AllPastTalksPage from "./Views/AllPastTalksPage";

function App() {
  return (
    <BrowserRouter>
      <Grommet theme={theme} full>
        <HeaderBar />
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/videos" component={AllVideosPage} />
          <Route path="/video" component={VideoPage} />
          <Route path="/stream" component={StreamPage} />
          {/* <Route exact path={`/channel/:name`} component={ChannelPage} /> */}
          <Route path={`/:name/manage`} component={ManageChannelPage} />
          <Route path="/tag" component={TagPage} />
          <Route path="/streaming" component={Streaming} />
          <Route path="/preferences" component={Preferences} />
          <Route path="/schedule" component={Schedule} />
          <Route path="/upcoming" component={AllUpcomingTalksPage} />
          <Route path="/past" component={AllPastTalksPage} />
          <Route path="*" component={ChannelPage} />
        </Switch>
      </Grommet>
    </BrowserRouter>
  );
}

export default App;
