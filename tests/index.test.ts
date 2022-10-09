import assert from "assert/strict";
import { resolve } from "node:path";
import { createEnv } from "../src";

const TEST_ENV = resolve(process.cwd(), "./tests/.test.env");

// Test property is defined and equal to the expected value.
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
