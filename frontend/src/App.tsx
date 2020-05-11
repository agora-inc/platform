import React from "react";
import { BrowserRouter, Route } from "react-router-dom";
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
import { UserService } from "./Services/UserService";
import ManageChannelPage from "./Views/ManageChannelPage";

function App() {
  return (
    <BrowserRouter>
      <Grommet theme={theme} full>
        <HeaderBar />
        <Route exact path="/" component={Home} />
        <Route exact path="/videos" component={AllVideosPage} />
        <Route path="/video" component={VideoPage} />
        <Route path="/stream" component={StreamPage} />
        <Route exact path={`/channel/:name`} component={ChannelPage} />
        <Route path={`/channel/:name/manage`} component={ManageChannelPage} />
        <Route path="/tag" component={TagPage} />
        <Route path="/streaming" component={Streaming} />
      </Grommet>
    </BrowserRouter>
  );
}

export default App;
