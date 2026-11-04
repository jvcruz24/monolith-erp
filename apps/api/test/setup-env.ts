import { config } from "dotenv";

config({ path: "../../.env" });
process.env.DATABASE_URL = process.env.TEST_DATABASE_URL;
