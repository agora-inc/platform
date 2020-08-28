import React, { useState, useEffect } from "react";
import Identicon from "react-identicons";

import { User, UserService } from "../Services/UserService";
import "../Styles/all-speakers-page.css";

const AllSpeakersPage = () => {
  const [speakers, setSpeakers] = useState<any[]>([]);

  useEffect(() => {
    UserService.getAllPublicUsers(setSpeakers);
  });

  return (
    <div className="all-speakers-page">
      <span className="all-speakers-title">Speakers</span>
      <div className="all-speakers-grid">
        {speakers.map((speaker) => (
          <div className="speaker-card">
            <div className="speaker-card-header">
              <div className="speaker-avatar-and-name">
                <div className="speaker-avatar">
                  <Identicon string={speaker.username} size={30} />
                </div>
                <span className="speaker-name">{speaker.username}</span>
              </div>
              {speaker.email && (
                <a href={`mailto:${speaker.email}`} className="speaker-email">
                  email
                </a>
              )}
            </div>
            <div className="speaker-content">
              <span className="speaker-bio">{speaker.bio}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllSpeakersPage;
