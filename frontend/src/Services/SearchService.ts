import { baseApiUrl } from "../config";
import axios from "axios";

const search = (objectTypes: string[], searchString: string, callback: any) => {
  axios
    .post(
      baseApiUrl + "/search",
      {
        objectTypes: objectTypes,
        searchString: searchString,
      },
      { headers: { "Access-Control-Allow-Origin": "*" } }
    )
    .then(function (response) {
      callback(response.data);
    });
  // .catch(function (error) {
  //   callback(false);
  // });
};

export const SearchService = {
  search,
};
