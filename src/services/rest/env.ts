/**
 * Represents the environment to use for REST service calls
 */
export enum Env {
  Dev = "dev",
  QA = "qa",
  Stage = "stg",
  Prod = "prod",
}

export type EnvValue<Type> = Record<Env, Type>;
