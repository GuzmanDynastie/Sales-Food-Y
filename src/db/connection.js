import pkg from "pg";
import fs from "fs";

// process.loadEnvFile();
dotenv.config();
const { Pool } = pkg;

const {
  MASTER_DB_HOST,
  MASTER_DB_PORT,
  MASTER_DB_DATABASE,
  MASTER_DB_USERNAME,
  MASTER_DB_PASSWORD,
  // MASTER_DB_CERTIFICATION,
} = process.env;

if (
  !MASTER_DB_HOST ||
  !MASTER_DB_PORT ||
  !MASTER_DB_DATABASE ||
  !MASTER_DB_USERNAME ||
  !MASTER_DB_PASSWORD 
  // !MASTER_DB_CERTIFICATION
) {
  throw new Error(
    "Missing required environment variables for database connection"
  );
}

const ca = fs.readFileSync(MASTER_DB_CERTIFICATION).toString();

export const master = new Pool({
  user: MASTER_DB_USERNAME,
  host: MASTER_DB_HOST,
  database: MASTER_DB_DATABASE,
  password: MASTER_DB_PASSWORD,
  port: Number(MASTER_DB_PORT),
  ssl: {
    rejectUnauthorized: false,
    // ca: ca,
  },
});
