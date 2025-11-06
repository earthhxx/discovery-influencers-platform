// ✅ discovery-influencers-platform/src/lib/db.ts
import { Pool } from "pg";

let pool_Main: Pool | null = null;
let pool_Secondary: Pool | null = null;

// ✅ ฟังก์ชันตรวจค่าที่จำเป็นใน .env
const requiredEnv = (name: string): string => {
  const value = process.env[name];
  if (!value) throw new Error(`❌ Missing environment variable: ${name}`);
  return value;
};

// ✅ เชื่อมต่อ Database หลัก
export const getMainConnection = async () => {
  if (pool_Main) return pool_Main;

  pool_Main = new Pool({
    user: requiredEnv("DB_USERNAME"),
    host: requiredEnv("DB_HOST"),
    database: requiredEnv("DB_DATABASE"),
    password: requiredEnv("DB_PASSWORD"),
    port: Number(process.env.DB_PORT) || 5432,
  });

  console.log("✅ Connected to Main PostgreSQL Database");
  return pool_Main;
};

// ✅ เชื่อมต่อ Database สำรอง (อีก instance)
export const getSecondaryConnection = async () => {
  if (pool_Secondary) return pool_Secondary;

  pool_Secondary = new Pool({
    user: requiredEnv("DB_2_USER"),
    host: requiredEnv("DB_2_HOST"),
    database: requiredEnv("DB_2_NAME"),
    password: requiredEnv("DB_2_PASSWORD"),
    port: Number(process.env.DB_2_PORT) || 5432,
  });

  console.log("✅ Connected to Secondary PostgreSQL Database");
  return pool_Secondary;
};
