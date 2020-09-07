import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Identicon } from "react-identicons";

import { Channel, ChannelService } from "../Services/ChannelService";
import "../Styles/all-agoras-page.css";

const AllAgorasPage = () => {
  const [agoras, setAgoras] = useState<Channel[]>([]);

  useEffect(() => {
    ChannelService.getAllChannels(100, 0, setAgoras);
  }, []);

  return (
    <div className="all-agoras-page">
      <span className="all-agoras-title">All agoras</span>
      <div className="all-agoras-grid">
        {agoras.map((agora) => (
          <Link className="agora-card" to={`/${agora.name}`}>
            <div
              className="agora-card-banner"
              style={{ background: agora.colour }}
            >
              {agora.has_cover && (
                <img
                  src={ChannelService.getCover(agora.id)}
                  width={420}
                  height={140}
                />
              )}
            </div>
            <div className="avatar-and-name">
              <div className="agora-card-avatar">
                <img
                  src={ChannelService.getAvatar(agora.id)}
                  height={30}
                  width={30}
                />
              </div>
              <span className="agora-card-name">{agora.name}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default AllAgorasPage;
