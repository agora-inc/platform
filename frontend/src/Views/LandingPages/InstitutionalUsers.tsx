import React, { Component } from "react";
import { Link, RouteComponentProps } from "react-router-dom";

import "../../Styles/institutional-users-logo.css"


import Imperial from "../../assets/institutional_users_logo/imperial.png"
import Oxford from "../../assets/institutional_users_logo/oxford.png"
import CambridgeLogo from "../../assets/institutional_users_logo/cambridge.png"
import LseLogo from "../../assets/institutional_users_logo/lse-logo.png"
import EthLogo from "../../assets/institutional_users_logo/eth.png"
import Epfl from "../../assets/institutional_users_logo/epfl.png"
import Harvard from "../../assets/institutional_users_logo/harvard.png"
import EcolePolytechnique from "../../assets/institutional_users_logo/ecole_polytechnique_paris.png"


import { Box } from "grommet";


interface Props {
  width?: string;
}

interface State {
  width: string;
  gap: string;
  renderMobileView: boolean;
}

  
  export default class InstitutionalUsers extends Component<Props, State> {
    constructor(props: any) {
      super(props);
      this.state = {
        width: "100px",
        gap: "60px",
        renderMobileView: (window.innerWidth < 1200),
      }
    }

    render() {
        return(
          <>
            {/* Desktop: 4x2 */}
            {!this.state.renderMobileView! && (
              <Box direction="column">
              {/* First line */}
              <Box direction="row" gap={this.state.gap}>
                <Box height={this.state.width} width={this.state.width}>
                  <img src={Imperial} className="institutional-logo"/>
                </Box>

                <Box height={this.state.width} width={this.state.width}>
                  <img src={Oxford} className="institutional-logo"/>
                </Box>

                <Box height={this.state.width} width={this.state.width}>
                  <img src={EthLogo} className="institutional-logo"/>
                </Box>
                <Box height={this.state.width} width={this.state.width}>
                  <img src={LseLogo} className="institutional-logo"/>
                </Box>
              </Box>
              {/* Second line */}
              <Box direction="row" gap={this.state.gap}>
                <Box height={this.state.width} width={this.state.width}>
                  <img src={CambridgeLogo} className="institutional-logo"/>
                </Box>

                <Box height={this.state.width} width={this.state.width}>
                  <img src={Harvard} className="institutional-logo"/>
                </Box>

                <Box height={this.state.width} width={this.state.width}>
                  <img src={Epfl} className="institutional-logo"/>
                </Box>
                
                <Box height={this.state.width} width={this.state.width}>
                  <img src={EcolePolytechnique} className="institutional-logo"/>
                </Box>
                
              </Box>
            </Box>
            )}

          {/* Mobile: 2x4 */}
          {this.state.renderMobileView && (
              <Box direction="column" gap="small" alignSelf={this.state.renderMobileView ? "center" : "start"}>
                {/* First line */}
                <Box direction="row" gap={this.state.gap}>
                  <Box height={this.state.width} width={this.state.width}>
                    <img src={Imperial} className="institutional-logo"/>
                  </Box>

                  <Box height={this.state.width} width={this.state.width}>
                    <img src={Oxford} className="institutional-logo"/>
                  </Box>
                </Box>

                {/* SEcondline */}
                <Box direction="row" gap={this.state.gap}>
                  <Box height={this.state.width} width={this.state.width}>
                    <img src={EthLogo} className="institutional-logo"/>
                  </Box>
                  <Box height={this.state.width} width={this.state.width}>
                    <img src={LseLogo} className="institutional-logo"/>
                  </Box>
                </Box>

                {/* Third line */}
                <Box direction="row" gap={this.state.gap}>
                  <Box height={this.state.width} width={this.state.width}>
                    <img src={CambridgeLogo} className="institutional-logo"/>
                  </Box>

                  <Box height={this.state.width} width={this.state.width}>
                    <img src={Harvard} className="institutional-logo"/>
                  </Box>
                </Box>

                {/* Forth line */}
                <Box direction="row" gap={this.state.gap}>
                  <Box height={this.state.width} width={this.state.width}>
                    <img src={Epfl} className="institutional-logo"/>
                  </Box>
                
                  <Box height={this.state.width} width={this.state.width}>
                    <img src={EcolePolytechnique} className="institutional-logo"/>
                  </Box>
              </Box>
            </Box>
            )}



          </>
        )
    }
}