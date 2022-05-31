import { Env } from "../../env";
import ApiError from "../../error";
import { SWAPI_HOST } from "../constants";
import { PaginatedResponse, StarWarsPersonResponse } from "../model";

export interface ReadOptions {
  page?: number
}

/**
 * API call that gets a list of Star Wars characters,
 * broken up into pages.
 *
 * Endpoint: `swapi.<env>/api/people/?page=X`
 */
const read = async (
  env: Env,
  options?: ReadOptions,
): Promise<PaginatedResponse<StarWarsPersonResponse>> => {
  const { page = 1 } = options ?? {};
  const url = `${SWAPI_HOST[env]}/api/people/?page=${page}`;
  const response = await fetch(url);
  const { ok } = response;
  if (!ok) {
    throw new ApiError(response);
  }
  return response.json() as Promise<PaginatedResponse<StarWarsPersonResponse>>;
};

const people = (env: Env) => ({
  read: (options?: ReadOptions) => read(env, options)
});

export type PeopleEndpoint = ReturnType<typeof people>;

export default people;
