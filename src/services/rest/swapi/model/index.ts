import { PeopleEndpoint } from "../api";
import { PaginatedResponse, StarWarsPersonResponse } from "./responses";

export * from "./responses";

interface SwApi {
  api: {
    people: PeopleEndpoint;
  };
}

export default SwApi;
