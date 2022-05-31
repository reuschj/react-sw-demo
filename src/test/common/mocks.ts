import { ApiError, Env, PaginatedResponse, SWAPI_HOST, StarWarsPersonResponse } from "../../services";
import { ReadOptions } from "../../services/rest/swapi/api/people";
import page1 from "../fixtures/api.people.get.200.success-1.json";
import page2 from "../fixtures/api.people.get.200.success-2.json";
import page3 from "../fixtures/api.people.get.200.success-3.json";
import page4 from "../fixtures/api.people.get.200.success-4.json";
import page5 from "../fixtures/api.people.get.200.success-5.json";
import page6 from "../fixtures/api.people.get.200.success-6.json";
import page7 from "../fixtures/api.people.get.200.success-7.json";
import page8 from "../fixtures/api.people.get.200.success-8.json";
import page9 from "../fixtures/api.people.get.200.success-9.json";
import notFound from "../fixtures/api.people.get.404.notFound.json";


const responses = new Map<number, PaginatedResponse<StarWarsPersonResponse>>([
  [1, page1],
  [2, page2],
  [3, page3],
  [4, page4],
  [5, page5],
  [6, page6],
  [7, page7],
  [8, page8],
  [9, page9],
]);

const buildMockResponseFor = (page: number): Response => {
  const data = responses.get(page);
  const ok = typeof data !== "undefined";
  return {
    ok,
    url: `${SWAPI_HOST[Env.Dev]}/api/people/?page=${page}`,
    status: ok ? 200 : 404,
    statusText: ok ? "OK" : "NOT FOUND",
    json: () => new Promise((resolve) => {
      setTimeout(() => {
        resolve(ok ? data : notFound);
      }, 2);
    }),
  } as Response;
};

const makeMockedAsyncCallFor = (page: number, latency: number = 200): Promise<Response> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(buildMockResponseFor(page));
    }, latency)
  });
};

export const mockApiCall = async (options?: ReadOptions): Promise<PaginatedResponse<StarWarsPersonResponse>> => {
  const { page = 1 } = options ?? {};
  const response = await makeMockedAsyncCallFor(page);
  const { ok, status, statusText, url } = response;
  const logger = ok ? console.log : console.warn;
  logger(`MOCK response from ${url}: ${status}: ${statusText}`, response);
  if (!ok) {
    throw new ApiError(response);
  }
  return response.json() as Promise<PaginatedResponse<StarWarsPersonResponse>>;
};