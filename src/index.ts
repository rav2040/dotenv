import { resolve } from "node:path";
import { existsSync, readFileSync } from "node:fs";

const DEFAULT_ENV_PATH = "./.env";
const LINE_ENDING = /\r?\n/u;
const QUOTATION_MARK = /['"`]/;

export type EnvironmentConfig = {
  path?: string;
  encoding?: BufferEncoding;
  override?: boolean;
  parseJson?: boolean;
};

export function createEnv({ path, encoding = "utf8", override = false, parseJson = true }: EnvironmentConfig = {}) {
  const defaultPath = resolve(process.cwd(), DEFAULT_ENV_PATH);
  const skipReadFile = path === undefined && !existsSync(defaultPath);

  const file = skipReadFile ? "" : readFileSync(path ?? defaultPath, encoding);
  const entries = file
    .split(LINE_ENDING)
    .map((line) => line.split("#")[0])
    .filter(Boolean)
    .map((line) => {
      const [key, ...valueArr] = line.split("=");
      return <const>[key.trim(), valueArr.join("=").trim()];
    })
    .map<[string, string | undefined]>(([key, value]) => [
      key,
      (value.at(0)?.match(QUOTATION_MARK) && value.at(-1)?.match(QUOTATION_MARK) ? value.slice(1, -1) : value) ||
        undefined,
    ]);

  const [target, source] = [process.env, Object.fromEntries(entries)].reduce<NodeJS.ProcessEnv[]>((prev, curr) => {
    const [a, b] = override ? [prev, [curr]] : [[curr], prev];
    return a.concat(b);
  }, []);

  const env = Object.assign(target, source);

  return class Environment {
    static get<T = string>(name: string, required: true): T;
    static get<T = string>(name: string, required?: false): T | undefined;
    static get<T = string>(name: string, required = false) {
      const value = env[name];

      if (required && value === undefined) {
        throw Error(`Environment variable '${name}' is required but not set.`);
      }

      return parseJson && value !== undefined ? tryParseJson<T>(value) : value;
    }
  };
}

function tryParseJson<T>(str: string) {
  try {
    return <T>JSON.parse(str);
  } catch {
    return str;
  }
}
