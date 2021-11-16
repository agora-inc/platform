import { baseApiUrl } from "../config";
import axios from "axios";
import { post } from "../Middleware/httpMiddleware";
import { Topic } from "./TopicService";
import { User } from "./UserService";

const getAllPublicProfiles = (callback: any) => {

}

export type Profile = {
  user: User;
  has_photo: boolean;
  open_give_talk: boolean; 
  topics: Topic[];
  tags: string[];
  papers: string[];
  talks: string[];
  twitter_username: string
};

export const ProfileService = {
  getAllPublicProfiles,
};