import axios from "axios";
import { baseApiUrl } from "../config";

const getAll = (callback: any) => {
  axios
    .get(baseApiUrl + "/tags/all", {
      headers: { "Access-Control-Allow-Origin": "*" },
    })
    .then((response) => {
      callback(response.data);
    });
};

const getPopular = (callback: any) => {
  axios
    .get(baseApiUrl + "/tags/popular?n=5", {
      headers: { "Access-Control-Allow-Origin": "*" },
    })
    .then((response) => {
      callback(response.data);
    });
};

const createTag = (tagName: string, callback: any) => {
  axios
    .post(
      baseApiUrl + "/tags/add",
      { name: tagName },
      { headers: { "Access-Control-Allow-Origin": "*" } }
    )
    .then((response) => {
      callback(response.data);
    });
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
