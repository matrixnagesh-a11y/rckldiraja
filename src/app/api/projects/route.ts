import { NextRequest, NextResponse } from "next/server";
import { getDbPool, initProjectsTable } from "@/lib/db";

// In-memory fallback if database connection is pending
let memoryProjects: any[] = [];

export async function GET() {
  const pool = getDbPool();
  if (!pool) {
    return NextResponse.json({ projects: memoryProjects, source: "memory_fallback" });
  }

  try {
    await initProjectsTable();
    const result = await pool.query("SELECT * FROM projects ORDER BY created_at DESC");
    const formatted = result.rows.map((r) => ({
      ...r,
      quotations: typeof r.quotations === "string" ? JSON.parse(r.quotations) : r.quotations || [],
      invoices: typeof r.invoices === "string" ? JSON.parse(r.invoices) : r.invoices || [],
      areas_of_focus: typeof r.areas_of_focus === "string" ? JSON.parse(r.areas_of_focus) : r.areas_of_focus || [],
      approvals: typeof r.approvals === "string" ? JSON.parse(r.approvals) : r.approvals || {}
    }));
    return NextResponse.json({ projects: formatted, source: "postgres" });
  } catch (err: any) {
    console.error("GET /api/projects error:", err);
    return NextResponse.json({ projects: memoryProjects, error: err.message, source: "memory_fallback" });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const pool = getDbPool();

    const id = body.id ? String(body.id) : `PRJ-${Date.now()}`;
    const newProject = { ...body, id };

    if (!pool) {
      memoryProjects = [newProject, ...memoryProjects.filter((p) => p.id !== id)];
      return NextResponse.json({ project: newProject, source: "memory_fallback" });
    }

    await initProjectsTable();

    const insertQuery = `
      INSERT INTO projects (
        id, title, category, year, status, approval_status, scale, funds_requested,
        location, beneficiaries, funding_sources, objective, milestones, proposer,
        email, lead, sub_project, joint_project, start_date, duration, funds_timeline,
        quotations, invoices, impact_details, rotary_responsibilities, areas_of_focus,
        approvals, request_date, created_at, updated_at
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8,
        $9, $10, $11, $12, $13, $14,
        $15, $16, $17, $18, $19, $20, $21,
        $22, $23, $24, $25, $26,
        $27, $28, NOW(), NOW()
      )
      ON CONFLICT (id) DO UPDATE SET
        title = EXCLUDED.title,
        status = EXCLUDED.status,
        approval_status = EXCLUDED.approval_status,
        scale = EXCLUDED.scale,
        funds_requested = EXCLUDED.funds_requested,
        objective = EXCLUDED.objective,
        milestones = EXCLUDED.milestones,
        quotations = EXCLUDED.quotations,
        invoices = EXCLUDED.invoices,
        impact_details = EXCLUDED.impact_details,
        approvals = EXCLUDED.approvals,
        updated_at = NOW()
      RETURNING *;
    `;

    const values = [
      id,
      body.title || "Untitled Project",
      body.category || "Community Service",
      body.year || "RY 2025/26",
      body.status || "Pending Committee Review",
      body.approval_status || "Pending Committee Review",
      body.scale || "RM 0",
      Number(body.funds_requested || 0),
      body.location || "Kuala Lumpur",
      body.beneficiaries || "Community",
      body.funding_sources || "Club Funds",
      body.objective || "",
      body.milestones || "",
      body.proposer || "Rotary Member",
      body.email || "",
      body.lead || body.proposer || "",
      body.sub_project || "",
      body.joint_project || "",
      body.start_date || "",
      body.duration || "1 Year",
      body.funds_timeline || "",
      JSON.stringify(body.quotations || []),
      JSON.stringify(body.invoices || []),
      body.impact_details || "",
      body.rotary_responsibilities || "",
      JSON.stringify(body.areas_of_focus || []),
      JSON.stringify(body.approvals || {}),
      body.request_date || new Date().toLocaleDateString("en-GB")
    ];

    const result = await pool.query(insertQuery, values);
    return NextResponse.json({ project: result.rows[0], source: "postgres" });
  } catch (err: any) {
    console.error("POST /api/projects error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const pool = getDbPool();

    if (!body.id) {
      return NextResponse.json({ error: "Missing project id" }, { status: 400 });
    }

    const id = String(body.id);

    if (!pool) {
      memoryProjects = memoryProjects.map((p) => (p.id === id ? { ...p, ...body } : p));
      return NextResponse.json({ project: body, source: "memory_fallback" });
    }

    await initProjectsTable();

    const updateQuery = `
      UPDATE projects SET
        title = COALESCE($2, title),
        status = COALESCE($3, status),
        approval_status = COALESCE($4, approval_status),
        scale = COALESCE($5, scale),
        approvals = COALESCE($6, approvals),
        updated_at = NOW()
      WHERE id = $1
      RETURNING *;
    `;

    const values = [
      id,
      body.title,
      body.status,
      body.approval_status || body.status,
      body.scale,
      body.approvals ? JSON.stringify(body.approvals) : null
    ];

    const result = await pool.query(updateQuery, values);
    return NextResponse.json({ project: result.rows[0], source: "postgres" });
  } catch (err: any) {
    console.error("PUT /api/projects error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "Missing project id" }, { status: 400 });
    }

    const pool = getDbPool();
    if (!pool) {
      memoryProjects = memoryProjects.filter((p) => p.id !== id);
      return NextResponse.json({ success: true, source: "memory_fallback" });
    }

    await pool.query("DELETE FROM projects WHERE id = $1", [id]);
    return NextResponse.json({ success: true, source: "postgres" });
  } catch (err: any) {
    console.error("DELETE /api/projects error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
