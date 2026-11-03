import { execSync } from "node:child_process";
import { config } from "dotenv";

config({ path: "../../.env" });

export default function setup() {
  const testUrl = process.env.TEST_DATABASE_URL;
  if (!testUrl) {
    throw new Error("TEST_DATABASE_URL is not set");
  }
  if (testUrl === process.env.DATABASE_URL) {
    throw new Error(
      "TEST_DATABASE_URL must not point at the development database",
    );
  }
  if (!/test/i.test(new URL(testUrl).pathname)) {
    throw new Error("The test database name must contain 'test'");
  }

  execSync("pnpm exec prisma migrate deploy", {
    stdio: "inherit",
    env: { ...process.env, DATABASE_URL: testUrl },
  });
}
