import { Env, EnvValue } from "../env";

const commonHost = "https://swapi.dev";

export const SWAPI_HOST: EnvValue<string> = {
  [Env.Dev]: commonHost,
  [Env.QA]: commonHost,
  [Env.Stage]: commonHost,
  [Env.Prod]: commonHost,
};