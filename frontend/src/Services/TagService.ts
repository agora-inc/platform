import axios from "axios";
import { baseApiUrl } from "../config";
import { get, post } from "../Middleware/httpMiddleware";

const getAll = (callback: any) => {
  get("tags/all", "", callback);
};

const getPopular = (callback: any) => {
  get("tags/popular?n=5", "", callback);
};

const createTag = (tagName: string, callback: any, token: string) => {
  post("tags/add", { name: tagName }, token, callback);
};

export const TagService = {
  getAll,
  getPopular,
  createTag,
};

export type Tag = {
  id: number;
  name: string;
};
