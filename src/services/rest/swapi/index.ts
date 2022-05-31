import { Env } from "../env";
import { people } from "./api";
import SwApi from "./model";

export * from "./constants";
export * from "./model";
export type { default as SwApi } from "./model";

/**
 * Gets the swapi API structure with all supported endpoints
 * @param env - Specifies which environment of the API to call
 * @returns The swapi API structure with all supported endpoints
 */
const getSwApi = (env: Env): SwApi => ({
  api: {
    people: people(env),
  },
});

export default getSwApi;
