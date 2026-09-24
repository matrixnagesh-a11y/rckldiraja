import { Pool } from "pg";

let pool: Pool | null = null;

export function getDbPool(): Pool | null {
  const defaultUrl = "postgres://rckl_admin:RcklDiRaja2026!SecureDb@rckldiraja-db.c1aq20w2ajsr.ap-southeast-1.rds.amazonaws.com:5432/rckldiraja";
  const connectionString = process.env.DATABASE_URL || defaultUrl;
  if (!connectionString) {
    return null;
  }
  if (!pool) {
    pool = new Pool({
      connectionString,
      ssl: {
        rejectUnauthorized: false
      },
      max: 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 5000
    });
  }
  return pool;
}

export async function initProjectsTable() {
  const p = getDbPool();
  if (!p) return;
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS projects (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      category TEXT,
      year TEXT,
      status TEXT,
      approval_status TEXT,
      scale TEXT,
      funds_requested NUMERIC,
      location TEXT,
      beneficiaries TEXT,
      funding_sources TEXT,
      objective TEXT,
      milestones TEXT,
      proposer TEXT,
      email TEXT,
      lead TEXT,
      sub_project TEXT,
      joint_project TEXT,
      start_date TEXT,
      duration TEXT,
      funds_timeline TEXT,
      quotations JSONB DEFAULT '[]'::jsonb,
      invoices JSONB DEFAULT '[]'::jsonb,
      impact_details TEXT,
      rotary_responsibilities TEXT,
      areas_of_focus JSONB DEFAULT '[]'::jsonb,
      approvals JSONB DEFAULT '{}'::jsonb,
      request_date TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    );
  `;
  try {
    await p.query(createTableQuery);
  } catch (err) {
    console.error("Failed to initialize projects table:", err);
  }
}
