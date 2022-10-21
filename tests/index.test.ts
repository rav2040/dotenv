import assert from "assert/strict";
import { writeFileSync, unlinkSync } from "fs";
import { resolve } from "node:path";
import { createEnv } from "../src";

const TEST_ENV = resolve(process.cwd(), "./tests/mocks/.test.env");

// Does not throw when path is undefined.
{
  assert.doesNotThrow(createEnv);
}

// Test property is defined and equal to the expected value with default path.
{
  const filePath = resolve(process.cwd(), ".env");
  writeFileSync(filePath, "TEST_PROPERTY=TEST_VALUE");

  const Env = createEnv();
  const testProperty = Env.get("TEST_PROPERTY");
  assert.equal(testProperty, "TEST_VALUE");

  unlinkSync(filePath);
}

// Test property is defined and equal to the expected value with custom path.
{
  const Env = createEnv({ path: TEST_ENV });
  const testProperty = Env.get("TEST_PROPERTY");
  assert.equal(testProperty, "TEST_VALUE");
}

// Test property is defined and equal to the expected value when required.
{
  const Env = createEnv({ path: TEST_ENV });
  const testProperty = Env.get("TEST_PROPERTY", true);
  assert.equal(testProperty, "TEST_VALUE");
}

// Test property is undefined.
{
  const Env = createEnv({ path: TEST_ENV });
  const testProperty = Env.get("NON_EXISTANT_TEST_PROPERTY");
  assert.equal(testProperty, undefined);
}

// Test property throws an error when not defined.
{
  const Env = createEnv({ path: TEST_ENV });
  const getTestProperty = () => Env.get("NON_EXISTANT_TEST_PROPERTY", true);
  assert.throws(getTestProperty);
}

// NODE_ENV is set to the expected value when not using override.
{
  const Env = createEnv({ path: TEST_ENV });
  const testProperty = Env.get("NODE_ENV");
  assert.equal(testProperty, "development");
}

// NODE_ENV is set to the expected value when using override.
{
  const Env = createEnv({ path: TEST_ENV, override: true });
  const testProperty = Env.get("NODE_ENV");
  assert.equal(testProperty, "test");
}
