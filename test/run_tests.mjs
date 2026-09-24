import pg from "pg";
import assert from "assert";

const { Pool } = pg;

const DATABASE_URL = process.env.DATABASE_URL || "postgres://rckl_admin:RcklDiRaja2026!SecureDb@rckldiraja-db.c1aq20w2ajsr.ap-southeast-1.rds.amazonaws.com:5432/rckldiraja";

async function runTestSuite() {
  console.log("=== STARTING COMPREHENSIVE AUTOMATED VERIFICATION SUITE ===\n");
  let passed = 0;
  let failed = 0;

  function recordPass(testName) {
    console.log(`[PASS] ${testName}`);
    passed++;
  }

  function recordFail(testName, err) {
    console.error(`[FAIL] ${testName}:`, err.message);
    failed++;
  }

  // TEST 1: Database Connection & SSL
  console.log("--- 1. DATABASE CONNECTIVITY ---");
  const pool = new Pool({
    connectionString: DATABASE_URL,
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 10000
  });

  try {
    const res = await pool.query("SELECT NOW() as current_time, current_database() as db_name, version();");
    assert.strictEqual(res.rows[0].db_name, "rckldiraja");
    recordPass(`Connected to AWS RDS PostgreSQL: ${res.rows[0].db_name} (version: ${res.rows[0].version.split(" ")[0]} ${res.rows[0].version.split(" ")[1]})`);
  } catch (err) {
    recordFail("Database connection failed", err);
  }

  // TEST 2: Schema Integrity
  console.log("\n--- 2. SCHEMA INTEGRITY ---");
  try {
    const res = await pool.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'projects' 
      ORDER BY ordinal_position;
    `);
    const cols = res.rows.map(r => r.column_name);
    assert(cols.includes("id"), "Missing id column");
    assert(cols.includes("title"), "Missing title column");
    assert(cols.includes("category"), "Missing category column");
    assert(cols.includes("approvals"), "Missing approvals column");
    assert(cols.includes("quotations"), "Missing quotations column");
    assert(cols.includes("invoices"), "Missing invoices column");
    recordPass(`Table 'projects' verified with ${cols.length} columns`);
  } catch (err) {
    recordFail("Schema integrity test failed", err);
  }

  // TEST 3: Real Database CRUD Cycle
  console.log("\n--- 3. DATABASE CRUD EXECUTION ---");
  const testId = `audit-test-${Date.now()}`;
  try {
    // CREATE
    await pool.query(
      `INSERT INTO projects (id, title, category, year, status, funds_requested, proposer, email)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8);`,
      [testId, "Audit Verification Project", "Community Service", "2025-2026", "Draft", 1000, "Automated Test", "test@rckl.org"]
    );
    recordPass("C - CREATE: Test project inserted successfully");

    // READ
    const readRes = await pool.query("SELECT * FROM projects WHERE id = $1;", [testId]);
    assert.strictEqual(readRes.rows.length, 1);
    assert.strictEqual(readRes.rows[0].title, "Audit Verification Project");
    recordPass("R - READ: Test project retrieved and verified");

    // UPDATE
    await pool.query(
      "UPDATE projects SET status = $1, funds_requested = $2 WHERE id = $3;",
      ["Approved", 2500, testId]
    );
    const updateRes = await pool.query("SELECT status, funds_requested FROM projects WHERE id = $1;", [testId]);
    assert.strictEqual(updateRes.rows[0].status, "Approved");
    assert.strictEqual(Number(updateRes.rows[0].funds_requested), 2500);
    recordPass("U - UPDATE: Test project updated and verified");

    // DELETE
    await pool.query("DELETE FROM projects WHERE id = $1;", [testId]);
    const deleteRes = await pool.query("SELECT * FROM projects WHERE id = $1;", [testId]);
    assert.strictEqual(deleteRes.rows.length, 0);
    recordPass("D - DELETE: Test project deleted and verified absent");
  } catch (err) {
    recordFail("CRUD execution cycle failed", err);
  }

  // TEST 4: Zero Demo Projects Check
  console.log("\n--- 4. ZERO DEMO PROJECTS CHECK ---");
  try {
    const res = await pool.query("SELECT id, title FROM projects WHERE id IN ('101', '102', '103', '104', '105');");
    assert.strictEqual(res.rows.length, 0, "Demo projects found in database!");
    recordPass("No demo projects (IDs 101-105) exist in the PostgreSQL database");
  } catch (err) {
    recordFail("Zero demo projects check failed", err);
  }

  // TEST 5: Member Directory & KLRCF Role Verification
  console.log("\n--- 5. DIRECTORY & ROLE INTEGRITY ---");
  try {
    const fs = await import("fs");
    const pageContent = fs.readFileSync("src/app/page.tsx", "utf-8");

    // Check Ajmal Khan as KLRCF treasurer
    assert(pageContent.includes("Ajmal Khan"), "Ajmal Khan must be present in source");
    assert(!pageContent.includes("Rayner"), "Tan Sri Rayner should not be present as treasurer");
    recordPass("KLRCF Treasurer verified as Ajmal Khan (Tan Sri Rayner removed)");

    // Check directory members from club_directory.json
    const clubJson = JSON.parse(fs.readFileSync("src/data/club_directory.json", "utf-8"));
    assert(clubJson.members && clubJson.members.length >= 90, `Expected at least 90 members, found ${clubJson.members ? clubJson.members.length : 0}`);
    assert(clubJson.past_presidents && clubJson.past_presidents.length >= 90, `Expected at least 90 past presidents, found ${clubJson.past_presidents ? clubJson.past_presidents.length : 0}`);
    recordPass(`Member directory verified: ${clubJson.members.length} active Rotarians, ${clubJson.past_presidents.length} Past Presidents loaded into clubData`);
  } catch (err) {
    recordFail("Directory & role integrity test failed", err);
  }

  // TEST 6: Localhost / Temporary URL Check
  console.log("\n--- 6. PRODUCTION PURITY AUDIT ---");
  try {
    const fs = await import("fs");
    const pageContent = fs.readFileSync("src/app/page.tsx", "utf-8");
    assert(!pageContent.includes("localhost"), "Found localhost in src/app/page.tsx");
    assert(!pageContent.includes("127.0.0.1"), "Found 127.0.0.1 in src/app/page.tsx");
    recordPass("No localhost or 127.0.0.1 references found in main app source");
  } catch (err) {
    recordFail("Production purity check failed", err);
  }

  await pool.end();

  console.log("\n==================================================");
  console.log(`TEST SUMMARY: ${passed} PASSED, ${failed} FAILED`);
  console.log("==================================================");

  if (failed > 0) {
    process.exit(1);
  }
}

runTestSuite().catch(err => {
  console.error("Fatal test runner error:", err);
  process.exit(1);
});
