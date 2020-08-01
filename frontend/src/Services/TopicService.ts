import { get } from "../Middleware/httpMiddleware";

const getAll = (callback: any) => {
  get("topics/all", callback);
};

const getDataTreeStructure = (callback: any) => {
  get("topics/treestructure", callback);
};

const getDescendenceId = (node: Topic, topics: Topic[]): number[] => {
  let res: number[] = [];
  for (let topic of topics) {
    if (
      topic.parent_1_id === node.id ||
      topic.parent_1_id === node.id ||
      topic.parent_1_id === node.id
    ) {
      res.push(topic.id);
      res = res.concat(getDescendenceId(topic, topics));
    }
  }
  return res;
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
  getDataTreeStructure,
  getDescendenceId,
};

export type Topic = {
  field: string;
  is_primitive_node: boolean;
  id: number;
  parent_1_id: number | null;
  parent_2_id: number | null;
  parent_3_id: number | null;
};

export type TreeTopic = {
  name: string;
  attribute: any;
  children: any;
};
