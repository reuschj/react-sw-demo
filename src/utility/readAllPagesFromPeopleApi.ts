import { StarWarsPerson, transformPersonResponse } from "../model";
import { ApiError, Env } from "../services";
import getSwApi from "../services/rest/swapi";
import { mockApiCall } from "../test/common";

/**
 * Utility function that call all pages of the swapi API people
 * endpoint until there are no further pages.
 * 
 * Note that this does not return anything. Rather provides a callback.
 * The `onNewDataCallback` will provide each page of data as available.
 *
 * @param env 
 * @param options 
 */
const readAllPagesFromPeopleApi = async (
  env: Env,
  options?: {
    useMockApi?: boolean,
    onNewDataCallback?: (results: StarWarsPerson[]) => void
    onErrorCallback?: (e: Error) => void;
    pageLimit?: number;
  },
) => {
  const {
    useMockApi,
    onNewDataCallback,
    onErrorCallback,
    pageLimit = Number.POSITIVE_INFINITY,
  } = options ?? {};
  let page = 1;
  let isNext = true;
  while (isNext && page <= pageLimit) {
    try {
      const { next, results } = useMockApi
        ? await mockApiCall({ page })
        : await getSwApi(env).api.people.read({ page });
      const newPageOfPeople = results.map(
        (person) => transformPersonResponse(person)
      );
      if (onNewDataCallback) onNewDataCallback(newPageOfPeople);
      isNext = next !== null;
      page += 1;
    } catch (e) {
      if (e instanceof ApiError && e.isNotFound) {
        isNext = false;
        break;
      }
      if (onErrorCallback) onErrorCallback(e as Error);
    }
  }
};

export default readAllPagesFromPeopleApi;
