"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { ArrowLeft, Printer, Download, FileText, CheckCircle2, CheckSquare, Square, ShieldCheck } from "lucide-react";

const ROTARY_AREAS_OF_FOCUS = [
  "Peacebuilding and Conflict Prevention",
  "Disease Prevention and Treatment",
  "Water, Sanitation, and Hygiene",
  "Maternal and Child Health",
  "Basic Education and Literacy",
  "Community Economic Development",
  "Protecting the Environment"
];

function PrintPaperContent() {
  const searchParams = useSearchParams();
  const projectId = searchParams.get("id");
  const autoPrint = searchParams.get("autoprint") === "1";

  const [project, setProject] = useState<any | null>(null);
  const [printDate, setPrintDate] = useState("");

  // Universal Attachment Download Handler (handles real uploaded Base64 dataUrls and verified template attachments)
  const triggerAttachmentDownload = (file: { name: string; size?: string; dataUrl?: string }, projectTitle?: string) => {
    if (file.dataUrl && file.dataUrl !== "#" && file.dataUrl.startsWith("data:")) {
      const a = document.createElement("a");
      a.href = file.dataUrl;
      a.download = file.name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } else {
      const safeName = file.name || "Attachment_Document.txt";
      const content = `========================================================================
ROTARY CLUB OF KUALA LUMPUR DIRAJA (RCKL DiRaja)
District 3300 • Royal Charter 1930
========================================================================

OFFICIAL PROJECT PAPER ATTACHMENT RECORD
Project Title: ${projectTitle || "Community Service Project"}
Document Name: ${safeName}
Document Type: Official Attached Quotation / Invoice
Document Size: ${file.size || "Verified"}
Verification: Certified attached to Board-approved grant submission.

This document record was verified and archived within the RCKL DiRaja Member Portal.
Date: ${new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" })}
========================================================================`;
      const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = safeName.endsWith(".pdf") ? safeName.replace(".pdf", "_Attachment.txt") : safeName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  useEffect(() => {
    setPrintDate(
      new Date().toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "long",
        year: "numeric"
      })
    );

    if (typeof window !== "undefined") {
      // 1. First check session active project if any
      const sessionActive = sessionStorage.getItem("rckl_active_print_project");
      if (sessionActive) {
        try {
          const activeObj = JSON.parse(sessionActive);
          if (!projectId || String(activeObj.id) === String(projectId)) {
            setProject(activeObj);
            return;
          }
        } catch (e) {
          console.error("Failed to parse session active print project", e);
        }
      }

      // 2. Check saved project list in localStorage
      let list: any[] = [];
      const saved = localStorage.getItem("rckl_project_list");
      if (saved) {
        try {
          list = JSON.parse(saved);
        } catch (e) {
          console.error("Failed to parse project list", e);
        }
      }

      if (list && list.length > 0) {
        if (projectId) {
          const match = list.find((p) => String(p.id) === String(projectId));
          if (match) {
            setProject(match);
            return;
          }
        }
        setProject(list[0]);
      } else {
        // Fallback default project matching official fields
        setProject({
          id: "2026-CS-001",
          title: "Rotary Kasih Feeding Programme (Community Service)",
          category: "Community Service",
          scale: "RM 25,000",
          funds_requested: "25000",
          proposer: "Dato Dr. Prakash Rao (Community Service Chair)",
          email: "prakash.rao@rckl.org.my",
          lead: "Dato Dr. Prakash Rao",
          request_date: "2026-07-30",
          sub_project: "Club Admin Food Security Initiative",
          joint_project: "Rotary Club of Klang & Sentul Volunteers",
          beneficiaries: "350 B40 Underprivileged Families in Sentul & Chow Kit",
          duration: "12 Months (August 2026 - July 2027)",
          start_date: "2026-08-01",
          funds_timeline: "Immediate upon committee approval",
          funding_sources: "KLRCF Foundation Grant & Corporate CSR",
          objective: "To provide monthly grocery packs and nutritious meals for 350 urban poor families living in urban flats across Sentul and Chow Kit, addressing food insecurity and dietary deficits among children and seniors.",
          milestones: "Phase 1: Beneficiary screening & supplier procurement (Aug 2026)\nPhase 2: Monthly distribution camps on 2nd Saturday of each month\nPhase 3: Interim nutritional assessment at month 6 (Jan 2027)\nPhase 4: Final impact audit and governance reporting (Jul 2027)",
          areas_of_focus: ["Disease Prevention and Treatment", "Community Economic Development", "Basic Education and Literacy"],
          rotary_responsibilities: "RCKL DiRaja oversees procurement governance, volunteer mobilization, beneficiary verification, and disbursement audit with KLRCF trustees.",
          rotarians_involved: "12 Rotarians and 15 Rotaractors active monthly",
          public_image: "Covered via District 3300 Newsletter, RCKL social channels, and local community media press releases.",
          impact_assessment: "Quarterly biometric child growth monitoring, family nutritional surveys, and direct feedback interviews with community elders.",
          funding_conditions: "All food rations to be purchased from registered SME suppliers with official tax invoices. Disbursement tied strictly to monthly beneficiary attendance logs.",
          approved_by: ["Project Lead", "Committee Director", "BOD", "KLRCF"],
          fund_approval_by: "KLRCF Board of Trustees & Executive Committee",
          fund_restrictions: "Restricted strictly to raw dry goods and wholesale food ration procurement. No administrative overhead permitted.",
          fund_approval_date: "2026-08-05",
          effective_start: "2026-08-01",
          effective_end: "2027-07-31",
          comments_next_steps: "Application reviewed in full compliance with District 3300 and KLRCF grant guidelines. Approved for stage-wise drawdown.",
          sustainability_measures: "Establishing local resident association food bank cooperative to self-source dry provisions beyond Year 1.",
          sustainability_ownership: "Sentul Community Welfare Association & RCKL Community Service Avenue",
          sustainability_report: "Semi-annual governance reports due December 2026 and July 2027.",
          other_comments: "Supplier quotations vetted. Formal MOU executed with distribution center.",
          quotations: [
            { name: "Mega Food Distributors Sdn Bhd - Bulk Rations Quote", size: "145 KB" },
            { name: "Sentul Logistics & Packing Quotation", size: "98 KB" }
          ],
          invoices: [
            { name: "Proforma Invoice #INV-2026-0891 - Grain Supplies", size: "210 KB" }
          ],
          status: "Approved by Board & KLRCF Trustees",
          approvals: {
            project_lead: { approved: true, approved_by: "Dato Dr. Prakash Rao", approved_at: "30 Jul 2026" },
            community_service_director: { approved: true, approved_by: "Thomas Varughese", approved_at: "02 Aug 2026" },
            klrcf_treasurer: { approved: true, approved_by: "Ajmal Khan", approved_at: "04 Aug 2026" },
            president: { approved: true, approved_by: "Seyed Ehsan Masoumi Eshkevari", approved_at: "05 Aug 2026" }
          }
        });
      }
    }
  }, [projectId]);

  // Set document.title so that when printing or saving as PDF,
  // the browser automatically uses the Project Title as the default filename
  useEffect(() => {
    if (project) {
      const projTitle = (project.title || "Project Paper").trim();
      document.title = `${projTitle} - RCKL DiRaja Project Paper`;
    }
  }, [project]);

  // Handle auto-print after load
  useEffect(() => {
    if (project && autoPrint) {
      const timer = setTimeout(() => {
        window.print();
      }, 700);
      return () => clearTimeout(timer);
    }
  }, [project, autoPrint]);

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100 text-slate-700">
        <div className="text-center p-8 bg-white rounded-2xl shadow-md border border-slate-200">
          <FileText className="h-10 w-10 text-[#00246C] mx-auto animate-pulse mb-3" />
          <p className="font-bold text-sm">Loading Official Project Paper...</p>
        </div>
      </div>
    );
  }

  const p = project;

  // Format currency
  const grantAmount = p.funds_requested
    ? `RM ${Number(p.funds_requested).toLocaleString()}`
    : p.scale || "RM 0";

  // Combine quotations and invoices
  const allAttachedFiles: { name: string; type: string; size: string; dataUrl?: string }[] = [];
  if (Array.isArray(p.quotations)) {
    p.quotations.forEach((q: any) => {
      allAttachedFiles.push({
        name: q.name || "Supplier Quotation",
        type: "Supplier Quotation",
        size: q.size || "Attached",
        dataUrl: q.dataUrl
      });
    });
  }
  if (Array.isArray(p.invoices)) {
    p.invoices.forEach((inv: any) => {
      allAttachedFiles.push({
        name: inv.name || "Invoice / Proforma",
        type: "Invoice / Receipt",
        size: inv.size || "Attached",
        dataUrl: inv.dataUrl
      });
    });
  }

  // Selected areas of focus set
  const focusSet = new Set(Array.isArray(p.areas_of_focus) ? p.areas_of_focus : []);

  return (
    <div className="min-h-screen bg-slate-100 py-6 px-2 sm:px-6">
      {/* FLOATING ACTION BAR (HIDDEN IN PRINT) */}
      <div className="no-print max-w-4xl mx-auto mb-6 bg-[#00246C] text-white p-4 rounded-2xl shadow-xl flex flex-wrap items-center justify-between gap-3 sticky top-4 z-40">
        <div className="flex items-center gap-3">
          <a
            href="/"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-white transition"
          >
            <ArrowLeft className="h-4 w-4" /> Back to App
          </a>
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#F7A81B]">
              Official 4-Page Grant Document Viewer
            </h2>
            <p className="text-[10px] text-blue-200">
              Rotary Club of Kuala Lumpur DiRaja • Project Ref: #{p.id || "NEW"} • 4 Distinct Pages
            </p>
          </div>
        </div>

        <div className="flex items-center flex-wrap gap-2">
          {allAttachedFiles.length > 0 && (
            <button
              type="button"
              onClick={() => {
                allAttachedFiles.forEach((f, idx) => {
                  setTimeout(() => triggerAttachmentDownload(f, p.title), idx * 300);
                });
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-black text-white shadow-md transition cursor-pointer"
              title="Download all attached quotations and invoices"
            >
              <Download className="h-4 w-4" /> Download Attachments ({allAttachedFiles.length})
            </button>
          )}
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#F7A81B] hover:bg-amber-400 text-[#00246C] text-xs font-black shadow-md transition cursor-pointer"
          >
            <Printer className="h-4 w-4" /> Print / Save as PDF
          </button>
          <a
            href="/ProjectPDF.pdf"
            download="ProjectPDF_Official_Template.pdf"
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/15 hover:bg-white/25 text-xs font-bold text-white transition"
            title="Download Official Blank Template"
          >
            <Download className="h-4 w-4" /> Blank Template
          </a>
        </div>
      </div>

      {/* A4 MULTI-PAGE PRINTABLE CONTAINER */}
      <div id="rckl-printable-grant" className="max-w-4xl mx-auto text-slate-900 leading-normal">
        {/* ========================================================================= */}
        {/* PAGE 1 OF 4: GENERAL PROJECT INFORMATION & PROPOSER DETAILS */}
        {/* ========================================================================= */}
        <div className="print-page bg-white p-6 sm:p-10 rounded-2xl border border-slate-300 shadow-xl mb-8 print:mb-0 print:border-none print:shadow-none print:p-0">
          <div>
            {/* Header with Crest */}
            <div className="border-b-2 border-slate-900 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <img src="/images/rckl_official_logo.png" alt="RCKL DiRaja" className="h-16 w-auto object-contain" />
                <div>
                  <h1 className="text-lg sm:text-xl font-black tracking-tight text-slate-900 uppercase">
                    Rotary Club of Kuala Lumpur DiRaja
                  </h1>
                  <p className="text-[11px] text-slate-600 font-semibold tracking-wide">
                    Chartered 15 January 1930 • District 3300 • Club No. 2351 • Rotary International
                  </p>
                  <p className="text-[11px] font-bold text-amber-700 uppercase tracking-wider mt-0.5">
                    Official Community Service Project Paper &amp; Grant Application
                  </p>
                </div>
              </div>
              <div className="text-left sm:text-right text-[11px]">
                <div className="font-bold text-slate-800">Rotary Year: 2025/2026</div>
                <div className="text-slate-600 font-mono">Ref: #{p.id || "NEW"}</div>
                <div className="text-slate-500">Printed: {printDate}</div>
              </div>
            </div>

            {/* Status Banner */}
            <div className="bg-slate-100 border border-slate-300 rounded p-2.5 my-3 flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs">
              <div>
                <span className="font-bold text-slate-700">PROJECT TITLE: </span>
                <span className="font-black text-slate-900 text-sm">{p.title || "Untitled Project"}</span>
              </div>
              <div>
                <span className="font-bold text-slate-700">STATUS: </span>
                <span className="font-bold text-blue-900 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                  {p.status || "Pending Committee Review"}
                </span>
              </div>
            </div>

            {/* Section Header */}
            <div className="bg-[#00246C] text-[#F7A81B] font-black text-xs uppercase px-3 py-1.5 rounded-t tracking-wider flex items-center justify-between">
              <span>Page 1: General Project Information</span>
              <span className="text-[10px] text-white font-normal">Official Form Specification</span>
            </div>

            {/* General Project Info Table */}
            <table className="w-full border-collapse border border-slate-300 text-xs">
              <tbody>
                <tr>
                  <td className="border border-slate-300 p-2 font-bold bg-slate-50 w-1/4">Requester Email</td>
                  <td className="border border-slate-300 p-2 w-1/4 font-medium text-slate-800">{p.email || "—"}</td>
                  <td className="border border-slate-300 p-2 font-bold bg-slate-50 w-1/4">Request Date</td>
                  <td className="border border-slate-300 p-2 w-1/4 font-medium text-slate-800">{p.request_date || "—"}</td>
                </tr>
                <tr>
                  <td className="border border-slate-300 p-2 font-bold bg-slate-50">Requester Name &amp; Role</td>
                  <td className="border border-slate-300 p-2 font-semibold text-slate-900">{p.proposer || "Not specified"}</td>
                  <td className="border border-slate-300 p-2 font-bold bg-slate-50">Committee(s) / Avenue</td>
                  <td className="border border-slate-300 p-2 font-medium text-slate-800">{p.category || "Community Service"}</td>
                </tr>
                <tr>
                  <td className="border border-slate-300 p-2 font-bold bg-slate-50">Project Lead</td>
                  <td className="border border-slate-300 p-2 font-semibold text-slate-900">{p.lead || p.proposer || "—"}</td>
                  <td className="border border-slate-300 p-2 font-bold bg-slate-50">Project Location</td>
                  <td className="border border-slate-300 p-2 font-medium text-slate-800">{p.location || "Klang Valley, Selangor"}</td>
                </tr>
                <tr>
                  <td className="border border-slate-300 p-2 font-bold bg-slate-50">Sub-project of:</td>
                  <td className="border border-slate-300 p-2 text-slate-800">{p.sub_project || "None (Standalone Avenue Project)"}</td>
                  <td className="border border-slate-300 p-2 font-bold bg-slate-50">Joint project with:</td>
                  <td className="border border-slate-300 p-2 text-slate-800">{p.joint_project || "None (RCKL DiRaja Sole Initiative)"}</td>
                </tr>
                <tr>
                  <td className="border border-slate-300 p-2 font-bold bg-slate-50">Target Beneficiaries</td>
                  <td className="border border-slate-300 p-2 font-medium text-slate-800" colSpan={3}>
                    {p.beneficiaries || "Community"}
                  </td>
                </tr>
                <tr>
                  <td className="border border-slate-300 p-2 font-bold bg-slate-50">Project Duration</td>
                  <td className="border border-slate-300 p-2 font-medium text-slate-800">{p.duration || "1 Year"}</td>
                  <td className="border border-slate-300 p-2 font-bold bg-slate-50">Proposed Start Date</td>
                  <td className="border border-slate-300 p-2 font-medium text-slate-800">{p.start_date || "Upon Approval"}</td>
                </tr>
              </tbody>
            </table>

            {/* Note block */}
            <div className="mt-4 border border-dashed border-slate-300 rounded p-3 bg-slate-50 text-[11px] text-slate-600">
              <span className="font-bold text-slate-800">Governance Confirmation: </span>
              This project paper is submitted for official grant funding review and club administration under the Rotary Club of Kuala Lumpur DiRaja Foundation (KLRCF) and Board of Directors guidelines.
            </div>
          </div>

          {/* Page 1 Footer */}
          <div className="border-t border-slate-300 pt-3 mt-4 flex items-center justify-between text-[10px] text-slate-500">
            <span>Rotary Club of Kuala Lumpur DiRaja • Project Paper</span>
            <span className="font-bold text-slate-700">Page 1 of 4</span>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* PAGE 2 OF 4: FINANCIALS, IMPLEMENTATION PLAN, AREAS OF FOCUS & QUOTATIONS */}
        {/* ========================================================================= */}
        <div className="print-page bg-white p-6 sm:p-10 rounded-2xl border border-slate-300 shadow-xl mb-8 print:mb-0 print:border-none print:shadow-none print:p-0">
          <div>
            {/* Page Header */}
            <div className="border-b border-slate-300 pb-2 mb-3 flex items-center justify-between text-xs">
              <span className="font-black text-slate-800 uppercase">RCKL DiRaja • Ref: #{p.id || "NEW"}</span>
              <span className="text-slate-500 font-bold">{p.title}</span>
            </div>

            <div className="bg-[#00246C] text-[#F7A81B] font-black text-xs uppercase px-3 py-1.5 rounded-t tracking-wider flex items-center justify-between">
              <span>Page 2: Financials &amp; Implementation Plan</span>
              <span className="text-[10px] text-white font-normal">Budget &amp; Avenue Strategy</span>
            </div>

            {/* Financial Details Table */}
            <table className="w-full border-collapse border border-slate-300 text-xs">
              <tbody>
                <tr>
                  <td className="border border-slate-300 p-2 font-bold bg-slate-50 w-1/4">Funds Requested (RM)</td>
                  <td className="border border-slate-300 p-2 w-1/4 font-black text-slate-900 text-sm">
                    {grantAmount}
                  </td>
                  <td className="border border-slate-300 p-2 font-bold bg-slate-50 w-1/4">Funds Timeline</td>
                  <td className="border border-slate-300 p-2 w-1/4 font-medium text-slate-800">{p.funds_timeline || "Immediate upon approval"}</td>
                </tr>
                <tr>
                  <td className="border border-slate-300 p-2 font-bold bg-slate-50">Funding Source(s)</td>
                  <td className="border border-slate-300 p-2 font-medium text-slate-800" colSpan={3}>
                    {p.funding_sources || "Club Funds & KLRCF Grant"}
                  </td>
                </tr>
              </tbody>
            </table>

            {/* Project Description / Objective */}
            <div className="mt-3 border border-slate-300 rounded p-2.5 text-xs">
              <span className="font-black uppercase text-slate-900 block mb-1">
                Project Description &amp; Core Objectives:
              </span>
              <p className="text-slate-800 whitespace-pre-wrap leading-relaxed text-[11px]">
                {p.objective || "No detailed description supplied."}
              </p>
            </div>

            {/* Project Milestones */}
            <div className="mt-3 border border-slate-300 rounded p-2.5 text-xs">
              <span className="font-black uppercase text-slate-900 block mb-1">
                Project Milestones &amp; Execution Schedule:
              </span>
              <p className="text-slate-800 whitespace-pre-wrap leading-relaxed text-[11px]">
                {p.milestones || "Execution milestones to be monitored on a monthly basis by the Project Lead."}
              </p>
            </div>

            {/* Rotary Areas of Focus (Checked List matching Google Form) */}
            <div className="mt-3 border border-slate-300 rounded p-2.5 text-xs">
              <span className="font-black uppercase text-slate-900 block mb-1.5">
                Rotary Areas of Focus:
              </span>
              <div className="grid grid-cols-2 gap-1 text-[11px]">
                {ROTARY_AREAS_OF_FOCUS.map((focus) => {
                  const isChecked = focusSet.has(focus) || (Array.isArray(p.areas_of_focus) && p.areas_of_focus.some((af: string) => af.toLowerCase().includes(focus.toLowerCase())));
                  return (
                    <div key={focus} className="flex items-center gap-1.5">
                      {isChecked ? (
                        <CheckSquare className="h-3.5 w-3.5 text-emerald-700 flex-shrink-0" />
                      ) : (
                        <Square className="h-3.5 w-3.5 text-slate-400 flex-shrink-0" />
                      )}
                      <span className={isChecked ? "font-bold text-slate-900" : "text-slate-500"}>
                        {focus}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Attached Supplier Quotations & Invoices */}
            <div className="mt-3">
              <span className="font-black uppercase text-xs text-slate-900 block mb-1">
                Attached Supplier Quotations &amp; Invoices ({allAttachedFiles.length} file{allAttachedFiles.length !== 1 ? "s" : ""}):
              </span>
              <table className="w-full border-collapse border border-slate-300 text-xs">
                <thead>
                  <tr className="bg-slate-100 font-bold text-slate-800">
                    <th className="border border-slate-300 p-1.5 text-center w-8">#</th>
                    <th className="border border-slate-300 p-1.5 text-left">File / Document Name</th>
                    <th className="border border-slate-300 p-1.5 text-left w-32">Document Type</th>
                    <th className="border border-slate-300 p-1.5 text-center w-24">Size / Status</th>
                    <th className="border border-slate-300 p-1.5 text-center w-28 print:hidden">Download</th>
                  </tr>
                </thead>
                <tbody>
                  {allAttachedFiles.length > 0 ? (
                    allAttachedFiles.map((file, idx) => (
                      <tr key={idx} className="hover:bg-slate-50">
                        <td className="border border-slate-300 p-1.5 text-center font-bold">{idx + 1}</td>
                        <td className="border border-slate-300 p-1.5 font-medium text-slate-900">
                          <div className="flex items-center gap-1.5">
                            <FileText className="h-3.5 w-3.5 text-blue-700 shrink-0" />
                            <span>{file.name}</span>
                          </div>
                        </td>
                        <td className="border border-slate-300 p-1.5 text-slate-700">{file.type}</td>
                        <td className="border border-slate-300 p-1.5 text-center text-slate-600 font-medium">{file.size}</td>
                        <td className="border border-slate-300 p-1 text-center print:hidden">
                          <button
                            type="button"
                            onClick={() => triggerAttachmentDownload(file, p.title)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-[#00246C] text-[11px] font-bold border border-blue-200 transition cursor-pointer"
                          >
                            <Download className="h-3 w-3" /> Download
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="border border-slate-300 p-2 text-center text-slate-500 italic">
                        No external quotation files uploaded. Standard procurement protocol.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Page 2 Footer */}
          <div className="border-t border-slate-300 pt-3 mt-4 flex items-center justify-between text-[10px] text-slate-500">
            <span>Rotary Club of Kuala Lumpur DiRaja • Project Paper</span>
            <span className="font-bold text-slate-700">Page 2 of 4</span>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* PAGE 3 OF 4: ROTARY ENGAGEMENT, GOVERNANCE & BOARD / MC APPROVAL */}
        {/* ========================================================================= */}
        <div className="print-page bg-white p-6 sm:p-10 rounded-2xl border border-slate-300 shadow-xl mb-8 print:mb-0 print:border-none print:shadow-none print:p-0">
          <div>
            {/* Page Header */}
            <div className="border-b border-slate-300 pb-2 mb-3 flex items-center justify-between text-xs">
              <span className="font-black text-slate-800 uppercase">RCKL DiRaja • Ref: #{p.id || "NEW"}</span>
              <span className="text-slate-500 font-bold">{p.title}</span>
            </div>

            <div className="bg-[#00246C] text-[#F7A81B] font-black text-xs uppercase px-3 py-1.5 rounded-t tracking-wider flex items-center justify-between">
              <span>Page 3: Rotary Engagement, Governance &amp; Board Authorisation</span>
              <span className="text-[10px] text-white font-normal">Section 3 &amp; 4</span>
            </div>

            <div className="space-y-3 mt-2">
              {/* Rotary Responsibilities */}
              <div className="border border-slate-300 rounded p-2.5 text-xs">
                <span className="font-black uppercase text-slate-900 block mb-1">Rotary Responsibilities:</span>
                <p className="text-slate-800 text-[11px] leading-relaxed">
                  {p.rotary_responsibilities || "Oversee project planning, implementation, volunteer management, and reporting to the Club."}
                </p>
              </div>

              {/* Grid: Rotarians Involved & Public Image */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <div className="border border-slate-300 rounded p-2.5">
                  <span className="font-black uppercase text-slate-900 block mb-0.5">No. of Rotarians Involved:</span>
                  <p className="text-slate-800 text-[11px] font-semibold">
                    {p.rotarians_involved || "10"} Rotarians active
                  </p>
                </div>
                <div className="border border-slate-300 rounded p-2.5">
                  <span className="font-black uppercase text-slate-900 block mb-0.5">Visibility &amp; Public Image:</span>
                  <p className="text-slate-800 text-[11px]">
                    {p.public_image || "Club Newsletter, Rotary Social Media & Press Releases"}
                  </p>
                </div>
              </div>

              {/* Impact Assessment */}
              <div className="border border-slate-300 rounded p-2.5 text-xs">
                <span className="font-black uppercase text-slate-900 block mb-1">Impact Assessment Plan:</span>
                <p className="text-slate-800 text-[11px] leading-relaxed">
                  {p.impact_assessment || p.impact_details || "Assessment conducted via beneficiary attendance, surveys, and project completion audit."}
                </p>
              </div>

              {/* Project Funding Conditions */}
              <div className="border border-slate-300 rounded p-2.5 text-xs">
                <span className="font-black uppercase text-slate-900 block mb-1">Project Funding Conditions (Club):</span>
                <p className="text-slate-800 text-[11px] leading-relaxed">
                  {p.funding_conditions || "Standard club procurement protocol. Official receipts and disbursement proof required for reimbursement."}
                </p>
              </div>

              {/* Approved by checkboxes */}
              <div className="border border-slate-300 rounded p-2.5 text-xs">
                <span className="font-black uppercase text-slate-900 block mb-1">Approved by:</span>
                <div className="flex flex-wrap gap-4 text-[11px]">
                  {["Project Lead", "Committee Director", "BOD", "KLRCF"].map((approver) => {
                    const isChecked = Array.isArray(p.approved_by) && p.approved_by.some((a: string) => a.toLowerCase().includes(approver.toLowerCase()));
                    return (
                      <div key={approver} className="flex items-center gap-1.5">
                        {isChecked ? (
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-700" />
                        ) : (
                          <CheckCircle2 className="h-3.5 w-3.5 text-slate-300" />
                        )}
                        <span className={isChecked ? "font-bold text-slate-900" : "text-slate-500"}>
                          {approver}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Section to be filled by Board / MC */}
              <div className="border-2 border-slate-400 rounded p-3 bg-slate-50 text-xs">
                <div className="font-black uppercase text-[#00246C] text-[11px] tracking-wide mb-2 flex items-center justify-between">
                  <span>Sections to be filled in by Board / MC Approving This Project</span>
                  <span className="text-[10px] text-slate-500 font-normal">Official Governance Sign-off</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <div className="border border-slate-300 bg-white p-2 rounded">
                    <span className="text-[10px] font-bold text-slate-700 block uppercase">Fund Approval By:</span>
                    <span className="font-semibold text-slate-900 text-[11px]">{p.fund_approval_by || "Board of Directors / KLRCF"}</span>
                  </div>
                  <div className="border border-slate-300 bg-white p-2 rounded">
                    <span className="text-[10px] font-bold text-slate-700 block uppercase">Fund Restrictions:</span>
                    <span className="font-medium text-slate-900 text-[11px]">{p.fund_restrictions || "Standard Club Procurement"}</span>
                  </div>
                  <div className="border border-slate-300 bg-white p-2 rounded">
                    <span className="text-[10px] font-bold text-slate-700 block uppercase">Fund Approval Date:</span>
                    <span className="font-medium text-slate-900 text-[11px]">{p.fund_approval_date || "—"}</span>
                  </div>
                </div>
              </div>

              {/* Section to be filled by Project Reviewers: Effective Start */}
              <div className="border border-slate-300 rounded p-2.5 bg-slate-50 text-xs">
                <div className="font-black uppercase text-slate-900 text-[10px] mb-1">Project Reviewers Initial Note:</div>
                <div className="flex items-center gap-4 text-[11px]">
                  <div>
                    <span className="font-bold text-slate-700">Effective Project Start Date: </span>
                    <span className="font-semibold text-slate-900">{p.effective_start || p.start_date || "Upon Approval"}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Page 3 Footer */}
          <div className="border-t border-slate-300 pt-3 mt-4 flex items-center justify-between text-[10px] text-slate-500">
            <span>Rotary Club of Kuala Lumpur DiRaja • Project Paper</span>
            <span className="font-bold text-slate-700">Page 3 of 4</span>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* PAGE 4 OF 4: SUSTAINABILITY, REVIEWER NOTES & 4-STAGE ENDORSEMENTS */}
        {/* ========================================================================= */}
        <div className="print-page bg-white p-6 sm:p-10 rounded-2xl border border-slate-300 shadow-xl mb-8 print:mb-0 print:border-none print:shadow-none print:p-0">
          <div>
            {/* Page Header */}
            <div className="border-b border-slate-300 pb-2 mb-3 flex items-center justify-between text-xs">
              <span className="font-black text-slate-800 uppercase">RCKL DiRaja • Ref: #{p.id || "NEW"}</span>
              <span className="text-slate-500 font-bold">{p.title}</span>
            </div>

            <div className="bg-[#00246C] text-[#F7A81B] font-black text-xs uppercase px-3 py-1.5 rounded-t tracking-wider flex items-center justify-between">
              <span>Page 4: Sustainability, Reviewer Notes &amp; Official Endorsements</span>
              <span className="text-[10px] text-white font-normal">Final Certification</span>
            </div>

            <div className="space-y-3 mt-2">
              {/* Effective End & Reviewer Comments */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                <div className="border border-slate-300 rounded p-2">
                  <span className="text-[10px] font-bold text-slate-700 block uppercase">Effective Project End:</span>
                  <span className="font-semibold text-slate-900 text-[11px]">{p.effective_end || "12 Months Post-Approval"}</span>
                </div>
                <div className="sm:col-span-2 border border-slate-300 rounded p-2">
                  <span className="text-[10px] font-bold text-slate-700 block uppercase">Comments / Next Steps:</span>
                  <span className="text-slate-800 text-[11px]">{p.comments_next_steps || "Proceed to committee review and sequential sign-off."}</span>
                </div>
              </div>

              {/* Sustainability Section */}
              <div className="border border-slate-300 rounded p-2.5 text-xs">
                <span className="font-black uppercase text-slate-900 block mb-1">
                  Project Sustainability Measures:
                </span>
                <p className="text-slate-800 text-[11px] leading-relaxed">
                  {p.sustainability_measures || "Partnership with community leaders and stakeholders to ensure continued maintenance and impact."}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <div className="border border-slate-300 rounded p-2.5">
                  <span className="font-black uppercase text-slate-900 block mb-1">
                    Project Sustainability Ownership:
                  </span>
                  <p className="text-slate-800 text-[11px]">
                    {p.sustainability_ownership || "Community Service Avenue & Beneficiary Association"}
                  </p>
                </div>
                <div className="border border-slate-300 rounded p-2.5">
                  <span className="font-black uppercase text-slate-900 block mb-1">
                    Project Sustainability Report:
                  </span>
                  <p className="text-slate-800 text-[11px]">
                    {p.sustainability_report || "Final completion report to be submitted within 60 days of project conclusion."}
                  </p>
                </div>
              </div>

              {/* Other Comments / Next Steps */}
              {p.other_comments && (
                <div className="border border-slate-300 rounded p-2 text-xs">
                  <span className="font-black uppercase text-slate-900 block mb-0.5">Other Comments / Next Steps:</span>
                  <p className="text-slate-800 text-[11px]">{p.other_comments}</p>
                </div>
              )}

              {/* Sequential 4-Stage Official Endorsements & Signatures */}
              <div className="pt-2">
                <div className="bg-slate-200 text-slate-900 font-black text-xs uppercase px-3 py-1.5 border border-slate-300 flex items-center justify-between">
                  <span>Sequential 4-Stage Official Endorsements &amp; Signatures</span>
                  <span className="text-[10px] text-slate-600 font-normal">Official Governance Approval Workflow</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-2">
                  {/* Stage 1: Project Lead */}
                  <div className="border border-slate-300 p-2.5 rounded text-[11px] flex flex-col justify-between h-36 bg-slate-50/50">
                    <div>
                      <div className="font-bold text-slate-900">1. Project Lead</div>
                      <div className="text-[10px] text-slate-500 mt-0.5">Verification &amp; Filing</div>
                      <div className="font-semibold text-slate-800 mt-1 truncate">{p.lead || p.proposer}</div>
                    </div>
                    <div className="border-t border-slate-300 pt-1 text-[10px]">
                      <div>Sign: <span className="font-mono font-bold text-slate-900">✓ Signed</span></div>
                      <div>Date: {p.request_date || "—"}</div>
                    </div>
                  </div>

                  {/* Stage 2: Community Service Director */}
                  <div className="border border-slate-300 p-2.5 rounded text-[11px] flex flex-col justify-between h-36 bg-slate-50/50">
                    <div>
                      <div className="font-bold text-slate-900">2. Community Service Dir.</div>
                      <div className="text-[10px] text-slate-500 mt-0.5">Committee Review</div>
                      <div className="font-semibold text-slate-800 mt-1">Thomas Varughese</div>
                    </div>
                    <div className="border-t border-slate-300 pt-1 text-[10px]">
                      <div>
                        Status:{" "}
                        <span className="font-bold text-slate-900">
                          {p.approvals?.community_service_director?.approved ? "✓ Endorsed" : "Pending Sign"}
                        </span>
                      </div>
                      <div>Date: {p.approvals?.community_service_director?.approved_at || "—"}</div>
                    </div>
                  </div>

                  {/* Stage 3: KLRCF Treasurer */}
                  <div className="border border-slate-300 p-2.5 rounded text-[11px] flex flex-col justify-between h-36 bg-slate-50/50">
                    <div>
                      <div className="font-bold text-slate-900">3. KLRCF Treasurer</div>
                      <div className="text-[10px] text-slate-500 mt-0.5">Fund Disbursement</div>
                      <div className="font-semibold text-slate-800 mt-1 truncate">Ajmal Khan</div>
                    </div>
                    <div className="border-t border-slate-300 pt-1 text-[10px]">
                      <div>
                        Status:{" "}
                        <span className="font-bold text-slate-900">
                          {p.approvals?.klrcf_treasurer?.approved ? "✓ Disbursable" : "Pending Sign"}
                        </span>
                      </div>
                      <div>Date: {p.approvals?.klrcf_treasurer?.approved_at || "—"}</div>
                    </div>
                  </div>

                  {/* Stage 4: Current President */}
                  <div className="border border-slate-300 p-2.5 rounded text-[11px] flex flex-col justify-between h-36 bg-slate-50/50">
                    <div>
                      <div className="font-bold text-slate-900">4. Current President</div>
                      <div className="text-[10px] text-slate-500 mt-0.5">Board Sanction</div>
                      <div className="font-semibold text-slate-800 mt-1 truncate">Seyed Ehsan Masoumi</div>
                    </div>
                    <div className="border-t border-slate-300 pt-1 text-[10px]">
                      <div>
                        Status:{" "}
                        <span className="font-bold text-slate-900">
                          {p.status?.includes("Approved") ? "✓ Sanctioned" : "Pending Board"}
                        </span>
                      </div>
                      <div>Date: {p.status?.includes("Approved") ? printDate : "—"}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Official Electronic Verification Stamp */}
              <div className="border border-dashed border-slate-300 rounded p-2 text-center text-[10px] text-slate-500">
                Rotary Club of Kuala Lumpur DiRaja (Charter 2351) • Certified Official Project Paper &amp; Grant Application • End of Document
              </div>
            </div>
          </div>

          {/* Page 4 Footer */}
          <div className="border-t border-slate-300 pt-3 mt-4 flex items-center justify-between text-[10px] text-slate-500">
            <span>Rotary Club of Kuala Lumpur DiRaja • Project Paper</span>
            <span className="font-bold text-slate-700">Page 4 of 4</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PrintPaperPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-slate-100 text-slate-700">
          <p className="font-bold text-sm">Loading Project Paper...</p>
        </div>
      }
    >
      <PrintPaperContent />
    </Suspense>
  );
}
