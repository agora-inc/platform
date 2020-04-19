import React from "react";
import { BrowserRouter, Route } from "react-router-dom";
import { Grommet } from "grommet";
import Home from "./Views/Home";
import Channel from "./Views/Channel";
import VideoPage from "./Views/VideoPage";
import TagPage from "./Views/TagPage";
import Streaming from "./Views/Streaming";
import HeaderBar from "./Components/HeaderBar";
import { theme } from "./theme";
import { UserService } from "./Services/UserService";

function App() {
  return (
    <BrowserRouter>
      <Grommet theme={theme} full>
        <HeaderBar />
        <Route exact path="/" component={Home} />
        <Route path="/videos" component={VideoPage} />
        <Route path="/channel" component={Channel} />
        <Route path="/tag" component={TagPage} />
        <Route path="/stream" component={Streaming} />
      </Grommet>
    </BrowserRouter>
  );
}

export default App;
