import React from "react";
import Metadata from "next";
import { ShieldCheck, Lock, FileText, Building2, Server, UserCheck, Mail, ArrowLeft, ExternalLink } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "PDPA 2.0 Statutory Privacy Policy & Notice | Rotary Club of Kuala Lumpur DiRaja",
  description: "Official Statutory Privacy Notice under the Personal Data Protection Act 2010 (Act 709) and Personal Data Protection (Amendment) Act 2024 (PDPA 2.0).",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      {/* Top Banner */}
      <header className="bg-[#00246C] py-8 px-6 text-white border-b-4 border-amber-400">
        <div className="mx-auto max-w-5xl">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-bold text-amber-400 hover:text-amber-300 transition-colors mb-4"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Member Directory Portal
          </Link>
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-400/20 text-amber-400 border border-amber-400/40">
              <ShieldCheck className="h-7 w-7" />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-black tracking-tight text-white">
                  Personal Data Protection Act (PDPA 2.0) Notice
                </h1>
                <span className="rounded-full bg-amber-400/20 px-3 py-1 text-xs font-bold text-amber-400 border border-amber-400/30">
                  Act 709 / 2024 Amendment
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1">
                Rotary Club of Kuala Lumpur DiRaja (Founded 1928, Chartered 1930) • Statutory Data Governance Policy
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-5xl py-10 px-6 space-y-8">
        {/* Intro Card */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-3">
          <h2 className="text-lg font-black text-[#00246C] flex items-center gap-2">
            <FileText className="h-5 w-5 text-amber-500" /> Statutory Compliance Statement
          </h2>
          <p className="text-xs leading-relaxed text-slate-600">
            This Personal Data Protection Notice is issued by the <strong>Rotary Club of Kuala Lumpur DiRaja ("RCKL DiRaja")</strong> in compliance with the <strong>Personal Data Protection Act 2010 (Act 709)</strong> and the <strong>Personal Data Protection (Amendment) Act 2024 ("PDPA 2.0")</strong>. This Notice regulates the collection, recording, holding, storage, disclosure, and processing of personal data of all registered members, honorary members, alumni, and official guests.
          </p>
        </section>

        {/* Collection & Purpose */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-3">
            <h3 className="text-base font-extrabold text-[#00246C] flex items-center gap-2">
              <Building2 className="h-5 w-5 text-amber-500" /> 1. Categories of Data Collected
            </h3>
            <ul className="text-xs text-slate-600 space-y-2 list-disc pl-4">
              <li><strong>Personal Identifiers:</strong> Full Name, Salutation, Rotary ID, Classification, Board & Committee Positions.</li>
              <li><strong>Contact Details:</strong> Mobile Numbers, Office Telephone, Residential Phone, Email Addresses.</li>
              <li><strong>Physical Locations:</strong> Office / Business Address, Residential Address.</li>
              <li><strong>Membership & Personal Demographics:</strong> Spouse Details, Birthday, Joining Year, Classification History, Vocational Profile, Hobbies & Interests.</li>
              <li><strong>Visual Records:</strong> Profile Photographs & Official Event Photography.</li>
            </ul>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-3">
            <h3 className="text-base font-extrabold text-[#00246C] flex items-center gap-2">
              <Server className="h-5 w-5 text-amber-500" /> 2. Purposes of Data Processing
            </h3>
            <ul className="text-xs text-slate-600 space-y-2 list-disc pl-4">
              <li>Compilation and publication of the official RCKL DiRaja Member Directory & Roster.</li>
              <li>Facilitation of Rotary District 3300 and Rotary International fellowship and communication.</li>
              <li>Administration of club dues, event attendance, and official bulletins.</li>
              <li>Enforcement of member-selected directory privacy configuration settings.</li>
            </ul>
          </section>
        </div>

        {/* 7 Core Principles & 2024 Statutory Amendments */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
          <h3 className="text-base font-extrabold text-[#00246C] flex items-center gap-2">
            <Lock className="h-5 w-5 text-amber-500" /> 3. PDPA 2.0 Principles & 2024 Statutory Rights
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-1">
              <h4 className="font-bold text-[#00246C]">1. Consent & Notice Principle</h4>
              <p className="text-slate-600">Personal data is processed strictly based on explicit consent granted upon membership registration and directory participation.</p>
            </div>
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-1">
              <h4 className="font-bold text-[#00246C]">2. Disclosure Principle</h4>
              <p className="text-slate-600">Personal data is strictly restricted to authenticated RCKL DiRaja members and is never rented or sold to commercial third parties.</p>
            </div>
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-1">
              <h4 className="font-bold text-[#00246C]">3. Security Principle</h4>
              <p className="text-slate-600">Enterprise data encryption (TLS 1.3 in transit, AES-256 at rest) with Row Level Security (RLS) managed by Supabase & Vercel infrastructure.</p>
            </div>
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-1">
              <h4 className="font-bold text-[#00246C]">4. Retention & Integrity</h4>
              <p className="text-slate-600">Data is maintained for active membership duration and updated self-service by members via the profile dashboard.</p>
            </div>
          </div>

          {/* 2024 AMENDMENTS */}
          <div className="rounded-xl border border-amber-300 bg-amber-50 p-4 space-y-2 text-xs">
            <h4 className="font-extrabold text-amber-900 flex items-center gap-2">
              <UserCheck className="h-4 w-4 text-amber-600" /> Statutory Rights under 2024 Amendments (PDPA 2.0)
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
              <div className="p-3 bg-white rounded-lg border border-amber-200">
                <span className="font-bold text-[#00246C] block">Sec 20A: DPO Designation</span>
                Appointment of a statutory Data Protection Officer (DPO) to handle inquiries and compliance.
              </div>
              <div className="p-3 bg-white rounded-lg border border-amber-200">
                <span className="font-bold text-[#00246C] block">Sec 30A: Data Portability</span>
                Statutory right to request export of personal data in a structured, machine-readable format.
              </div>
              <div className="p-3 bg-white rounded-lg border border-amber-200">
                <span className="font-bold text-[#00246C] block">Sec 43A: Breach Notification</span>
                Obligation to notify the PDP Commissioner and affected subjects within statutory time limits (72h).
              </div>
            </div>
          </div>
        </section>

        {/* DPO Contact Info */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
          <h3 className="text-base font-extrabold text-[#00246C] flex items-center gap-2">
            <Mail className="h-5 w-5 text-amber-500" /> 4. Data Protection Officer (DPO) Contact Details
          </h3>
          <p className="text-xs text-slate-600">
            For inquiries, data access requests (DSAR), data corrections, or consent withdrawal, please contact:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="font-bold text-[#00246C] block">Data Protection Officer (DPO)</span>
              <div className="text-slate-600">Rotary Club of Kuala Lumpur DiRaja</div>
              <div className="text-slate-600">Secretariat & Statutory Compliance Office</div>
              <div className="font-semibold text-[#00246C] pt-2">
                Email: <a href="mailto:dpo@rotarykl.org" className="underline hover:text-blue-900">dpo@rotarykl.org</a>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="font-bold text-[#00246C] block">Technical Data Processor</span>
              <div className="text-slate-600">Matrix IoT Solutions</div>
              <div className="text-slate-600">Infrastructure & System Administration</div>
              <div className="font-semibold text-[#00246C] pt-2">
                Support Email: <a href="mailto:suport@matrix-iot.com" className="underline hover:text-blue-900">suport@matrix-iot.com</a>
              </div>
            </div>
          </div>
        </section>

        {/* Regulatory Regulator */}
        <footer className="text-center text-xs text-slate-500 pt-4 border-t border-slate-200 flex flex-col items-center gap-2">
          <div>Rotary Club of Kuala Lumpur DiRaja • District 3300 • Service Above Self</div>
          <div>
            Regulator: Jabatan Perlindungan Data Peribadi (JPDP) Malaysia •{" "}
            <a href="https://www.pdp.gov.my" target="_blank" rel="noreferrer" className="text-[#00246C] underline inline-flex items-center gap-0.5">
              www.pdp.gov.my <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </footer>
      </main>
    </div>
  );
}
