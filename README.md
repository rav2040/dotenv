# @rav2040/dotenv

A non-mutating Node.js library for loading environment variables with TypeScript support.

![build](https://img.shields.io/github/workflow/status/rav2040/dotenv/unit-tests?style=for-the-badge)
![coverage](https://img.shields.io/coveralls/github/rav2040/dotenv?style=for-the-badge)
![vulnerabilities](https://img.shields.io/snyk/vulnerabilities/github/rav2040/dotenv?style=for-the-badge)
![npm](https://img.shields.io/npm/v/@rav2040/dotenv?style=for-the-badge)

## Installation

```sh
npm install -D @rav2040/dotenv
```

## Usage

With the following .env file in your project root:

```conf
FOO = "bar"
```

Create a new environment object (`process.env` will be left unchanged) by importing `createEnv`:

```js
import { createEnv } from "@rav2040/dotenv";
const Env = createEnv();
```

Variables become accessible via the following:

```js
const foo = Env.get("FOO"); // "bar"
const baz = Env.get("BAZ"); // undefined
```

You can set a variable as being required by passing `true` as the second argument:

```js
const foo = Env.get("FOO", true); // "bar"
const baz = Env.get("BAZ", true); // Throws an error
```

## JSON

Returned values will be parsed as JSON by default.

e.g. `FOO` is set to the `42`:

```ts
const foo = Env.get<number>("FOO"); // 42
console.log(typeof foo); // "number"
```

e.g. `FOO` is set to `{"hello":"world"}`:

```ts
const foo = Env.get<{ hello: string }>("FOO"); // { hello: "world" }
console.log(typeof foo); // "object"
```

## Configuration

```js
const config = {
  // ...
};
const Env = createEnv(config);
```

### `path?: string`

Path of the environment file. If not set AND `.env` does not exist in the project root then only variables from `process.env` will be loaded. Otherwise variables from `process.env` and the environment file will be merged. Defaults to `.env` in the project root.

### `encoding?: BufferEncoding`

Buffer encoding of the environment file. Defaults to `"utf8"`.

### `override?: boolean`

Variables set in the environment file will take precedence over existing environment variables when there are conflicts. Defaults to `false`.

### `parseJson?: boolean`

Values that are valid JSON will be deserialized. Defaults to `true`.

## License

[MIT](https://github.com/rav2040/dotenv/blob/master/LICENSE)
