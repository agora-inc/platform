import axios from "axios";
import { baseApiUrl } from "../config";

const getAll = (callback: any) => {
  axios
    .get(baseApiUrl + "/topics/all", {
      headers: { "Access-Control-Allow-Origin": "*" },
    })
    .then((response) => {
      callback(response.data);
    });
};

const getTreeStructure = (callback: any) => {
  axios
    .get(baseApiUrl + "/topics/treestructure", {
      headers: { "Access-Control-Allow-Origin": "*" },
    })
    .then((response) => {
      callback(response.data);
    });
};

// const getPopular = (callback: any) => {
//   axios
//     .get(baseApiUrl + "/topics/popular?n=5", {
//       headers: { "Access-Control-Allow-Origin": "*" },
//     })
//     .then((response) => {
//       callback(response.data);
//     });
// };

// const createTag = (tagName: string, callback: any) => {
//   axios
//     .post(
//       baseApiUrl + "/tags/add",
//       { name: tagName },
//       { headers: { "Access-Control-Allow-Origin": "*" } }
//     )
//     .then((response) => {
//       callback(response.data);
//     });
// };

export const TopicService = {
  getAll,
  getTreeStructure
};

export type Topic = {
  field: string,
  is_primitive_node: boolean, 
  id: number,
  parent_1_id: number | null, 
  parent_2_id: number | null,
  parent_3_id: number | null,
}

export type TreeTopic = {
  name: string;
  attribute: any
  children: any
};
