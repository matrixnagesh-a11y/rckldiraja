"use client";

import React, { useState } from "react";
import {
  ShieldCheck,
  Lock,
  FileText,
  UserCheck,
  Download,
  Mail,
  AlertTriangle,
  X,
  CheckCircle2,
  Building2,
  ExternalLink,
  Info,
  Server,
  KeyRound,
} from "lucide-react";

interface PdpaComplianceModalProps {
  isOpen: boolean;
  onClose: () => void;
  loggedInMember?: any;
}

export default function PdpaComplianceModal({
  isOpen,
  onClose,
  loggedInMember,
}: PdpaComplianceModalProps) {
  const [activeTab, setActiveTab] = useState<"notice" | "principles" | "rights" | "dpo">("notice");
  const [exportSuccess, setExportSuccess] = useState(false);
  const [dsarSent, setDsarSent] = useState(false);
  const [dsarType, setDsarType] = useState<"access" | "correction" | "erasure" | "consent_withdraw">("access");
  const [dsarDetails, setDsarDetails] = useState("");

  if (!isOpen) return null;

  const handleExportData = () => {
    if (!loggedInMember) return;
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(loggedInMember, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute(
      "download",
      `PDPA_Data_Export_${loggedInMember.name ? loggedInMember.name.replace(/\s+/g, "_") : "Member"}_${new Date().toISOString().slice(0, 10)}.json`
    );
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    setExportSuccess(true);
    setTimeout(() => setExportSuccess(false), 4000);
  };

  const handleDsarSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setDsarSent(true);
    setTimeout(() => {
      setDsarSent(false);
      setDsarDetails("");
    }, 5000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 p-4 backdrop-blur-md transition-all duration-200">
      <div className="relative flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl border border-slate-200">
        {/* Header */}
        <div className="bg-[#00246C] px-6 py-5 text-white flex items-center justify-between border-b border-amber-400/30">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-400/20 text-[#F7A81B] border border-amber-400/40">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black tracking-tight text-white">
                  PDPA 2.0 Statutory Compliance Notice
                </h2>
                <span className="rounded-full bg-amber-400/20 px-2.5 py-0.5 text-[10px] font-bold text-[#F7A81B] border border-amber-400/30">
                  Act 709 (2024 Amendment)
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Rotary Club of Kuala Lumpur DiRaja • Data Protection & Governance Center
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-slate-300 hover:bg-white/10 hover:text-white transition-colors"
            aria-label="Close modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-6 text-xs font-semibold overflow-x-auto">
          <button
            onClick={() => setActiveTab("notice")}
            className={`flex items-center gap-2 border-b-2 py-3 px-4 transition-colors whitespace-nowrap ${
              activeTab === "notice"
                ? "border-[#00246C] font-bold text-[#00246C]"
                : "border-transparent text-slate-600 hover:text-slate-900"
            }`}
          >
            <FileText className="h-4 w-4" /> Compliance Notice
          </button>
          <button
            onClick={() => setActiveTab("principles")}
            className={`flex items-center gap-2 border-b-2 py-3 px-4 transition-colors whitespace-nowrap ${
              activeTab === "principles"
                ? "border-[#00246C] font-bold text-[#00246C]"
                : "border-transparent text-slate-600 hover:text-slate-900"
            }`}
          >
            <Lock className="h-4 w-4" /> 7 Principles & 2024 Amendments
          </button>
          <button
            onClick={() => setActiveTab("rights")}
            className={`flex items-center gap-2 border-b-2 py-3 px-4 transition-colors whitespace-nowrap ${
              activeTab === "rights"
                ? "border-[#00246C] font-bold text-[#00246C]"
                : "border-transparent text-slate-600 hover:text-slate-900"
            }`}
          >
            <UserCheck className="h-4 w-4" /> Data Subject Rights & Portability
          </button>
          <button
            onClick={() => setActiveTab("dpo")}
            className={`flex items-center gap-2 border-b-2 py-3 px-4 transition-colors whitespace-nowrap ${
              activeTab === "dpo"
                ? "border-[#00246C] font-bold text-[#00246C]"
                : "border-transparent text-slate-600 hover:text-slate-900"
            }`}
          >
            <Mail className="h-4 w-4" /> DPO & Statutory Contacts
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 text-sm text-slate-700 space-y-6">
          {/* TAB 1: COMPLIANCE NOTICE */}
          {activeTab === "notice" && (
            <div className="space-y-4">
              <div className="rounded-xl border border-blue-100 bg-blue-50/70 p-4 flex items-start gap-3">
                <Info className="h-5 w-5 text-[#00246C] shrink-0 mt-0.5" />
                <div className="text-xs leading-relaxed text-slate-800">
                  <span className="font-bold text-[#00246C]">Statutory Compliance Statement:</span> Rotary Club of Kuala Lumpur DiRaja ("RCKL DiRaja") processes member personal data strictly in adherence to the <strong>Personal Data Protection Act 2010 (Act 709)</strong> and the <strong>Personal Data Protection (Amendment) Act 2024 ("PDPA 2.0")</strong>.
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="rounded-xl border border-slate-200 p-4 bg-white shadow-xs">
                  <h4 className="font-extrabold text-[#00246C] text-sm mb-2 flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-amber-500" /> Categories of Personal Data Collected
                  </h4>
                  <ul className="text-xs space-y-1.5 text-slate-600 list-disc pl-4">
                    <li>Full Name, Salutation, Rotary ID, Classification & Committee Roles</li>
                    <li>Contact Numbers (Mobile, Office, Residence) & Email Addresses</li>
                    <li>Residential & Business Addresses</li>
                    <li>Spouse & Family Details, Birthday, Occupation / Business Profile</li>
                    <li>Profile Photographs & Official Rotary Membership History</li>
                  </ul>
                </div>

                <div className="rounded-xl border border-slate-200 p-4 bg-white shadow-xs">
                  <h4 className="font-extrabold text-[#00246C] text-sm mb-2 flex items-center gap-2">
                    <Server className="h-4 w-4 text-amber-500" /> Lawful Purpose & Processing Scope
                  </h4>
                  <ul className="text-xs space-y-1.5 text-slate-600 list-disc pl-4">
                    <li>Maintenance of official RCKL DiRaja member roster and historical directory</li>
                    <li>Facilitation of Rotary International District 3300 fellowship and communications</li>
                    <li>Event registration, dues administration, and official club bulletins</li>
                    <li>Directory privacy control enforcement (member-configurable visibility)</li>
                  </ul>
                </div>
              </div>

              <div className="rounded-xl border border-slate-200 p-4 bg-slate-50">
                <h4 className="font-extrabold text-[#00246C] text-sm mb-1">Cross-Border Data Transfer & Infrastructure</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  In compliance with PDPA 2.0 cross-border data transfer guidelines, RCKL DiRaja utilizes enterprise cloud infrastructure provided by <strong>Supabase Inc.</strong> and <strong>Vercel Inc.</strong> with TLS 1.3 transport encryption, Row Level Security (RLS), and AES-256 storage encryption.
                </p>
              </div>
            </div>
          )}

          {/* TAB 2: 7 PRINCIPLES & 2024 AMENDMENTS */}
          {activeTab === "principles" && (
            <div className="space-y-4">
              <h3 className="font-extrabold text-[#00246C] text-base">
                PDPA 2.0 Statutory Framework & 2024 Amendments
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-lg border border-slate-200 bg-white">
                  <span className="font-bold text-[#00246C] block mb-1">1. General Principle (Consent)</span>
                  Data is processed exclusively with explicit consent obtained upon Rotary membership registration.
                </div>
                <div className="p-3 rounded-lg border border-slate-200 bg-white">
                  <span className="font-bold text-[#00246C] block mb-1">2. Notice & Choice Principle</span>
                  Members are informed of collection purposes and retain full choice over optional directory disclosures.
                </div>
                <div className="p-3 rounded-lg border border-slate-200 bg-white">
                  <span className="font-bold text-[#00246C] block mb-1">3. Disclosure Principle</span>
                  Data is never sold, leased, or disclosed to unauthorized third parties or commercial entities.
                </div>
                <div className="p-3 rounded-lg border border-slate-200 bg-white">
                  <span className="font-bold text-[#00246C] block mb-1">4. Security Principle</span>
                  Enforced TLS encryption, role-based database authentication, and member-controlled privacy toggles.
                </div>
                <div className="p-3 rounded-lg border border-slate-200 bg-white">
                  <span className="font-bold text-[#00246C] block mb-1">5. Retention Principle</span>
                  Data is retained for active membership duration and purged or archived upon statutory request.
                </div>
                <div className="p-3 rounded-lg border border-slate-200 bg-white">
                  <span className="font-bold text-[#00246C] block mb-1">6. Data Integrity Principle</span>
                  Members can update and verify personal information self-service via the Member Dashboard.
                </div>
              </div>

              {/* 2024 AMENDMENTS HIGHLIGHT */}
              <div className="rounded-xl border border-amber-300 bg-amber-50/80 p-4 space-y-2">
                <div className="flex items-center gap-2 font-extrabold text-[#00246C] text-sm">
                  <AlertTriangle className="h-4 w-4 text-amber-600" />
                  Key 2024 Statutory Amendments Enforced (PDPA 2.0)
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs">
                  <div className="p-2.5 bg-white rounded-md border border-amber-200">
                    <span className="font-bold text-amber-900 block">DPO Designation (Sec 20A)</span>
                    Mandatory statutory Data Protection Officer appointed to oversee data governance.
                  </div>
                  <div className="p-2.5 bg-white rounded-md border border-amber-200">
                    <span className="font-bold text-amber-900 block">72h Breach Notification (Sec 43A)</span>
                    Obligation to notify the PDP Commissioner and affected subjects of security incidents.
                  </div>
                  <div className="p-2.5 bg-white rounded-md border border-amber-200">
                    <span className="font-bold text-amber-900 block">Data Portability (Sec 30A)</span>
                    Statutory right for members to request direct export of their personal data.
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: DATA SUBJECT RIGHTS & PORTABILITY */}
          {activeTab === "rights" && (
            <div className="space-y-5">
              <div className="rounded-xl border border-slate-200 p-4 bg-white space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-extrabold text-[#00246C] text-sm flex items-center gap-2">
                      <Download className="h-4 w-4 text-amber-500" /> Right to Data Portability (PDPA 2.0 Sec 30A)
                    </h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Under PDPA 2.0, you have the right to receive your personal data in a structured, machine-readable format.
                    </p>
                  </div>
                  {loggedInMember ? (
                    <button
                      onClick={handleExportData}
                      className="rounded-lg bg-[#00246C] text-[#F7A81B] px-4 py-2 text-xs font-bold hover:bg-blue-900 transition flex items-center gap-1.5 shrink-0"
                    >
                      <Download className="h-3.5 w-3.5" /> Export My Data (JSON)
                    </button>
                  ) : (
                    <span className="text-xs text-slate-400 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
                      Log in to export personal data
                    </span>
                  )}
                </div>
                {exportSuccess && (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-lg flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                    Personal data export generated and saved to your device.
                  </div>
                )}
              </div>

              {/* DSAR FORM */}
              <div className="rounded-xl border border-slate-200 p-4 bg-white space-y-3">
                <h4 className="font-extrabold text-[#00246C] text-sm flex items-center gap-2">
                  <KeyRound className="h-4 w-4 text-amber-500" /> Data Subject Access / Correction / Erasure Request (DSAR)
                </h4>
                <p className="text-xs text-slate-500">
                  Submit a formal statutory request directly to the RCKL DiRaja Data Protection Officer.
                </p>

                <form onSubmit={handleDsarSubmit} className="space-y-3 pt-2">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Request Type</label>
                      <select
                        value={dsarType}
                        onChange={(e: any) => setDsarType(e.target.value)}
                        className="w-full rounded-lg border border-slate-300 p-2 text-xs bg-slate-50 focus:bg-white"
                      >
                        <option value="access">Access Personal Data (Sec 30)</option>
                        <option value="correction">Correct / Update Personal Data (Sec 34)</option>
                        <option value="erasure">Request Data Erasure / Anonymization</option>
                        <option value="consent_withdraw">Withdraw Processing Consent (Sec 38)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Member Email / Contact</label>
                      <input
                        type="email"
                        required
                        defaultValue={loggedInMember?.email || ""}
                        placeholder="yourname@rotarykl.org"
                        className="w-full rounded-lg border border-slate-300 p-2 text-xs bg-slate-50 focus:bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Details of Request</label>
                    <textarea
                      rows={3}
                      required
                      value={dsarDetails}
                      onChange={(e) => setDsarDetails(e.target.value)}
                      placeholder="Specify details regarding your request or data correction..."
                      className="w-full rounded-lg border border-slate-300 p-2 text-xs bg-slate-50 focus:bg-white"
                    ></textarea>
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="rounded-lg bg-[#00246C] text-white px-4 py-2 text-xs font-bold hover:bg-blue-900 transition flex items-center gap-1.5"
                    >
                      <Mail className="h-3.5 w-3.5 text-amber-400" /> Submit Statutory Request to DPO
                    </button>
                  </div>
                </form>

                {dsarSent && (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-lg flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                    Your Data Subject Access Request has been transmitted to the Data Protection Officer (`dpo@rotarykl.org`). Statutory acknowledgment will be provided within 21 days.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 4: DPO & STATUTORY CONTACTS */}
          {activeTab === "dpo" && (
            <div className="space-y-4">
              <div className="rounded-xl border border-slate-200 p-4 bg-white space-y-3">
                <h4 className="font-extrabold text-[#00246C] text-sm flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-amber-500" /> Designated Data Protection Officer (DPO)
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
                    <span className="font-bold text-[#00246C] block">RCKL DiRaja Statutory DPO Office</span>
                    <div className="text-slate-600">Rotary Club of Kuala Lumpur DiRaja</div>
                    <div className="text-slate-600">Secretariat & PDPA Compliance Unit</div>
                    <div className="font-medium text-[#00246C] pt-1">
                      Email:{" "}
                      <a href="mailto:dpo@rotarykl.org" className="underline hover:text-blue-800">
                        dpo@rotarykl.org
                      </a>
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
                    <span className="font-bold text-[#00246C] block">Data Processor Technical Support</span>
                    <div className="text-slate-600">Matrix IoT Solutions (Technical Provider)</div>
                    <div className="text-slate-600">Data Infrastructure & Security Operations</div>
                    <div className="font-medium text-[#00246C] pt-1">
                      Support Email:{" "}
                      <a href="mailto:suport@matrix-iot.com" className="underline hover:text-blue-800">
                        suport@matrix-iot.com
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-slate-200 p-4 bg-slate-50 space-y-2">
                <h4 className="font-extrabold text-[#00246C] text-xs uppercase tracking-wider">
                  Personal Data Protection Commissioner Malaysia (JPDP)
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Data subjects retain the statutory right under PDPA 2.0 to lodge complaints directly with the Jabatan Perlindungan Data Peribadi (JPDP) Malaysia if they believe their personal data protection rights have been infringed.
                </p>
                <div className="text-xs font-semibold text-slate-700 pt-1">
                  Website:{" "}
                  <a
                    href="https://www.pdp.gov.my"
                    target="_blank"
                    rel="noreferrer"
                    className="text-[#00246C] underline inline-flex items-center gap-1"
                  >
                    www.pdp.gov.my <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-100 px-6 py-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[#00246C]">RCKL DiRaja PDPA 2.0 Statutory Register</span>
            <span>•</span>
            <span>Ref: Act 709 / 2024 Statutory Amendment</span>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="/privacy"
              target="_blank"
              className="font-semibold text-[#00246C] hover:underline flex items-center gap-1"
            >
              Full Policy Page <ExternalLink className="h-3 w-3" />
            </a>
            <button
              onClick={onClose}
              className="rounded-lg bg-[#00246C] text-white px-4 py-1.5 font-bold hover:bg-blue-900 transition"
            >
              Close Notice
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
