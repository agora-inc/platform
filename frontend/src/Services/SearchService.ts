import { post } from "../Middleware/httpMiddleware";

const search = (objectTypes: string[], searchString: string, callback: any) => {
  post(
    "/search",
    {
      objectTypes: objectTypes,
      searchString: searchString,
    },
    "",
    callback
  );
};

export const SearchService = {
  search,
};
