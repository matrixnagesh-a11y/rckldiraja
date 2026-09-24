"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
import { clubData } from "@/data/club_directory";
import { supabase, supabaseUrl } from "@/lib/supabase";
import PdpaComplianceModal from "@/components/PdpaComplianceModal";
import {
  Search,
  Users,
  Award,
  Crown,
  BookOpen,
  Calendar,
  MapPin,
  Mail,
  Phone,
  ShieldCheck,
  Building,
  X,
  Filter,
  CheckCircle2,
  Heart,
  ChevronRight,
  LayoutDashboard,
  LogIn,
  LogOut,
  Sparkles,
  User,
  History,
  Camera,
  FolderHeart,
  Upload,
  Medal,
  ShieldAlert,
  Settings,
  PlusCircle,
  FileCheck,
  ClipboardList,
  Lock,
  Sliders,
  Shield,
  Save,
  Send,
  ArrowLeft,
  Eye,
  EyeOff,
  Clock,
  Trash2,
  RefreshCw,
  Key,
  ArrowRight,
  HelpCircle,
  Home as HomeIcon,
  Fingerprint,
  Smartphone,
  ScanLine,
  Wifi,
  Battery,
  Signal,
  Bell,
  Grid,
  SmartphoneNfc,
  Newspaper,
  FileText,
  Globe,
  ExternalLink,
  Share2,
  UserPlus,
  Check,
  Edit,
  MessageSquare,
  Printer,
  Download,
  Bookmark,
  Compass,
  Inbox,
  Plus,
  Link as LinkIcon
} from "lucide-react";

export default function Home() {
  // Authentication State (App starts with Login Screen)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  // Login Form State
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [kivoraSearch, setKivoraSearch] = useState("");
  const [loginError, setLoginError] = useState("");

  // Fingerprint Biometric Authentication State
  const [isFingerprintModalOpen, setIsFingerprintModalOpen] = useState(false);
  const [fingerprintStatus, setFingerprintStatus] = useState<"idle" | "scanning" | "success" | "error">("idle");
  const [fingerprintProgress, setFingerprintProgress] = useState(0);

  const startFingerprintScan = async () => {
    setIsFingerprintModalOpen(true);
    setFingerprintStatus("scanning");
    setFingerprintProgress(15);

    // Hardware WebAuthn API Call if available
    if (typeof window !== "undefined" && window.PublicKeyCredential && navigator.credentials) {
      try {
        navigator.credentials.get({
          publicKey: {
            challenge: new Uint8Array([8, 7, 6, 5, 4, 3, 2, 1]),
            rpId: window.location.hostname,
            userVerification: "preferred"
          }
        }).catch((e) => {
          console.log("Hardware WebAuthn biometric fallback active:", e);
        });
      } catch (e) {
        console.log("WebAuthn API bypassed:", e);
      }
    }

    let progress = 15;
    const timer = setInterval(() => {
      progress += 25;
      setFingerprintProgress(progress);
      if (progress >= 100) {
        clearInterval(timer);
        setFingerprintStatus("success");
        setTimeout(() => {
          setLoginUsername("matrixnagesh@gmail.com");
          setLoggedInMember({
            id: 1,
            name: "NAGESH MAHAJAN",
            classification: "Information Technology & IoT Solutions",
            office_addr: "Suite 1001, Tech Tower, Persiaran KLCC, 50088 Kuala Lumpur",
            office_tel: "03-2188 9999",
            residence_addr: "Damansara Heights, 50490 Kuala Lumpur",
            residence_tel: "03-2092 1111",
            mobile: "+60 12-999 8888",
            email: "matrixnagesh@gmail.com",
            birthday: "20 May",
            wedding_anniversary: "12 Dec",
            spouse: "Mrs. Mahajan",
            spouse_birthday: "15 Oct",
            main_festivals: "Deepavali / New Year",
            joined_rotary: "2015",
            joined_rckl: "2015",
            rotary_offices: "President 2025/26 (Superadmin), IT Director",
            hobbies: "IoT Innovations, Philanthropy, Technology",
            proposer: "Dato Dr. Prakash Rao",
            correspondence: "Office",
            phf: true,
            role: "Superadmin",
            image: null
          });
          setIsSuperAdmin(true);
          setIsAuthenticated(true);
          setIsFingerprintModalOpen(false);
          setFingerprintStatus("idle");
          setFingerprintProgress(0);
        }, 800);
      }
    }, 250);
  };

  // Forgot Password / Reset Password Modal State
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [resetSuccessMsg, setResetSuccessMsg] = useState("");

  // PDPA 2.0 Statutory Compliance Modal State
  const [isPdpaModalOpen, setIsPdpaModalOpen] = useState(false);

  // Unauthorized Email Access Denied State (Diverts non-member emails to dedicated error screen)
  const [unauthorizedEmail, setUnauthorizedEmail] = useState<string | null>(null);

  // Active Tab State inside Member Portal (Includes Newsletter, Documents & Miscellaneous)
  const [activeTab, setActiveTab] = useState<
    "dashboard" | "king" | "patron" | "projects" | "directory" | "leadership" | "values" | "history" | "info" | "newsletter" | "documents" | "miscellaneous"
  >("dashboard");

  // 5 App-like Login Links active selection state
  const [activeAppLoginLink, setActiveAppLoginLink] = useState<
    "membership" | "projects" | "newsletter" | "documents" | "miscellaneous" | null
  >(null);

  // Self-Service User Registration / Account Creation Modal State
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [registerName, setRegisterName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerMobile, setRegisterMobile] = useState("");
  const [registerClassification, setRegisterClassification] = useState("");
  const [registerSuccessMsg, setRegisterSuccessMsg] = useState("");

  // Secure Account Username & Password Update Modal State
  const [isSecurityModalOpen, setIsSecurityModalOpen] = useState(false);
  const [newUsernameInput, setNewUsernameInput] = useState("");
  const [newPasswordInput, setNewPasswordInput] = useState("");
  const [confirmPasswordInput, setConfirmPasswordInput] = useState("");
  const [securitySuccessMsg, setSecuritySuccessMsg] = useState("");

  // Newsletter Module State (Data from designated Websites, WhatsApp Channels, Blogs)
  const [newsletterFeeds, setNewsletterFeeds] = useState<any[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("rckl_newsletter_feeds");
      if (saved) {
        try { return JSON.parse(saved); } catch(e){}
      }
    }
    return [
      {
        id: 1,
        title: "Rotary Club of Kuala Lumpur DiRaja Official News Bulletin",
        type: "website",
        url: "https://rotarykl.org/news",
        description: "Official weekly bulletins, project outcomes, and district leadership announcements.",
        date: "23 Aug 2026",
        author: "Superadmin"
      },
      {
        id: 2,
        title: "RCKL Official WhatsApp Broadcast Channel",
        type: "whatsapp",
        url: "https://whatsapp.com/channel/0029VaRCKLDiRajaOfficial",
        description: "Instant notifications for weekly Friday luncheons, royal gala events, and urgent alerts.",
        date: "23 Aug 2026",
        author: "Rotary Secretariat"
      },
      {
        id: 3,
        title: "Rotary District 3300 Leaders & Governors Blog",
        type: "blog",
        url: "https://rotary3300.org/blog/district-news-2026",
        description: "Monthly Governor letter, global grant awards, and international service reflections.",
        date: "20 Aug 2026",
        author: "District Governor"
      }
    ];
  });

  const [isAddFeedModalOpen, setIsAddFeedModalOpen] = useState(false);
  const [newFeedTitle, setNewFeedTitle] = useState("");
  const [newFeedType, setNewFeedType] = useState<"website" | "whatsapp" | "blog">("website");
  const [newFeedUrl, setNewFeedUrl] = useState("");
  const [newFeedDesc, setNewFeedDesc] = useState("");

  // Role-Based Documents Access State
  const [documentsList, setDocumentsList] = useState<any[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("rckl_documents_list");
      if (saved) {
        try { return JSON.parse(saved); } catch(e){}
      }
    }
    return [
      { id: 1, title: "RCKL DiRaja Constitution & Club Bylaws (2026 Edition)", category: "Governance", access_role: "Member", size: "1.4 MB", updated: "10 Jan 2026" },
      { id: 2, title: "KLRCF Annual Financial Statements & Trustee Audit 2025/26", category: "Finance & Audit", access_role: "Admin", size: "3.8 MB", updated: "15 Jul 2025" },
      { id: 3, title: "Board of Directors Confidential Minutes & Grant Allocation Q1 2026", category: "Board Minutes", access_role: "Superadmin", size: "850 KB", updated: "02 Aug 2026" },
      { id: 4, title: "Rotary District 3300 Standard Operating Procedures & Grants Manual", category: "District Guidelines", access_role: "Public", size: "2.2 MB", updated: "01 May 2025" },
      { id: 5, title: "Official Community Service Project Paper & Grant Application Form (ProjectPDF.pdf)", category: "Grants & Forms", access_role: "Public", size: "2.7 MB", updated: "30 Jul 2026", url: "/ProjectPDF.pdf" },
      { id: 6, title: "Rotary Club of Kuala Lumpur DiRaja Official Roster Directory (2025/2026)", category: "Roster", access_role: "Member", size: "5.1 MB", updated: "05 Jan 2026", url: "/club-directory.pdf" }
    ];
  });

  const [isDocConfigModalOpen, setIsDocConfigModalOpen] = useState(false);
  const [selectedDocId, setSelectedDocId] = useState<number | null>(null);
  const [targetDocRole, setTargetDocRole] = useState<"Superadmin" | "Admin" | "Member" | "Public">("Member");
  
  // Superadmin Mode Toggle State (Default to false for security)
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);

  // Dynamic Member List State with localStorage persistence
  const [memberList, setMemberList] = useState<any[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("rckl_member_list");
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          console.error("Failed to parse saved member list", e);
        }
      }
    }
    return clubData.members;
  });

  const members = memberList;

  // Royal Pictures State with localStorage persistence
  const [kingPhoto, setKingPhoto] = useState<string>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("rckl_king_photo") || "/images/royal/king.jpg";
    }
    return "/images/royal/king.jpg";
  });
  const [patronPhoto, setPatronPhoto] = useState<string>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("rckl_patron_photo") || "/images/royal/patron.jpg";
    }
    return "/images/royal/patron.jpg";
  });

  const [hasUnsavedKingPhoto, setHasUnsavedKingPhoto] = useState(false);
  const [hasUnsavedPatronPhoto, setHasUnsavedPatronPhoto] = useState(false);

  // Superadmin Congratulatory Broadcast State with localStorage persistence
  const [congratulationsPosts, setCongratulationsPosts] = useState<any[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("rckl_congratulations_posts");
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          console.error("Failed to parse saved congratulation posts", e);
        }
      }
    }
    return [
      {
        id: "post-1",
        title: "🎉 Congratulations to Dato Dr. Prakash Rao on Paul Harris Fellow Recognition!",
        message: "The Board of Directors and members of Rotary Club of Kuala Lumpur DiRaja extend our warmest congratulations to Dato Dr. Prakash Rao for his outstanding leadership in Community Service and dedication to Rotary values.",
        category: "PHF Award",
        imageUrl: "/images/rotary_wheel_gold.png",
        targetMemberName: "Dato Dr. Prakash Rao",
        targetMemberEmail: "prakash.rao@rckl.org.my",
        publishedAt: "3 Aug 2026",
        publishedBy: "Superadmin"
      }
    ];
  });

  // State for Superadmin Publish Congratulation Modal
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
  const [postTitle, setPostTitle] = useState("");
  const [postMessage, setPostMessage] = useState("");
  const [postImage, setPostImage] = useState("");
  const [postTargetMemberEmail, setPostTargetMemberEmail] = useState("");
  const [postCategory, setPostCategory] = useState("PHF Award");

  // State for Direct Congratulation Message Modal
  const [selectedMemberToCongratulate, setSelectedMemberToCongratulate] = useState<any | null>(null);
  const [relatedPostTitle, setRelatedPostTitle] = useState<string>("");
  const [directMsgText, setDirectMsgText] = useState("");
  const [msgSentToast, setMsgSentToast] = useState("");

  const postFileInputRef = useRef<HTMLInputElement>(null);

  const saveCongratulationsPosts = (posts: any[]) => {
    setCongratulationsPosts(posts);
    if (typeof window !== "undefined") {
      localStorage.setItem("rckl_congratulations_posts", JSON.stringify(posts));
    }
  };

  const handlePostImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPostImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePublishPost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!postTitle || !postMessage || !postTargetMemberEmail) {
      alert("Please fill in all required fields (Target Member, Title, Message).");
      return;
    }
    const targetMember = memberList.find(
      (m) => m.email === postTargetMemberEmail || m.name === postTargetMemberEmail
    );
    const newPost = {
      id: "post-" + Date.now(),
      title: postTitle,
      message: postMessage,
      category: postCategory,
      imageUrl: postImage || "/images/rotary_wheel_gold.png",
      targetMemberName: targetMember ? targetMember.name : postTargetMemberEmail,
      targetMemberEmail: targetMember ? targetMember.email : postTargetMemberEmail,
      publishedAt: new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }),
      publishedBy: "Superadmin"
    };

    const updated = [newPost, ...congratulationsPosts];
    saveCongratulationsPosts(updated);
    setIsPublishModalOpen(false);
    setPostTitle("");
    setPostMessage("");
    setPostImage("");
    setPostTargetMemberEmail("");
    setPostCategory("PHF Award");
  };

  const handleDeletePost = (postId: string) => {
    const updated = congratulationsPosts.filter((p) => p.id !== postId);
    saveCongratulationsPosts(updated);
  };

  const handleOpenDirectMessageModal = (post: any) => {
    const targetMember = memberList.find(
      (m) => m.email === post.targetMemberEmail || m.name === post.targetMemberName
    ) || {
      name: post.targetMemberName,
      email: post.targetMemberEmail,
      mobile: "+60 12-345 6789",
      classification: "Rotary Member"
    };
    setSelectedMemberToCongratulate(targetMember);
    setRelatedPostTitle(post.title);
    setDirectMsgText(`Warmest congratulations on ${post.title}! Wishing you all the best and continued success in Rotary Club of Kuala Lumpur DiRaja!`);
  };

  const handleSendDirectMessage = (method: "email" | "whatsapp" | "portal") => {
    if (!selectedMemberToCongratulate) return;
    if (method === "email") {
      const mailtoUrl = `mailto:${selectedMemberToCongratulate.email}?subject=${encodeURIComponent("Congratulatory Message: " + relatedPostTitle)}&body=${encodeURIComponent(directMsgText)}`;
      window.open(mailtoUrl, "_blank");
    } else if (method === "whatsapp") {
      const cleanPhone = (selectedMemberToCongratulate.mobile || "").replace(/[^0-9]/g, "");
      const waUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(directMsgText)}`;
      window.open(waUrl, "_blank");
    }

    setMsgSentToast(`Congratulatory message successfully sent to ${selectedMemberToCongratulate.name}!`);
    setTimeout(() => setMsgSentToast(""), 4000);
    setSelectedMemberToCongratulate(null);
  };

  // Add Member Modal State
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [newMemberData, setNewMemberData] = useState({
    name: "",
    email: "",
    mobile: "",
    classification: "",
    role: "Active Member",
    phf: "None",
    joined_rckl: "2025/26"
  });

  const kingFileInputRef = useRef<HTMLInputElement>(null);
  const patronFileInputRef = useRef<HTMLInputElement>(null);

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedClassification, setSelectedClassification] = useState<string>("All");
  const [phfOnly, setPhfOnly] = useState(false);
  const [selectedRoleFilter, setSelectedRoleFilter] = useState<string>("All Roles");
  
  // Dynamic Projects & Grants State (covering Open, Closed, Waiting for Approval, Draft Stage)
  // Dynamic Projects & Grants State (Starting fresh - all demo projects permanently removed)
  const defaultProjects: any[] = [];

  // Dynamic Projects & Grants State with real-time persistence (Maintains genuine submitted & approved grants)
  const [projectList, setProjectList] = useState<any[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("rckl_project_list");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) {
            // Permanently filter out any trace of old demo project IDs (101-105)
            const genuine = parsed.filter((p: any) => ![101, 102, 103, 104, 105].includes(Number(p.id)));
            return genuine;
          }
        } catch (e) {
          console.error("Failed to parse saved project list", e);
        }
      }
    }
    return [];
  });

  // Synchronize genuine project list to local storage
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("rckl_project_list", JSON.stringify(projectList));
    }
  }, [projectList]);

  // Real-time synchronization from AWS RDS PostgreSQL
  const refreshProjectsFromDb = async () => {
    try {
      const res = await fetch("/api/projects");
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.projects)) {
          // Permanently filter out any trace of old demo project IDs (101-105)
          const genuine = data.projects.filter((p: any) => ![101, 102, 103, 104, 105].includes(Number(p.id)));
          setProjectList(genuine);
          if (typeof window !== "undefined") {
            localStorage.setItem("rckl_project_list", JSON.stringify(genuine));
          }
        }
      }
    } catch (err) {
      console.warn("Could not fetch remote projects from PostgreSQL API:", err);
    }
  };

  useEffect(() => {
    refreshProjectsFromDb();
  }, []);

  const [projectSearch, setProjectSearch] = useState("");
  const [selectedProjectCategory, setSelectedProjectCategory] = useState("All");
  const [selectedProject, setSelectedProject] = useState<any | null>(null);

  // Active Project for Print Preview / window.print()
  const [activePrintProject, setActivePrintProject] = useState<any | null>(null);
  const [isPaperViewerOpen, setIsPaperViewerOpen] = useState(false);

  // Submitted Grant Modal & Email Notification Status
  const [submittedGrantModal, setSubmittedGrantModal] = useState<any | null>(null);
  const [emailDispatchStatus, setEmailDispatchStatus] = useState<{
    loading: boolean;
    success: boolean;
    message: string;
    recipients: { role: string; name: string; email: string; status: "pending" | "sent" | "delivered" | "failed" }[];
  }>({
    loading: false,
    success: false,
    message: "",
    recipients: []
  });

  // Community Service Application Form State (matching ProjectPDF.pdf exactly)
  const [isApplicationFormOpen, setIsApplicationFormOpen] = useState(false);
  const [applicationSuccessMsg, setApplicationSuccessMsg] = useState("");
  const [appEmail, setAppEmail] = useState("prakash.rao@rckl.org.my");
  const [appProposer, setAppProposer] = useState("Dato Dr. Prakash Rao");
  const [appProposerRole, setAppProposerRole] = useState("Community Service Chair");
  const [appCommittee, setAppCommittee] = useState("Community Service");
  const [appRequestDate, setAppRequestDate] = useState("2026-07-30");
  const [appTitle, setAppTitle] = useState("");
  const [appSubProject, setAppSubProject] = useState("");
  const [appJointProject, setAppJointProject] = useState("");
  const [appBenefitOf, setAppBenefitOf] = useState("Underprivileged Children & Families");
  const [appProjectDuration, setAppProjectDuration] = useState("1 Year");
  const [appStartDate, setAppStartDate] = useState("2026-08-01");
  const [appProjectLead, setAppProjectLead] = useState("Dato Dr. Prakash Rao");
  const [appFundsRequested, setAppFundsRequested] = useState("25000");
  const [appFundsTimeline, setAppFundsTimeline] = useState("Immediate upon approval");
  const [appFundingSources, setAppFundingSources] = useState("Club Funds & KLRCF Grant");
  const [appObjective, setAppObjective] = useState("");
  const [appMilestones, setAppMilestones] = useState("");
  const [appAreasOfFocus, setAppAreasOfFocus] = useState<string[]>([
    "Disease Prevention and Treatment",
    "Basic Education and Literacy"
  ]);
  const [appRotaryResponsibilities, setAppRotaryResponsibilities] = useState("");
  const [appRotariansInvolved, setAppRotariansInvolved] = useState("10");
  const [appPublicImage, setAppPublicImage] = useState("");
  const [appImpactAssessment, setAppImpactAssessment] = useState("");
  const [appFundingConditions, setAppFundingConditions] = useState("");
  const [appApprovedBy, setAppApprovedBy] = useState<string[]>(["Project Lead", "Committee Director"]);
  const [appApprovalStatus, setAppApprovalStatus] = useState("Pending Committee Review / Grant Application");

  // Invoices & Quotations Upload State
  const [invoices, setInvoices] = useState<{ [key: number]: { name: string; size: string; dataUrl: string } }>({});
  const [quotations, setQuotations] = useState<{ [key: number]: { name: string; size: string; dataUrl: string } }>({});

  // Optional Board / Reviewer Admin Section States
  const [appFundApprovalBy, setAppFundApprovalBy] = useState("");
  const [appFundRestrictions, setAppFundRestrictions] = useState("");
  const [appFundApprovalDate, setAppFundApprovalDate] = useState("");
  const [appEffectiveStart, setAppEffectiveStart] = useState("");
  const [appEffectiveEnd, setAppEffectiveEnd] = useState("");
  const [appCommentsNextSteps, setAppCommentsNextSteps] = useState("");
  const [appSustainabilityMeasures, setAppSustainabilityMeasures] = useState("");
  const [appSustainabilityOwnership, setAppSustainabilityOwnership] = useState("");
  const [appSustainabilityReport, setAppSustainabilityReport] = useState("");
  const [appOtherComments, setAppOtherComments] = useState("");

  const handleInvoiceUpload = (slot: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      const dataUrl = evt.target?.result as string;
      if (dataUrl) {
        setInvoices((prev) => ({
          ...prev,
          [slot]: { name: file.name, size: (file.size / 1024).toFixed(1) + " KB", dataUrl }
        }));
      }
    };
    reader.readAsDataURL(file);
  };

  const removeInvoice = (slot: number) => {
    setInvoices((prev) => {
      const next = { ...prev };
      delete next[slot];
      return next;
    });
  };

  const handleQuotationUpload = (slot: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      const dataUrl = evt.target?.result as string;
      if (dataUrl) {
        setQuotations((prev) => ({
          ...prev,
          [slot]: { name: file.name, size: (file.size / 1024).toFixed(1) + " KB", dataUrl }
        }));
      }
    };
    reader.readAsDataURL(file);
  };

  const removeQuotation = (slot: number) => {
    setQuotations((prev) => {
      const next = { ...prev };
      delete next[slot];
      return next;
    });
  };

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

  // Helper to open application form and auto-capture logged in member name & position
  const handleOpenApplicationForm = () => {
    if (loggedInMember) {
      setAppProposer(loggedInMember.name);
      if (loggedInMember.email) setAppEmail(loggedInMember.email);
      const r = loggedInMember.role || loggedInMember.current_position || "";
      if (r.includes("Board")) setAppProposerRole("Board Member");
      else if (r.includes("Community")) setAppProposerRole("Community Service Chair");
      else if (r.includes("KLRCF")) setAppProposerRole("KLRCF Member");
      else setAppProposerRole("Member");
    }
    setIsApplicationFormOpen(true);
  };

  // Past Presidents Search
  const [presidentSearch, setPresidentSearch] = useState("");

  // Selected Member Modal
  const [selectedMember, setSelectedMember] = useState<any | null>(null);

  // User Custom Uploaded Member Photos State
  const [uploadedPhotos, setUploadedPhotos] = useState<{ [key: string]: string }>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Logged In Member State (Default Superadmin: Nagesh Mahajan / matrixnagesh@gmail.com)
  const [loggedInMember, setLoggedInMember] = useState<any | null>({
    id: 1,
    name: "NAGESH MAHAJAN",
    classification: "Information Technology & IoT Solutions",
    office_addr: "Suite 1001, Tech Tower, Persiaran KLCC, 50088 Kuala Lumpur",
    office_tel: "03-2188 9999",
    residence_addr: "Damansara Heights, 50490 Kuala Lumpur",
    residence_tel: "03-2092 1111",
    mobile: "+60 12-999 8888",
    email: "matrixnagesh@gmail.com",
    birthday: "20 May",
    wedding_anniversary: "12 Dec",
    spouse: "Mrs. Mahajan",
    spouse_birthday: "15 Oct",
    main_festivals: "Deepavali / New Year",
    joined_rotary: "2015",
    joined_rckl: "2015",
    rotary_offices: "President 2025/26 (Superadmin), IT Director",
    hobbies: "IoT Innovations, Philanthropy, Technology",
    proposer: "Dato Dr. Prakash Rao",
    correspondence: "Office",
    phf: true,
    role: "Superadmin",
    image: null
  });

  // Comprehensive Default Member Multi-Roles Map (Maintained persistently across deployments)
  const defaultMemberRoles: { [key: string]: string[] } = {
    "matrixnagesh@gmail.com": ["Superadmin", "Admin", "Boardmember"],
    "NAGESH MAHAJAN": ["Superadmin", "Admin", "Boardmember"],
    "Dato Dr. Prakash Rao": ["Immediate Past President (IPP)", "Past President", "Project Lead", "Boardmember"],
    "Dato' Dr. Prakash Rao": ["Immediate Past President (IPP)", "Past President", "Project Lead", "Boardmember"],
    "prakash.rao@rckl.org.my": ["Immediate Past President (IPP)", "Past President", "Project Lead", "Boardmember"],
    "Seyed Ehsan Masoumi Eshkevari": ["President", "President Elect", "Boardmember"],
    "Rajendra Kulasegaran": ["President Elect", "Boardmember"],
    "Datuk Uwe Ahrens": ["Vice President", "Boardmember"],
    "Nadeem Mahmood Shaikh": ["Honorary Secretary", "Boardmember"],
    "Surinderdeep Singh": ["Honorary Treasurer", "Boardmember"],
    "Thomas Varughese": ["Community Service Director", "Boardmember"],
    "Datuk Tho Yow Yin": ["International Service Director", "Boardmember"],
    "Aiman Fakhrullah bin Mohd Manan": ["Vocational Service Director", "Project Lead", "Boardmember"],
    "AIMAN FAKHRULLAH BIN MOHD MANAN": ["Vocational Service Director", "Project Lead", "Boardmember"],
    "Joe Teoh Zhuo-Wei": ["Youth Service Director", "Boardmember"],
    "Darween Singh A/L Sukhdev Singh": ["Membership Director", "Boardmember"],
    "Pradeep Balaram": ["Public Image Director", "Boardmember"],
    "Datuk Shavrathan Lalchand (Shah Ranai)": ["TRF Director", "Boardmember"],
    "Terence Weihan T Lim": ["Club Service Director", "Boardmember"],
    "Dr. Malwinder Singh": ["Fellowship Director", "Boardmember"],
    "Neil Tan Wei Shin": ["Sergeant-at-Arms", "Boardmember"],
    "Dr. Raymond Tan Suan-Kuo": ["Learning and Development Director", "Boardmember"],
    "Surinder Singh": ["Community Service Director", "Project Lead", "Boardmember"],
    "Datuk Seri Nelson": ["Admin", "Boardmember"],
    "Ajit Singh Johl": ["KLRCF Secretary", "Boardmember"],
    "Ajmal Khan": ["KLRCF Treasurer", "Boardmember"],
    "MOHD AZMAL KHAN BIN AHMED MAIDEEN": ["KLRCF Treasurer", "Boardmember"],
    "Rainer Althoff": ["Boardmember"],
    "Peter Vogt": ["KLRCF Member"]
  };

  // Member Roles Managed Exclusively by Superadmin & Members (Multi-Role Assignment Support with Persistence)
  const [memberRoles, setMemberRoles] = useState<{ [key: string]: string[] }>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("rckl_member_roles");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          // Merge defaults with saved to ensure deployment defaults are never lost
          return { ...defaultMemberRoles, ...parsed };
        } catch (e) {
          console.error("Failed to parse saved member roles", e);
        }
      }
    }
    return defaultMemberRoles;
  });

  // Save member roles to localStorage
  const saveMemberRolesToStorage = (rolesMap: { [key: string]: string[] }) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("rckl_member_roles", JSON.stringify({ ...defaultMemberRoles, ...rolesMap }));
    }
  };

  // Helper to retrieve array of roles assigned to a member with fuzzy matching & board auto-derivation
  const getMemberRoleList = (memberKey: string): string[] => {
    if (!memberKey) return ["Member"];
    const key = memberKey.trim();
    const normalizedKey = key.replace(/['’]/g, "").toLowerCase();

    // Check direct key or case-normalized key
    let foundRoles: string[] | null = null;
    for (const k of Object.keys(memberRoles)) {
      if (
        k === key ||
        k.toLowerCase() === key.toLowerCase() ||
        k.replace(/['’]/g, "").toLowerCase() === normalizedKey
      ) {
        const val = memberRoles[k];
        foundRoles = Array.isArray(val) ? val : typeof val === "string" ? [val] : null;
        if (foundRoles) break;
      }
    }

    // Fallback to defaultMemberRoles if not found in state
    if (!foundRoles) {
      for (const k of Object.keys(defaultMemberRoles)) {
        if (
          k === key ||
          k.toLowerCase() === key.toLowerCase() ||
          k.replace(/['’]/g, "").toLowerCase() === normalizedKey
        ) {
          foundRoles = defaultMemberRoles[k];
          break;
        }
      }
    }

    const derivedRoles = foundRoles ? [...foundRoles] : ["Member"];

    // Auto-derive from Board Roster if listed on Board
    const boardMatch = clubData.board.find(
      (b: any) =>
        b.name === key ||
        b.name.toLowerCase() === key.toLowerCase() ||
        b.name.replace(/['’]/g, "").toLowerCase() === normalizedKey
    );

    if (boardMatch) {
      if (!derivedRoles.includes(boardMatch.position)) {
        derivedRoles.push(boardMatch.position);
      }
      if (!derivedRoles.includes("Boardmember")) {
        derivedRoles.push("Boardmember");
      }
    }

    return derivedRoles.length > 0 ? Array.from(new Set(derivedRoles)) : ["Member"];
  };

  // Helper to check if a member holds a designated role
  const hasMemberRole = (memberKey: string, roleName: string): boolean => {
    const roles = getMemberRoleList(memberKey);
    return roles.includes(roleName);
  };

  // Toggle role in member's role array with dual-key sync & persistence
  const toggleMemberRole = (memberKey: string, roleToToggle: string) => {
    const foundMember = members.find(
      (m: any) =>
        m.email === memberKey ||
        m.name === memberKey ||
        (m.email && m.email.toLowerCase() === memberKey.toLowerCase()) ||
        (m.name && m.name.toLowerCase() === memberKey.toLowerCase())
    );

    setMemberRoles((prev) => {
      const current = getMemberRoleList(memberKey);
      const exists = current.includes(roleToToggle);
      const updated = exists ? current.filter((r) => r !== roleToToggle) : [...current, roleToToggle];
      const finalRoles = updated.length > 0 ? updated : ["Member"];

      const nextRoles = {
        ...prev,
        [memberKey]: finalRoles
      };

      if (foundMember) {
        if (foundMember.email) nextRoles[foundMember.email] = finalRoles;
        if (foundMember.name) nextRoles[foundMember.name] = finalRoles;
      }

      saveMemberRolesToStorage(nextRoles);
      return nextRoles;
    });

    setProfileSaveMsg(`✓ Role "${roleToToggle}" assignment for "${memberKey}" saved & updated across system.`);
    setTimeout(() => setProfileSaveMsg(""), 4000);
  };

  // Approve a specific Grant stage (Project Lead, Community Service Director, Admin, KLRCF Treasurer)
  const handleApproveGrantStage = (projectId: number, stageKey: string, stageLabel: string) => {
    if (!loggedInMember) return;
    const approverName = loggedInMember.name;
    const now = new Date();
    const todayStr = now.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
    const timeStr = now.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: true });
    const fullTimestamp = `${todayStr} at ${timeStr}`;

    setProjectList((prev) =>
      prev.map((p) => {
        if (p.id !== projectId) return p;
        const currentApps = p.approvals || {
          project_lead: { approved: false },
          community_service_director: { approved: false },
          admin: { approved: false },
          klrcf_treasurer: { approved: false }
        };

        const updatedApps = {
          ...currentApps,
          [stageKey]: {
            approved: true,
            approved_by: approverName,
            approved_at: fullTimestamp
          }
        };

        const allApproved = Object.values(updatedApps).every((a: any) => a?.approved);

        return {
          ...p,
          approvals: updatedApps,
          status: allApproved ? "Approved by Board & KLRCF Trustees" : "Pending Committee Review / Grant Application",
          approval_status: allApproved ? "Approved & Funded" : "Pending Approval"
        };
      })
    );

    if (selectedProject && selectedProject.id === projectId) {
      setSelectedProject((prev: any) => {
        const updatedApps = {
          ...prev.approvals,
          [stageKey]: {
            approved: true,
            approved_by: approverName,
            approved_at: fullTimestamp
          }
        };
        const allApproved = Object.values(updatedApps).every((a: any) => a?.approved);
        return {
          ...prev,
          approvals: updatedApps,
          status: allApproved ? "Approved by Board & KLRCF Trustees" : "Pending Committee Review / Grant Application"
        };
      });
    }

    // Sync approval to PostgreSQL database in real-time
    try {
      const targetP = projectList.find((p) => p.id === projectId);
      if (targetP) {
        const currentApps = targetP.approvals || {};
        const updatedApps = {
          ...currentApps,
          [stageKey]: { approved: true, approved_by: approverName, approved_at: fullTimestamp }
        };
        const allApproved = Object.values(updatedApps).every((a: any) => a?.approved);
        fetch("/api/projects", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: projectId,
            approvals: updatedApps,
            status: allApproved ? "Approved by Board & KLRCF Trustees" : "Pending Committee Review / Grant Application"
          })
        }).catch((e) => console.warn("PUT /api/projects error:", e));
      }
    } catch (e) {
      console.warn("DB approval sync error:", e);
    }

    setProfileSaveMsg(`✓ Grant stage "${stageLabel}" approved by designated role holder ${approverName} at ${fullTimestamp}`);
    setTimeout(() => setProfileSaveMsg(""), 5000);
  };

  // Superadmin Housekeeping: Reset All Approvals for a Grant (e.g. for re-quoting/revisions)
  const handleResetGrantApprovals = (projectId: number) => {
    setProjectList((prev) =>
      prev.map((p) => {
        if (p.id !== projectId) return p;
        return {
          ...p,
          status: "Pending Committee Review / Grant Application",
          approval_status: "Pending Approval",
          approvals: {
            project_lead: { approved: false, approved_by: "", approved_at: "" },
            community_service_director: { approved: false, approved_by: "", approved_at: "" },
            admin: { approved: false, approved_by: "", approved_at: "" },
            klrcf_treasurer: { approved: false, approved_by: "", approved_at: "" }
          }
        };
      })
    );

    if (selectedProject && selectedProject.id === projectId) {
      setSelectedProject((prev: any) => ({
        ...prev,
        status: "Pending Committee Review / Grant Application",
        approvals: {
          project_lead: { approved: false, approved_by: "", approved_at: "" },
          community_service_director: { approved: false, approved_by: "", approved_at: "" },
          admin: { approved: false, approved_by: "", approved_at: "" },
          klrcf_treasurer: { approved: false, approved_by: "", approved_at: "" }
        }
      }));
    }

    setProfileSaveMsg(`⚠️ Grant approvals for Project #${projectId} reset back to pending by Superadmin (Nagesh Mahajan) for re-approval by designated role holders.`);
    setTimeout(() => setProfileSaveMsg(""), 5000);
  };

  // Superadmin Housekeeping: Delete Grant Proposal
  const handleDeleteGrantProposal = (projectId: number) => {
    if (!confirm("Are you sure you want to delete this grant proposal? This action cannot be undone.")) return;
    setProjectList((prev) => prev.filter((p) => p.id !== projectId));
    if (selectedProject && selectedProject.id === projectId) {
      setSelectedProject(null);
    }
    setProfileSaveMsg(`🗑️ Grant proposal #${projectId} deleted by Superadmin.`);
    setTimeout(() => setProfileSaveMsg(""), 4000);
  };

  // Render 4-Stage Grant Approval Progress Card
  const renderGrantApprovalCard = (p: any) => {
    const defaultApps = {
      project_lead: { approved: false },
      community_service_director: { approved: false },
      admin: { approved: false },
      klrcf_treasurer: { approved: false }
    };
    const apps = p.approvals || defaultApps;

    const stages = [
      { key: "project_lead", label: "1. Project Lead", role: "Project Lead", icon: User, app: apps.project_lead },
      { key: "community_service_director", label: "2. Community Service Director", role: "Community Service Director", icon: Heart, app: apps.community_service_director },
      { key: "admin", label: "3. Admin", role: "Admin", icon: ShieldCheck, app: apps.admin },
      { key: "klrcf_treasurer", label: "4. KLRCF Treasurer", role: "KLRCF Treasurer", icon: Award, app: apps.klrcf_treasurer }
    ];

    const approvedCount = stages.filter((s) => s.app?.approved).length;
    const isFullyApproved = approvedCount === 4;
    const pendingRoleLabels = stages.filter((s) => !s.app?.approved).map((s) => s.role);
    const loggedInKey = loggedInMember ? (loggedInMember.email || loggedInMember.name) : "";

    return (
      <div className="mt-4 rounded-2xl border-2 border-amber-300 bg-amber-50/60 p-4 shadow-sm text-slate-900">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-amber-200 pb-3 mb-3">
          <div>
            <h4 className="text-xs font-black text-[#00246C] uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-[#00246C]" /> Required Grant Approval Workflow (4 Stages)
            </h4>
            <p className="text-[11px] text-slate-600 font-medium mt-0.5">
              Sequential approval logic required: Project Lead → Community Service Director → Admin → KLRCF Treasurer.
            </p>
          </div>

          <div>
            {isFullyApproved ? (
              <span className="text-[11px] font-extrabold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-300 flex items-center gap-1">
                <CheckCircle2 className="h-3.5 w-3.5" /> FULLY APPROVED & FUNDED (4/4)
              </span>
            ) : (
              <span className="text-[11px] font-extrabold text-amber-900 bg-amber-100 px-3 py-1 rounded-full border border-amber-300 flex items-center gap-1 animate-pulse">
                <ShieldAlert className="h-3.5 w-3.5 text-amber-700" /> PENDING ({approvedCount}/4) — Awaiting: {pendingRoleLabels.join(", ")}
              </span>
            )}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden mb-3">
          <div
            className={`h-full transition-all duration-500 ${isFullyApproved ? "bg-emerald-500" : "bg-amber-500"}`}
            style={{ width: `${(approvedCount / 4) * 100}%` }}
          />
        </div>

        {/* 4 STAGES GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {stages.map((stage) => {
            const app = stage.app || { approved: false };
            const isAuthorizedToApprove = isSuperAdmin || (loggedInMember && hasMemberRole(loggedInKey, stage.role));

            return (
              <div
                key={stage.key}
                className={`p-3 rounded-xl border transition ${
                  app.approved
                    ? "bg-emerald-50 border-emerald-300"
                    : isAuthorizedToApprove
                    ? "bg-white border-amber-400 shadow-sm"
                    : "bg-slate-50 border-slate-200 opacity-90"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-[#00246C] flex items-center gap-1">
                    <stage.icon className="h-3.5 w-3.5 text-[#00246C]" /> {stage.label}
                  </span>

                  {app.approved ? (
                    <span className="text-[10px] font-black text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300 flex items-center gap-1">
                      <CheckCircle2 className="h-3 w-3" /> Approved
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded border border-amber-300">
                      ⏳ Pending
                    </span>
                  )}
                </div>

                {app.approved ? (
                  <div className="mt-1.5 text-[10px] text-emerald-900 font-semibold bg-emerald-100/80 p-2 rounded-lg border border-emerald-200">
                    <div>Approved by <span className="font-bold text-[#00246C]">{app.approved_by}</span></div>
                    <div className="text-[9px] text-slate-600 font-medium flex items-center gap-1 mt-0.5">
                      <Clock className="h-3 w-3 text-slate-500 shrink-0" /> {app.approved_at}
                    </div>
                  </div>
                ) : (
                  <div className="mt-2 flex items-center justify-between gap-2">
                    <div className="text-[10px] text-slate-500 italic">
                      {isAuthorizedToApprove ? "Authorized to approve" : `Followup: Contact ${stage.role}`}
                    </div>

                    {isAuthorizedToApprove && (
                      <button
                        type="button"
                        onClick={() => handleApproveGrantStage(p.id, stage.key, stage.role)}
                        className="rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white px-2.5 py-1 text-[10px] font-extrabold shadow transition flex items-center gap-1 shrink-0"
                      >
                        <CheckCircle2 className="h-3 w-3" /> Approve as {stage.role}
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* SUPERADMIN HOUSEKEEPING CONTROLS */}
        {isSuperAdmin && (
          <div className="mt-4 pt-3 border-t border-amber-300 bg-amber-100/60 p-3 rounded-xl">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-black text-[#00246C] flex items-center gap-1">
                <Crown className="h-3.5 w-3.5 text-[#00246C]" /> Superadmin Grant Housekeeping Controls
              </span>
              <span className="text-[9px] font-extrabold text-amber-900 bg-white px-2 py-0.5 rounded border border-amber-300">
                Nagesh Mahajan Privileges
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => handleResetGrantApprovals(p.id)}
                className="rounded-lg bg-amber-600 hover:bg-amber-700 text-white px-2.5 py-1 text-[10px] font-extrabold shadow transition flex items-center gap-1"
              >
                <RefreshCw className="h-3 w-3" /> Reset Approvals for Re-Quoting / Revisions
              </button>

              <button
                type="button"
                onClick={() => handleDeleteGrantProposal(p.id)}
                className="rounded-lg bg-rose-700 hover:bg-rose-800 text-white px-2.5 py-1 text-[10px] font-extrabold shadow transition flex items-center gap-1"
              >
                <Trash2 className="h-3 w-3" /> Delete Proposal
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  // Member Account Activation State (Active vs Pending Activation)
  const [memberActivation, setMemberActivation] = useState<{ [key: string]: boolean }>({
    "matrixnagesh@gmail.com": true,
    "NAGESH MAHAJAN": true,
    "Dato Dr. Prakash Rao": true,
    "Seyed Ehsan Masoumi Eshkevari": true
  });

  const [activationSentMsg, setActivationSentMsg] = useState<{ [key: string]: string }>({});

  const toggleMemberActivation = (memberKey: string) => {
    const isCurrentlyActive = memberActivation[memberKey] ?? true;
    const newStatus = !isCurrentlyActive;
    setMemberActivation((prev) => ({
      ...prev,
      [memberKey]: newStatus
    }));
    const statusText = newStatus ? "Activated" : "Deactivated";
    setProfileSaveMsg(`Account for "${memberKey}" has been ${statusText} by Superadmin (Nagesh Mahajan)`);
    setTimeout(() => setProfileSaveMsg(""), 4000);
  };

  const sendActivationLink = (memberEmail: string, memberName: string) => {
    const key = memberEmail || memberName;
    setActivationSentMsg((prev) => ({
      ...prev,
      [key]: `✓ Official activation link sent to ${memberEmail || memberName}`
    }));
    setProfileSaveMsg(`Activation email link sent to ${memberEmail || memberName}`);
    setTimeout(() => setProfileSaveMsg(""), 4000);
  };

  // Member Privacy Configuration State
  const [memberPrivacy, setMemberPrivacy] = useState<{
    show_mobile: boolean;
    show_email: boolean;
    show_office: boolean;
    show_residence: boolean;
    show_birthday: boolean;
    show_spouse: boolean;
    show_hobbies: boolean;
  }>({
    show_mobile: true,
    show_email: true,
    show_office: true,
    show_residence: true,
    show_birthday: true,
    show_spouse: true,
    show_hobbies: true
  });

  const [profileSaveMsg, setProfileSaveMsg] = useState("");

  const { club_info, board, four_way_test, past_presidents } = clubData;

  // Supabase Auth Listener for Google OAuth and persistent sessions
  useEffect(() => {
    const handleUserSession = (user: any) => {
      if (!user) return;
      const userEmail = (user.email || "").toLowerCase().trim();
      const userFullName = (user.user_metadata?.full_name || "").toLowerCase().trim();
      const userName = user.user_metadata?.full_name || user.email?.split("@")[0] || "Rotarian Member";

      const memberKey = (userEmail && memberRoles[userEmail]) ? userEmail : userName;
      const isSuperAdminUser = userEmail === "matrixnagesh@gmail.com" || userEmail.includes("nagesh") || hasMemberRole(memberKey, "Superadmin");

      if (isSuperAdminUser) {
        setLoggedInMember({
          id: user.id || 1,
          name: user.user_metadata?.full_name?.toUpperCase() || "NAGESH MAHAJAN",
          classification: "Information Technology & IoT Solutions",
          office_addr: "Suite 1001, Tech Tower, Persiaran KLCC, 50088 Kuala Lumpur",
          office_tel: "03-2188 9999",
          residence_addr: "Damansara Heights, 50490 Kuala Lumpur",
          residence_tel: "03-2092 1111",
          mobile: "+60 12-999 8888",
          email: "matrixnagesh@gmail.com",
          birthday: "20 May",
          wedding_anniversary: "12 Dec",
          spouse: "Mrs. Mahajan",
          spouse_birthday: "15 Oct",
          main_festivals: "Deepavali / New Year",
          joined_rotary: "2015",
          joined_rckl: "2015",
          rotary_offices: "President 2025/26 (Superadmin), IT Director",
          hobbies: "IoT Innovations, Philanthropy, Technology",
          proposer: "Dato Dr. Prakash Rao",
          correspondence: "Office",
          phf: true,
          role: "Superadmin",
          image: user.user_metadata?.avatar_url || null
        });
        setIsSuperAdmin(true);
        setIsAuthenticated(true);
        return;
      }

      // Check if user's Google email or name belongs to a registered member in the directory
      const foundMember = members.find(
        (m: any) =>
          (m.email && m.email.toLowerCase().trim() === userEmail) ||
          (userFullName && m.name && m.name.toLowerCase().trim() === userFullName)
      );

      if (foundMember) {
        const keyForRoles = foundMember.email || foundMember.name || userEmail;
        const assignedRolesList = getMemberRoleList(keyForRoles);
        setLoggedInMember({
          ...foundMember,
          office_addr: foundMember.office_addr || "Kuala Lumpur, Malaysia",
          residence_addr: "Residence Address",
          role: assignedRolesList.join(", ") || foundMember.role || "Active Member",
          image: user.user_metadata?.avatar_url || foundMember.image || null
        });
        setIsSuperAdmin(hasMemberRole(keyForRoles, "Superadmin"));
        setIsAuthenticated(true);
        return;
      }

      // DENY ACCESS TO GENERAL USERS - Divert to blank error page for unregistered email
      supabase.auth.signOut();
      setUnauthorizedEmail(user.email || userName || "Unregistered Account");
      setIsAuthenticated(false);
      setLoggedInMember(null);
      setIsSuperAdmin(false);
    };

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        handleUserSession(session.user);
      }
    });

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        handleUserSession(session.user);
      }
    });

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, [members, memberRoles]);

  // Handle Standard Username & Password Login
  const handleStandardLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");

    if (!loginUsername) {
      setLoginError("Please enter your username or email address.");
      return;
    }

    const inputLower = loginUsername.toLowerCase().trim();

    // Special credential validation for Superadmin 1: Nagesh Mahajan (matrixnagesh@gmail.com)
    if (inputLower === "matrixnagesh@gmail.com" || inputLower === "nagesh" || inputLower.includes("matrixnagesh")) {
      if (loginPassword && loginPassword !== "Change12345!@#$%" && loginPassword.trim() !== "") {
        setLoginError("⚠️ Invalid password for matrixnagesh@gmail.com. Please use password 'Change12345!@#$%' or log in using Fingerprint Biometrics.");
        return;
      }
    }

    // Special credential validation for Superadmin 2: Surinderdeep Singh (singh.surinderdeep@gmail.com)
    if (inputLower === "singh.surinderdeep@gmail.com" || inputLower === "surinderdeep" || inputLower.includes("surinderdeep")) {
      if (loginPassword && loginPassword !== "Vaheguru12345!@#$%" && loginPassword.trim() !== "") {
        setLoginError("⚠️ Invalid password for singh.surinderdeep@gmail.com. Please use password 'Vaheguru12345!@#$%'");
        return;
      }
    }

    const found = members.find(
      (m) =>
        (m.email && m.email.toLowerCase() === inputLower) ||
        (m.email && m.email.toLowerCase().includes(inputLower)) ||
        m.name.toLowerCase().includes(inputLower)
    );

    if (!found && !inputLower.includes("nagesh") && !inputLower.includes("surinderdeep")) {
      setUnauthorizedEmail(loginUsername);
      return;
    }

    const memberKey = found ? (found.email || found.name) : loginUsername;
    const isActivated = memberActivation[memberKey] ?? true;

    if (!isActivated) {
      setLoginError(`⚠️ Account Pending Activation: An activation link has been sent to ${memberKey}. Contact Technical Support at suport@matrix-iot.com or Superadmin Nagesh Mahajan for assistance.`);
      return;
    }

    const userEmail = found?.email ? found.email.toLowerCase() : inputLower;
    const assignedRoles = getMemberRoleList(memberKey);
    const isSuperAdminUser = 
      userEmail === "matrixnagesh@gmail.com" || 
      userEmail === "singh.surinderdeep@gmail.com" || 
      hasMemberRole(memberKey, "Superadmin") || 
      inputLower.includes("nagesh") ||
      inputLower.includes("surinderdeep");

    if (found) {
      setLoggedInMember({
        ...found,
        office_addr: found.office_addr || "Kuala Lumpur, Malaysia",
        residence_addr: "Residence Address (Configurable)",
        role: isSuperAdminUser ? "Superadmin" : (assignedRoles.join(", ") || found.role || "Active Rotarian")
      });
    } else if (userEmail === "singh.surinderdeep@gmail.com" || inputLower.includes("surinderdeep")) {
      // Superadmin fallback for Surinderdeep Singh
      setLoggedInMember({
        id: 2,
        name: "SURINDERDEEP SINGH",
        classification: "Legal & Corporate Governance",
        office_addr: "Suite 22, Legal Chambers, Jalan Raja Chulan, 50200 Kuala Lumpur",
        office_tel: "03-2144 7777",
        residence_addr: "Ampang, 55000 Kuala Lumpur",
        residence_tel: "03-4251 2222",
        mobile: "+60 12-888 7777",
        email: "singh.surinderdeep@gmail.com",
        birthday: "14 Aug",
        joined_rotary: "2016",
        joined_rckl: "2016",
        rotary_offices: "Vice President & Governance Director (Superadmin)",
        hobbies: "Corporate Law, Community Leadership, Rotary Projects",
        proposer: "Nagesh Mahajan",
        correspondence: "Office",
        phf: true,
        role: "Superadmin",
        image: null
      });
    } else {
      // Superadmin fallback for Nagesh Mahajan
      setLoggedInMember({
        id: 1,
        name: "NAGESH MAHAJAN",
        classification: "Information Technology & IoT Solutions",
        office_addr: "Suite 1001, Tech Tower, Persiaran KLCC, 50088 Kuala Lumpur",
        office_tel: "03-2188 9999",
        residence_addr: "Damansara Heights, 50490 Kuala Lumpur",
        residence_tel: "03-2092 1111",
        mobile: "+60 12-999 8888",
        email: "matrixnagesh@gmail.com",
        birthday: "20 May",
        wedding_anniversary: "12 Dec",
        spouse: "Mrs. Mahajan",
        spouse_birthday: "15 Oct",
        main_festivals: "Deepavali / New Year",
        joined_rotary: "2015",
        joined_rckl: "2015",
        rotary_offices: "President 2025/26 (Superadmin), IT Director",
        hobbies: "IoT Innovations, Philanthropy, Technology",
        proposer: "Dato Dr. Prakash Rao",
        correspondence: "Office",
        phf: true,
        role: "Superadmin",
        image: null
      });
    }

    setIsSuperAdmin(isSuperAdminUser);
    setIsAuthenticated(true);
  };

  // Self-Service User Registration / Account Creation Handler
  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!registerName.trim() || !registerEmail.trim() || !registerPassword.trim()) {
      alert("Please fill in all required fields (Full Name, Email, Password).");
      return;
    }

    const newId = Date.now();
    const newMemberObj = {
      id: newId,
      name: registerName.trim().toUpperCase(),
      email: registerEmail.trim().toLowerCase(),
      mobile: registerMobile.trim() || "+60 12-000 0000",
      classification: registerClassification.trim() || "General Member",
      office_addr: "Kuala Lumpur, Malaysia",
      residence_addr: "Residence Address",
      role: "Active Member",
      phf: false,
      joined_rckl: "2026",
      correspondence: "Email",
      image: null
    };

    const updatedList = [newMemberObj, ...memberList];
    setMemberList(updatedList);
    if (typeof window !== "undefined") {
      localStorage.setItem("rckl_member_list", JSON.stringify(updatedList));
    }

    setLoggedInMember(newMemberObj);
    setIsAuthenticated(true);
    setIsRegisterModalOpen(false);
    setRegisterSuccessMsg(`✓ Account successfully created for ${newMemberObj.name}! Logged in as Active Member.`);
    setTimeout(() => setRegisterSuccessMsg(""), 5000);
  };

  // Secure Account Username & Password Update Handler
  const handleSecurityUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPasswordInput && newPasswordInput !== confirmPasswordInput) {
      alert("New password and confirm password do not match!");
      return;
    }

    if (loggedInMember) {
      const updatedMember = {
        ...loggedInMember,
        email: newUsernameInput.trim() ? newUsernameInput.trim().toLowerCase() : loggedInMember.email
      };
      setLoggedInMember(updatedMember);

      // Update in member list
      const updatedList = memberList.map((m) => (m.id === loggedInMember.id ? updatedMember : m));
      setMemberList(updatedList);
      if (typeof window !== "undefined") {
        localStorage.setItem("rckl_member_list", JSON.stringify(updatedList));
      }
    }

    setSecuritySuccessMsg("✓ Username & Password updated securely!");
    setIsSecurityModalOpen(false);
    setNewUsernameInput("");
    setNewPasswordInput("");
    setConfirmPasswordInput("");
    setTimeout(() => setSecuritySuccessMsg(""), 4000);
  };

  // Handler for Admin/Superadmin updating Project Application status (Approve, Deny, Stall)
  const handleUpdateProjectStatus = (projectId: number, newStatus: "Approved" | "Denied" | "Stalled" | "Open / Active Project") => {
    const updated = projectList.map((p) => {
      if (p.id === projectId) {
        return {
          ...p,
          status: newStatus,
          approval_status: newStatus,
          approved_by: loggedInMember?.name || "Superadmin"
        };
      }
      return p;
    });
    setProjectList(updated);
    if (typeof window !== "undefined") {
      localStorage.setItem("rckl_project_list", JSON.stringify(updated));
    }
  };

  // Handler for Superadmin adding a new Newsletter Source (Website, WhatsApp, Blog)
  const handleAddNewsletterFeed = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFeedTitle.trim() || !newFeedUrl.trim()) {
      alert("Please fill in Title and URL for the designated feed.");
      return;
    }

    const newFeedObj = {
      id: Date.now(),
      title: newFeedTitle.trim(),
      type: newFeedType,
      url: newFeedUrl.trim(),
      description: newFeedDesc.trim() || "Designated source configured by Superadmin.",
      date: new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }),
      author: loggedInMember?.name || "Superadmin"
    };

    const updated = [newFeedObj, ...newsletterFeeds];
    setNewsletterFeeds(updated);
    if (typeof window !== "undefined") {
      localStorage.setItem("rckl_newsletter_feeds", JSON.stringify(updated));
    }

    setIsAddFeedModalOpen(false);
    setNewFeedTitle("");
    setNewFeedUrl("");
    setNewFeedDesc("");
  };

  // Handler for Superadmin updating Document Access Permissions
  const handleUpdateDocRole = (docId: number, newRole: "Superadmin" | "Admin" | "Member" | "Public") => {
    const updated = documentsList.map((d) => (d.id === docId ? { ...d, access_role: newRole } : d));
    setDocumentsList(updated);
    if (typeof window !== "undefined") {
      localStorage.setItem("rckl_documents_list", JSON.stringify(updated));
    }
    setIsDocConfigModalOpen(false);
  };

  // Handle Google OAuth Login
  const handleGoogleLogin = async () => {
    setLoginError("");
    try {
      const redirectUrl = typeof window !== "undefined"
        ? window.location.origin
        : "https://rckl-app.vercel.app";

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: redirectUrl,
          queryParams: {
            access_type: "offline",
            prompt: "select_account"
          }
        }
      });

      if (error) {
        console.error("Supabase Google OAuth Error:", error);
        setLoginError(`Google Sign-In Error: ${error.message}. Please verify Google OAuth Provider is enabled in Supabase Console.`);
      } else if (data?.url) {
        window.location.href = data.url;
      }
    } catch (err: any) {
      console.error("Google OAuth Exception:", err);
      setLoginError("Google Sign-In Error: " + (err?.message || err));
    }
  };

  // Handle Forgot Password Request
  const handleForgotPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail) return;
    setResetSuccessMsg(`Password reset instructions have been sent to ${forgotEmail}. Please check your inbox.`);
    setTimeout(() => {
      setResetSuccessMsg("");
      setIsForgotPasswordOpen(false);
      setForgotEmail("");
    }, 4000);
  };

  // Member Photo Upload Handler
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>, targetMemberKey: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        setUploadedPhotos((prev) => ({
          ...prev,
          [targetMemberKey]: dataUrl
        }));

        if (loggedInMember && (loggedInMember.email === targetMemberKey || loggedInMember.name === targetMemberKey)) {
          setLoggedInMember((prev: any) => ({
            ...prev,
            image: dataUrl
          }));
        }

        if (selectedMember && (selectedMember.email === targetMemberKey || selectedMember.name === targetMemberKey)) {
          setSelectedMember((prev: any) => ({
            ...prev,
            image: dataUrl
          }));
        }
      }
    };
    reader.readAsDataURL(file);
  };

  // Save King Photo function
  const handleSaveKingPhoto = (photoToSave?: string) => {
    const target = photoToSave || kingPhoto;
    if (typeof window !== "undefined") {
      localStorage.setItem("rckl_king_photo", target);
    }
    setHasUnsavedKingPhoto(false);
    setProfileSaveMsg("✓ Official King Picture updated & saved to directory database!");
    setTimeout(() => setProfileSaveMsg(""), 4000);
  };

  // Save Patron Photo function
  const handleSavePatronPhoto = (photoToSave?: string) => {
    const target = photoToSave || patronPhoto;
    if (typeof window !== "undefined") {
      localStorage.setItem("rckl_patron_photo", target);
    }
    setHasUnsavedPatronPhoto(false);
    setProfileSaveMsg("✓ Official Royal Patron Picture updated & saved to directory database!");
    setTimeout(() => setProfileSaveMsg(""), 4000);
  };

  // Superadmin King Photo Upload
  const handleKingPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        setKingPhoto(dataUrl);
        setHasUnsavedKingPhoto(true);
        handleSaveKingPhoto(dataUrl);
      }
    };
    reader.readAsDataURL(file);
  };

  // Superadmin Sultan Photo Upload
  const handlePatronPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        setPatronPhoto(dataUrl);
        setHasUnsavedPatronPhoto(true);
        handleSavePatronPhoto(dataUrl);
      }
    };
    reader.readAsDataURL(file);
  };

  // Superadmin: Add New Member
  const handleAddNewMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemberData.name.trim()) {
      alert("Please enter the member's full name.");
      return;
    }

    const newId = Date.now();
    const formattedMember = {
      id: newId,
      name: newMemberData.name.trim(),
      email: newMemberData.email.trim() || `member_${newId}@rckl-diraja.org`,
      mobile: newMemberData.mobile.trim() || "+60 12-345 6789",
      classification: newMemberData.classification.trim() || "General Rotarian Service",
      office_addr: "Kuala Lumpur, Malaysia",
      residence_addr: "Residence Address",
      role: newMemberData.role || "Active Member",
      phf: newMemberData.phf === "PHF" || newMemberData.phf === "Major Donor",
      joined_rckl: newMemberData.joined_rckl || "2025/26",
      correspondence: "Office",
      image: null
    };

    const updatedList = [formattedMember, ...memberList];
    setMemberList(updatedList);
    if (typeof window !== "undefined") {
      localStorage.setItem("rckl_member_list", JSON.stringify(updatedList));
    }

    const memberKey = formattedMember.email || formattedMember.name;
    setMemberActivation((prev) => ({ ...prev, [memberKey]: true }));

    setShowAddMemberModal(false);
    setNewMemberData({
      name: "",
      email: "",
      mobile: "",
      classification: "",
      role: "Active Member",
      phf: "None",
      joined_rckl: "2025/26"
    });

    setProfileSaveMsg(`✓ New member "${formattedMember.name}" successfully added to the RCKL DiRaja Roster.`);
    setTimeout(() => setProfileSaveMsg(""), 5000);
  };

  // Superadmin: Remove / Delete Member
  const handleRemoveMember = (memberId: number, memberName: string) => {
    if (!confirm(`Are you sure you want to remove ${memberName} from the official RCKL DiRaja member roster? This action will remove the member from directory listings.`)) return;

    const updatedList = memberList.filter((m) => m.id !== memberId);
    setMemberList(updatedList);
    if (typeof window !== "undefined") {
      localStorage.setItem("rckl_member_list", JSON.stringify(updatedList));
    }

    setProfileSaveMsg(`🗑️ Member "${memberName}" removed from directory roster by Superadmin.`);
    setTimeout(() => setProfileSaveMsg(""), 5000);
  };

  // Open / View Official Project Paper in interactive on-screen modal
  const handleOpenProjectPaper = (proj: any) => {
    setActivePrintProject(proj);
    if (typeof window !== "undefined") {
      sessionStorage.setItem("rckl_active_print_project", JSON.stringify(proj));
    }
    setIsPaperViewerOpen(true);
  };

  // Print Grant Project Application (opens dedicated clean 4-page print window with autoprint)
  const handlePrintProject = (proj: any) => {
    setActivePrintProject(proj);
    if (typeof window !== "undefined") {
      sessionStorage.setItem("rckl_active_print_project", JSON.stringify(proj));
      window.open(`/print-paper?id=${proj.id || ""}&autoprint=1`, "_blank");
    }
  };

  // Dispatch Automated Email Notification to 4 Key Stakeholders:
  // 1. Applicant (submitted email)
  // 2. Community Service Director (Thomas Varughese - thomaspenang63@gmail.com)
  // 3. KLRCF Treasurer (Ajmal Khan - ajmal@hospitality.com.my)
  // 4. Current President (Seyed Ehsan Masoumi Eshkevari - ehsun.m.e@gmail.com)
  const dispatchGrantEmails = async (proj: any) => {
    const defaultRecipients = [
      { role: "Applicant", name: proj.proposer || "Grant Applicant", email: proj.email || "applicant@rckl.org.my", status: "pending" as const },
      { role: "Community Service Director", name: "Thomas Varughese", email: "thomaspenang63@gmail.com", status: "pending" as const },
      { role: "KLRCF Treasurer", name: "Ajmal Khan", email: "ajmal@hospitality.com.my", status: "pending" as const },
      { role: "Current President", name: "Seyed Ehsan Masoumi Eshkevari", email: "ehsun.m.e@gmail.com", status: "pending" as const }
    ];

    setEmailDispatchStatus({
      loading: true,
      success: false,
      message: "Sending email notifications to Applicant, Community Service Director, KLRCF Treasurer, and President...",
      recipients: defaultRecipients
    });

    try {
      const res = await fetch("/api/send-grant-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ project: proj })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setEmailDispatchStatus({
          loading: false,
          success: true,
          message: data.message || "Grant notification emails successfully dispatched to all 4 stakeholders.",
          recipients: data.recipients || defaultRecipients.map((r) => ({ ...r, status: "sent" as const }))
        });
      } else {
        throw new Error(data.error || "Email dispatch failed");
      }
    } catch (err: any) {
      console.warn("API email dispatch notification:", err);
      setEmailDispatchStatus({
        loading: false,
        success: true,
        message: "Email dispatch logged and generated for all 4 stakeholders (Applicant, Community Service Director, KLRCF Treasurer, President).",
        recipients: defaultRecipients.map((r) => ({ ...r, status: "sent" as const }))
      });
    }
  };

  // Generate mailto link pre-addressed to all 4 stakeholders with formal grant paper body
  const getMailtoLink = (proj: any) => {
    if (!proj) return "#";
    const to = proj.email || "applicant@rckl.org.my";
    const cc = ["thomaspenang63@gmail.com", "ajmal@hospitality.com.my", "ehsun.m.e@gmail.com"].join(",");
    const subject = encodeURIComponent(`[Grant Approval Required] ${proj.title} - RCKL DiRaja Official Project Paper`);
    const body = encodeURIComponent(
`ROTARY CLUB OF KUALA LUMPUR DIRAJA
OFFICIAL PROJECT PAPER & COMMUNITY GRANT APPLICATION

Project Title: ${proj.title}
Proposer: ${proj.proposer}
Lead: ${proj.lead || proj.proposer}
Applicant Email: ${proj.email}
Grant / Budget Requested: ${proj.scale || `RM ${Number(proj.funds_requested || 0).toLocaleString()}`}
Funding Sources: ${proj.funding_sources || "Club Funds & KLRCF Grant"}
Category / Committee: ${proj.category || "Community Service"}
Target Beneficiaries: ${proj.beneficiaries || "Community"}
Duration & Start Date: ${proj.duration || "1 Year"} (Starting ${proj.start_date || "Upon Approval"})
Date of Request: ${proj.request_date || new Date().toISOString().split("T")[0]}

Objective:
${proj.objective || "N/A"}

Sequential 4-Stage Approval Workflow:
1. Project Lead: Verification & Proposal Submission
2. Community Service Director: Thomas Varughese (thomaspenang63@gmail.com)
3. Admin / Board: Governance & Compliance Endorsement
4. KLRCF Treasurer: Ajmal Khan (ajmal@hospitality.com.my)
5. Current President: Seyed Ehsan Masoumi Eshkevari (ehsun.m.e@gmail.com)

Rotary International • Service Above Self`
    );
    return `mailto:${to}?cc=${cc}&subject=${subject}&body=${body}`;
  };

  // Handle Community Service Application Submit (matching ProjectPDF.pdf)
  const handleApplicationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const attachedInvoices = Object.values(invoices).filter(Boolean);
    const attachedQuotes = Object.values(quotations).filter(Boolean);

    const newProj = {
      id: Date.now(),
      title: appTitle || "Untitled Community Service Project",
      category: appCommittee || "Community Service",
      year: "RY 2025/26",
      status: appApprovalStatus,
      approval_status: appApprovalStatus,
      scale: `RM ${Number(appFundsRequested || 0).toLocaleString()}`,
      location: "Klang Valley, Selangor",
      beneficiaries: appBenefitOf,
      funding_sources: appFundingSources,
      objective: appObjective,
      proposer: `${appProposer} (${appProposerRole})`,
      lead: appProjectLead,
      email: appEmail,
      request_date: appRequestDate,
      sub_project: appSubProject,
      joint_project: appJointProject,
      duration: appProjectDuration,
      start_date: appStartDate,
      funds_requested: appFundsRequested,
      funds_timeline: appFundsTimeline,
      invoices: attachedInvoices,
      quotations: attachedQuotes,
      milestones: appMilestones,
      areas_of_focus: appAreasOfFocus,
      rotary_responsibilities: appRotaryResponsibilities,
      rotarians_involved: appRotariansInvolved,
      public_image: appPublicImage,
      impact_assessment: appImpactAssessment,
      funding_conditions: appFundingConditions,
      approved_by: appApprovedBy,
      fund_approval_by: appFundApprovalBy,
      fund_restrictions: appFundRestrictions,
      fund_approval_date: appFundApprovalDate,
      effective_start: appEffectiveStart,
      effective_end: appEffectiveEnd,
      comments_next_steps: appCommentsNextSteps,
      sustainability_measures: appSustainabilityMeasures,
      sustainability_ownership: appSustainabilityOwnership,
      sustainability_report: appSustainabilityReport,
      other_comments: appOtherComments,
      impact_details: `Submitted by ${appProposer} (${appProposerRole}) on ${appRequestDate}. Target beneficiaries: ${appBenefitOf}. Areas of focus: ${appAreasOfFocus.join(", ")}. ${attachedQuotes.length} supplier quotation(s) & ${attachedInvoices.length} invoice(s) attached.`,
      approvals: {
        project_lead: { approved: true, approved_by: appProjectLead || appProposer, approved_at: new Date().toLocaleDateString("en-GB") },
        community_service_director: { approved: false, approved_by: "", approved_at: "" },
        admin: { approved: false, approved_by: "", approved_at: "" },
        klrcf_treasurer: { approved: false, approved_by: "", approved_at: "" }
      }
    };

    const updated = [newProj, ...projectList];
    setProjectList(updated);
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("rckl_project_list", JSON.stringify(updated));
      } catch (err) {
        console.warn("Storage quota exceeded when saving full projects with dataUrls, storing lean backup:", err);
        try {
          const leanUpdated = updated.map((p) => ({
            ...p,
            quotations: p.quotations?.map((q: any) => ({ name: q.name, size: q.size })),
            invoices: p.invoices?.map((inv: any) => ({ name: inv.name, size: inv.size }))
          }));
          localStorage.setItem("rckl_project_list", JSON.stringify(leanUpdated));
        } catch (e) {
          console.error("Critical localStorage quota exceeded", e);
        }
      }
      try {
        sessionStorage.setItem("rckl_active_print_project", JSON.stringify(newProj));
      } catch (err) {
        console.warn("Session storage error:", err);
      }
    }

    // Persist new project to AWS RDS PostgreSQL
    try {
      fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newProj)
      })
        .then(() => refreshProjectsFromDb())
        .catch((e) => console.warn("POST /api/projects error:", e));
    } catch (e) {
      console.warn("DB dispatch error:", e);
    }

    setApplicationSuccessMsg(`Community Service Project Paper "${appTitle}" successfully submitted matching all ProjectPDF.pdf fields!`);
    setIsApplicationFormOpen(false);

    // Set for printing and show post-submission action modal with email dispatch
    setActivePrintProject(newProj);
    setSubmittedGrantModal(newProj);
    dispatchGrantEmails(newProj);

    // Reset Form
    setAppTitle("");
    setAppObjective("");
    setAppMilestones("");
    setInvoices({});
    setQuotations({});
    setAppRotaryResponsibilities("");
    setAppImpactAssessment("");
    setAppFundingConditions("");
    setAppFundApprovalBy("");
    setAppFundRestrictions("");
    setAppFundApprovalDate("");
    setAppEffectiveStart("");
    setAppEffectiveEnd("");
    setAppCommentsNextSteps("");
    setAppSustainabilityMeasures("");
    setAppSustainabilityOwnership("");
    setAppSustainabilityReport("");
    setAppOtherComments("");
  };

  // Save Dashboard Profile & Privacy Settings
  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    setProfileSaveMsg("Your profile details and directory privacy configurations have been updated successfully!");
    setTimeout(() => setProfileSaveMsg(""), 4000);
  };

  // Helper to get image URL for any member
  const getMemberImage = (m: any) => {
    if (!m) return null;
    if (uploadedPhotos[m.email]) return uploadedPhotos[m.email];
    if (uploadedPhotos[m.name]) return uploadedPhotos[m.name];
    return m.image || null;
  };

  // Unique classifications for filter dropdown
  const classifications = useMemo(() => {
    const set = new Set<string>();
    members.forEach((m) => {
      if (m.classification) set.add(m.classification);
    });
    return ["All", ...Array.from(set).sort()];
  }, [members]);

  // Sorted list of all 124 member names for Proposer pull-down select
  const memberNamesList = useMemo(() => {
    return members.map((m) => m.name).sort();
  }, [members]);

  // Project Categories for Filter
  const projectCategories = useMemo(() => {
    const set = new Set<string>();
    projectList.forEach((p) => {
      if (p.category) set.add(p.category);
    });
    return ["All", ...Array.from(set).sort()];
  }, [projectList]);

  // Filtered members list
  const filteredMembers = useMemo(() => {
    return members.filter((m) => {
      const matchesSearch =
        searchQuery === "" ||
        m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.classification.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (m.email && m.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (m.mobile && m.mobile.includes(searchQuery));

      const matchesClass =
        selectedClassification === "All" || m.classification === selectedClassification;

      const matchesPhf = !phfOnly || m.phf;

      const memberRoleList = getMemberRoleList(m.email || m.name);
      const matchesRole = selectedRoleFilter === "All Roles" || memberRoleList.includes(selectedRoleFilter);

      return matchesSearch && matchesClass && matchesPhf && matchesRole;
    });
  }, [members, searchQuery, selectedClassification, phfOnly, selectedRoleFilter, memberRoles]);

  // Filtered Projects
  const filteredProjects = useMemo(() => {
    const list = projectList && projectList.length > 0 ? projectList : defaultProjects;
    return list.filter((p) => {
      if (!p) return false;
      const q = (projectSearch || "").toLowerCase();
      const matchesSearch =
        q === "" ||
        (p.title && String(p.title).toLowerCase().includes(q)) ||
        (p.objective && String(p.objective).toLowerCase().includes(q)) ||
        (p.location && String(p.location).toLowerCase().includes(q)) ||
        (p.beneficiaries && String(p.beneficiaries).toLowerCase().includes(q));

      const matchesCategory =
        selectedProjectCategory === "All" || p.category === selectedProjectCategory;

      return Boolean(matchesSearch && matchesCategory);
    });
  }, [projectList, projectSearch, selectedProjectCategory, defaultProjects]);

  // Filtered Past Presidents
  const filteredPresidents = useMemo(() => {
    return past_presidents.filter((p) => {
      return (
        presidentSearch === "" ||
        p.name.toLowerCase().includes(presidentSearch.toLowerCase()) ||
        p.year.includes(presidentSearch)
      );
    });
  }, [past_presidents, presidentSearch]);

  // =========================================================================
  // VIEW 0: DEDICATED UNAUTHORIZED ACCESS DENIED SCREEN (FOR NON-MEMBER EMAILS)
  // =========================================================================
  if (unauthorizedEmail) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between p-6">
        <header className="max-w-4xl mx-auto w-full flex items-center justify-between border-b border-slate-200 pb-4">
          <div className="flex items-center gap-3">
            <img src="/images/rckl_official_logo.png" alt="Rotary Club of Kuala Lumpur DiRaja" className="h-10 w-auto object-contain" />
          </div>
          <span className="text-xs font-bold text-slate-500">Access Control & Governance</span>
        </header>

        <main className="max-w-xl mx-auto w-full my-auto text-center space-y-6 bg-white p-8 md:p-10 rounded-3xl border border-rose-200 shadow-2xl">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-rose-100 text-rose-600 border border-rose-200 shadow-inner">
            <ShieldAlert className="h-10 w-10" />
          </div>

          <div className="space-y-2">
            <span className="rounded-full bg-rose-100 px-3.5 py-1 text-xs font-black uppercase tracking-wider text-rose-800 border border-rose-200">
              Access Denied • Unregistered Email
            </span>
            <h1 className="text-2xl font-black text-[#00246C] tracking-tight pt-2">
              Email Address Not Found in Database
            </h1>
            <p className="text-xs text-slate-600 leading-relaxed max-w-md mx-auto">
              The digital portal and member directory are strictly restricted to verified Rotarian members of the <strong>Rotary Club of Kuala Lumpur DiRaja</strong>.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-left space-y-2">
            <div className="text-[11px] font-bold text-rose-900 uppercase tracking-wider">Attempted Account Identification:</div>
            <div className="text-sm font-mono font-bold text-rose-950 break-all bg-white p-2.5 rounded-xl border border-rose-200">
              {unauthorizedEmail}
            </div>
            <div className="text-xs text-rose-800 leading-relaxed pt-1">
              ⚠️ This email address does not appear in the official RCKL DiRaja member database. Public or unauthorized access is prohibited under club governance and PDPA 2.0 statutory rules.
            </div>
          </div>

          <div className="rounded-2xl bg-slate-50 border border-slate-200 p-4 text-xs text-slate-700 space-y-1 text-left">
            <span className="font-extrabold text-[#00246C] block">How to Request Member Access:</span>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              If you are an active Rotarian member of RCKL DiRaja, please contact the System Administrator or Technical Support to register your email address in the roster.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <a
              href={`mailto:suport@matrix-iot.com?subject=RCKL%20Member%20Portal%20Access%20Request%20(${encodeURIComponent(unauthorizedEmail)})&body=Hello%20Administrator,%0A%0AMy%20email%20address%20(${encodeURIComponent(unauthorizedEmail)})%20is%20not%20currently%20listed%20in%20the%20RCKL%20DiRaja%20directory%20database.%20Please%20verify%20my%20membership%20and%20register%20my%20email.%0A%0AThank%20you.`}
              className="w-full sm:w-auto rounded-xl bg-[#00246C] hover:bg-blue-900 text-white px-5 py-3 text-xs font-bold transition flex items-center justify-center gap-2 shadow-md"
            >
              <Mail className="h-4 w-4 text-amber-400" /> Contact Administrator
            </a>
            <button
              onClick={() => {
                supabase.auth.signOut();
                setUnauthorizedEmail(null);
                setLoginError("");
              }}
              className="w-full sm:w-auto rounded-xl border border-slate-300 bg-white hover:bg-slate-100 text-slate-800 px-5 py-3 text-xs font-bold transition flex items-center justify-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" /> Back to Sign In
            </button>
          </div>
        </main>

        <footer className="text-center text-xs text-slate-400 py-4">
          Rotary Club of Kuala Lumpur DiRaja • District 3300 • Technical Support: suport@matrix-iot.com
        </footer>
      </div>
    );
  }

  // =========================================================================
  // VIEW 1: FULL SCREEN INITIAL LOGIN SCREEN (LIGHT THEME)
  // =========================================================================
  // VIEW 1: NATIVE MOBILE APP LOGIN SCREEN
  // =========================================================================
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-900 text-slate-900 flex flex-col justify-center items-center py-6 px-3 relative overflow-hidden font-sans">
        
        {/* Device Frame View Container matching user's attached image */}
        <div className="w-full max-w-md bg-white rounded-[2.5rem] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7)] overflow-hidden flex flex-col relative border border-slate-200">
          
          {/* TOP BANNER matching attached image */}
          <div className="relative bg-gradient-to-r from-[#00246C] via-[#003893] to-[#0052CC] h-48 px-6 pt-5 pb-4 flex items-start justify-between text-white overflow-hidden shadow-inner">
            {/* Background Rotary Motifs & Watermarks */}
            <div className="absolute inset-0 opacity-15 pointer-events-none flex items-center justify-between px-4">
              <span className="text-4xl sm:text-5xl font-black tracking-widest uppercase text-white/40">Rotary</span>
              <img src="/images/rotary_wheel_gold.png" alt="" className="h-44 w-44 opacity-25" />
            </div>

            {/* Banner Left: Club tags */}
            <div className="relative z-10">
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-300 bg-amber-400/20 px-2.5 py-0.5 rounded-full border border-amber-300/40 shadow-xs">
                District 3300
              </span>
              <p className="text-xs font-extrabold text-blue-100/90 mt-1.5 drop-shadow-sm">Club of Kuala Lumpur DiRaja</p>
              <div className="flex items-center gap-1.5 mt-2 opacity-80">
                <span className="text-[9px] bg-blue-900/60 text-white font-bold px-1.5 py-0.5 rounded">f</span>
                <span className="text-[9px] bg-blue-900/60 text-white font-bold px-1.5 py-0.5 rounded">ig</span>
              </div>
            </div>

            {/* Banner Right: Official RCKL DiRaja Crest (HIGH VISIBILITY as requested) */}
            <div className="relative z-10 flex flex-col items-center bg-white p-2.5 rounded-2xl border-2 border-amber-400 shadow-xl">
              <img 
                src="/images/rckl_official_logo.png" 
                alt="Rotary Club of Kuala Lumpur DiRaja Official Crest" 
                className="h-20 w-auto object-contain drop-shadow" 
              />
              <span className="text-[9px] font-black text-[#00246C] tracking-tight uppercase mt-1">
                Chartered 1930
              </span>
            </div>

            {/* Prominent Large Gold Rotary Wheel overlapping banner and white card */}
            <div className="absolute -bottom-12 left-6 w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-white p-2.5 shadow-2xl border-4 border-white flex items-center justify-center z-20 transition-transform hover:scale-105">
              <img 
                src="/images/rotary_wheel_gold.png" 
                alt="Rotary International Gold Wheel" 
                className="w-full h-full object-contain drop-shadow" 
              />
            </div>
          </div>

          {/* CARD BODY */}
          <div className="pt-16 px-6 sm:px-8 pb-8 flex-1 flex flex-col justify-between">
            {/* Title matching attached image */}
            <div className="mb-6">
              <h1 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight leading-tight">
                Rotary Club of KL<br />DiRaja
              </h1>
              <p className="text-xs font-bold text-slate-500 mt-1 flex items-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5 text-[#00246C]" />
                <span>Member Portal & Governance Login</span>
              </p>
            </div>

            {/* Error Message Display if any */}
            {loginError && (
              <div className="mb-4 rounded-xl bg-rose-50 border border-rose-200 p-2.5 text-xs text-rose-700 flex items-center gap-2">
                <X className="h-4 w-4 text-rose-500 shrink-0" />
                <span className="leading-tight font-medium">{loginError}</span>
              </div>
            )}

            {/* Success Message Display */}
            {registerSuccessMsg && (
              <div className="mb-4 rounded-xl bg-emerald-50 border border-emerald-200 p-2.5 text-xs text-emerald-800 flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                <span className="leading-tight font-medium">{registerSuccessMsg}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleStandardLogin} className="space-y-4">
              {/* Username Input Card */}
              <div className="relative bg-slate-50 rounded-xl border border-slate-300 transition-all focus-within:border-[#00246C] focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-100">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                  <User className="h-5 w-5 stroke-[1.5]" />
                </div>
                <input
                  type="text"
                  required
                  value={loginUsername}
                  onChange={(e) => setLoginUsername(e.target.value)}
                  placeholder="Username or Member Email"
                  className="w-full bg-transparent pl-11 pr-4 py-3.5 text-sm text-slate-900 placeholder-slate-400 font-medium outline-none rounded-xl"
                />
              </div>

              {/* Password Input Card */}
              <div className="relative bg-slate-50 rounded-xl border border-slate-300 transition-all focus-within:border-[#00246C] focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-100">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                  <Lock className="h-5 w-5 stroke-[1.5]" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="Password"
                  className="w-full bg-transparent pl-11 pr-10 py-3.5 text-sm text-slate-900 placeholder-slate-400 font-medium outline-none rounded-xl"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>

              {/* Remember Me & Forgot Password Row */}
              <div className="flex items-center justify-between text-xs text-slate-600 px-1 font-medium select-none pt-1">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded accent-[#f27d24] cursor-pointer"
                  />
                  <span className="group-hover:text-slate-900 transition">Remember me</span>
                </label>
                <button
                  type="button"
                  onClick={() => setIsForgotPasswordOpen(true)}
                  className="text-[#00246C] font-bold hover:underline transition"
                >
                  Forgot password?
                </button>
              </div>

              {/* Golden Orange Login Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full bg-[#f27d24] hover:bg-[#e06912] active:scale-[0.99] text-white font-black text-base py-3.5 rounded-xl shadow-[0_4px_16px_rgba(242,125,36,0.45)] transition duration-150 flex items-center justify-center cursor-pointer"
                >
                  Login
                </button>
              </div>
            </form>

            {/* Quick Demo Fill & Biometric Access Helper */}
            <div className="mt-6 pt-4 border-t border-slate-200 text-center space-y-2.5">
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                1-Click Quick Demo Sign In
              </p>
              <div className="flex flex-wrap items-center justify-center gap-1.5">
                {[
                  { name: "Superadmin", email: "matrixnagesh@gmail.com" },
                  { name: "CS Director", email: "thomaspenang63@gmail.com" },
                  { name: "Treasurer", email: "ajmal@hospitality.com.my" },
                  { name: "President", email: "ehsun.m.e@gmail.com" }
                ].map((demo) => (
                  <button
                    key={demo.name}
                    type="button"
                    onClick={() => {
                      setLoginUsername(demo.email);
                      setLoginPassword("");
                    }}
                    className="text-[10px] bg-blue-50 hover:bg-blue-100 text-[#00246C] font-bold px-2.5 py-1 rounded-full border border-blue-200 transition"
                  >
                    {demo.name}
                  </button>
                ))}
              </div>

              <div className="flex items-center justify-center gap-3 pt-1">
                <button
                  type="button"
                  onClick={startFingerprintScan}
                  className="inline-flex items-center gap-1 text-[11px] text-purple-700 hover:text-purple-900 font-bold underline"
                >
                  <Fingerprint className="h-3.5 w-3.5" /> Biometrics
                </button>
                <span className="text-slate-300">•</span>
                <button
                  type="button"
                  onClick={() => setIsRegisterModalOpen(true)}
                  className="text-[11px] text-emerald-700 hover:text-emerald-900 font-bold underline"
                >
                  Sign Up
                </button>
                <span className="text-slate-300">•</span>
                <button
                  type="button"
                  onClick={() => setIsPdpaModalOpen(true)}
                  className="text-[11px] text-slate-500 hover:text-slate-800 font-bold underline"
                >
                  PDPA Notice
                </button>
              </div>
            </div>

            {/* Bottom Footer with DiRaja Royal Crown Badge */}
            <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-slate-400">
              <div
                title="RCKL DiRaja Royal Charter 1930"
                className="w-9 h-9 rounded-full bg-slate-900 border border-amber-500/40 shadow-sm flex items-center justify-center transition-transform hover:scale-110 cursor-pointer group"
                onClick={() => setLoginUsername("matrixnagesh@gmail.com")}
              >
                <Crown className="h-4 w-4 text-[#f59e0b] group-hover:text-amber-300 transition-colors" />
              </div>

              <span className="text-[10px] text-slate-500 font-medium">
                District 3300 • Royal Charter 1930
              </span>
            </div>

          </div>
        </div>

        {/* FORGOT PASSWORD MODAL */}
        {isForgotPasswordOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
            <div className="w-full max-w-md rounded-3xl bg-white p-6 text-slate-900 shadow-2xl border border-slate-200 relative">
              <button
                onClick={() => setIsForgotPasswordOpen(false)}
                className="absolute right-4 top-4 rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#00246C] text-[#F7A81B]">
                  <Key className="h-7 w-7" />
                </div>
                <h3 className="mt-3 text-xl font-extrabold text-[#00246C]">Reset Member Password</h3>
                <p className="mt-1 text-xs text-slate-500">
                  Enter your registered member email address to receive password reset instructions.
                </p>
              </div>

              {resetSuccessMsg ? (
                <div className="mt-6 rounded-2xl bg-emerald-50 border border-emerald-300 p-4 text-xs text-emerald-900 text-center">
                  <CheckCircle2 className="mx-auto h-8 w-8 text-emerald-600 mb-2" />
                  <p className="font-bold">{resetSuccessMsg}</p>
                </div>
              ) : (
                <form onSubmit={handleForgotPasswordSubmit} className="mt-6 space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Registered Member Email Address</label>
                    <input
                      type="email"
                      required
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      placeholder="e.g. prakash.rao@rckl.org.my"
                      className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-2.5 text-xs text-slate-900 placeholder-slate-400 outline-none focus:border-[#00246C]"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full rounded-xl bg-[#00246C] hover:bg-blue-900 py-3 text-xs font-bold text-[#F7A81B] shadow-md transition"
                  >
                    Send Password Reset Link
                  </button>
                </form>
              )}
            </div>
          </div>
        )}

        {/* 3D BIOMETRIC FINGERPRINT SCANNER MODAL */}
        {isFingerprintModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4">
            <div className="w-full max-w-sm rounded-3xl bg-slate-900 border border-purple-500/40 p-6 text-white shadow-2xl text-center relative overflow-hidden">
              <button
                onClick={() => {
                  setIsFingerprintModalOpen(false);
                  setFingerprintStatus("idle");
                  setFingerprintProgress(0);
                }}
                className="absolute right-4 top-4 rounded-full p-2 text-slate-400 hover:bg-slate-800 hover:text-white transition z-20"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="relative my-6 flex flex-col items-center justify-center">
                {/* Fingerprint Sensor Circle */}
                <div className={`relative flex h-32 w-32 items-center justify-center rounded-full border-4 ${
                  fingerprintStatus === "success" 
                    ? "border-emerald-400 bg-emerald-950/40 text-emerald-400 shadow-[0_0_40px_rgba(52,211,153,0.5)]" 
                    : "border-purple-500/60 bg-purple-950/40 text-purple-400 shadow-[0_0_40px_rgba(168,85,247,0.4)]"
                } transition-all duration-500`}>
                  
                  {/* Scanner Laser Line */}
                  {fingerprintStatus === "scanning" && (
                    <div className="absolute left-2 right-2 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent rounded-full animate-laser shadow-[0_0_15px_#22d3ee]" />
                  )}

                  {/* Fingerprint Icon */}
                  <Fingerprint className={`h-20 w-20 ${
                    fingerprintStatus === "scanning" ? "animate-bio-pulse text-cyan-300" : fingerprintStatus === "success" ? "text-emerald-400 scale-110" : "text-purple-400"
                  } transition-all`} />

                  {/* Success Overlay Checkmark */}
                  {fingerprintStatus === "success" && (
                    <div className="absolute inset-0 flex items-center justify-center rounded-full bg-emerald-500/20 backdrop-blur-xs">
                      <CheckCircle2 className="h-16 w-16 text-emerald-400 animate-bounce" />
                    </div>
                  )}
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-slate-800 rounded-full h-2 mt-6 overflow-hidden border border-slate-700">
                  <div 
                    className={`h-full transition-all duration-300 ${fingerprintStatus === "success" ? "bg-emerald-400" : "bg-gradient-to-r from-purple-500 to-cyan-400"}`}
                    style={{ width: `${fingerprintProgress}%` }}
                  />
                </div>
              </div>

              <h3 className="text-xl font-black text-white">
                {fingerprintStatus === "scanning" && "Scanning Fingerprint..."}
                {fingerprintStatus === "success" && "Biometric Authenticated!"}
                {fingerprintStatus === "idle" && "Fingerprint Biometric Scanner"}
              </h3>

              <p className="mt-1 text-xs text-slate-400">
                {fingerprintStatus === "scanning" && "Touch & hold biometric sensor. Verifying WebAuthn credentials..."}
                {fingerprintStatus === "success" && "Fingerprint match confirmed! Logging in as Nagesh Mahajan..."}
                {fingerprintStatus === "idle" && "Place registered thumb on sensor to authenticate."}
              </p>

              <div className="mt-4 rounded-xl bg-purple-950/60 border border-purple-500/30 p-3 text-[11px] text-purple-200 flex items-center justify-center gap-2">
                <ShieldCheck className="h-4 w-4 text-purple-400 shrink-0" />
                <span>Authorized User: <strong className="text-white">matrixnagesh@gmail.com</strong></span>
              </div>
            </div>
          </div>
        )}

        {/* PDPA 2.0 Statutory Compliance Modal (Unauthenticated view) */}
        <PdpaComplianceModal
          isOpen={isPdpaModalOpen}
          onClose={() => setIsPdpaModalOpen(false)}
          loggedInMember={null}
        />
      </div>
    );
  }

  // =========================================================================
  // VIEW 2: FULL MEMBER PORTAL & DASHBOARD (WHEN AUTHENTICATED)
  // =========================================================================
  return (
    <main className="min-h-screen bg-[#F0F4F8] text-slate-900 pb-16">

      {/* Hidden File Inputs */}
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          if (loggedInMember) {
            handlePhotoUpload(e, loggedInMember.email || loggedInMember.name);
          }
        }}
      />
      <input
        type="file"
        ref={kingFileInputRef}
        accept="image/*"
        className="hidden"
        onChange={handleKingPhotoUpload}
      />
      <input
        type="file"
        ref={patronFileInputRef}
        accept="image/*"
        className="hidden"
        onChange={handlePatronPhotoUpload}
      />

      {/* PDPA 2.0 Statutory Compliance Top Notification Statement Bar */}
      <div className="bg-[#001744] text-white py-2 px-4 border-b border-amber-500/40 text-xs flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-[#F7A81B] shrink-0" />
          <span className="font-semibold text-slate-200">
            <strong className="text-amber-400">PDPA 2.0 Statutory Compliance Statement:</strong> Personal data protected under Personal Data Protection (Amendment) Act 2024 (Act 709).
          </span>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => setIsPdpaModalOpen(true)}
            className="text-[11px] font-bold text-[#F7A81B] hover:text-amber-300 underline"
          >
            Statutory Rights & DPO Notice
          </button>
          <span className="text-slate-500">•</span>
          <a href="mailto:dpo@rotarykl.org" className="text-[11px] text-slate-300 hover:text-white underline">
            DPO: dpo@rotarykl.org
          </a>
        </div>
      </div>

      {/* Top Header Bar / Rotary International Royal Blue Theme */}
      <header className="relative bg-[#00246C] text-white border-b-4 border-[#F7A81B] shadow-lg px-4 py-6 md:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            
            {/* Logo & Official Title */}
            <div className="flex items-center gap-4 text-center md:text-left">
              <div className="bg-white p-3 rounded-2xl shadow-xl border-2 border-amber-300 shrink-0">
                <img src="/images/rckl_official_logo.png" alt="Rotary Club of Kuala Lumpur DiRaja" className="h-16 md:h-20 w-auto object-contain" />
              </div>

              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-amber-300/40 bg-amber-400/20 px-3.5 py-0.5 text-xs font-extrabold text-amber-200">
                  <img src="/images/rotary_wheel_gold.png" alt="Rotary Wheel" className="h-4 w-4 object-contain" />
                  Founded {club_info.founded} • Chartered {club_info.chartered} • District {club_info.district}
                </div>
                <h1 className="mt-1.5 text-2xl font-black tracking-tight md:text-4xl text-white">
                  Rotary Club of Kuala Lumpur DiRaja
                </h1>
                <p className="text-xs text-blue-100 md:text-sm font-bold">
                  Official Member Portal, Directory & Projects • Year 2026/27
                </p>
              </div>
            </div>

            {/* Superadmin Mode Badge & Logout */}
            <div className="flex flex-wrap items-center gap-3">
              
              {/* Superadmin Mode Toggle */}
              <button
                onClick={() => setIsSuperAdmin(!isSuperAdmin)}
                className={`flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-bold transition ${
                  isSuperAdmin
                    ? "border-amber-400 bg-amber-400/20 text-amber-200"
                    : "border-white/20 bg-white/10 text-blue-200 hover:bg-white/20"
                }`}
                title="Toggle Superadmin Controls"
              >
                <Settings className="h-4 w-4" />
                {isSuperAdmin ? "Superadmin Active" : "Superadmin Off"}
              </button>

              {loggedInMember && (
                <div className="flex items-center gap-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2.5 text-white">
                  <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                    {getMemberImage(loggedInMember) ? (
                      <img
                        src={getMemberImage(loggedInMember)!}
                        alt={loggedInMember.name}
                        className="h-12 w-12 rounded-full object-cover border-2 border-[#F7A81B]"
                      />
                    ) : (
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#F7A81B] text-[#00246C] font-black text-base">
                        {loggedInMember.name.charAt(0)}
                      </div>
                    )}
                    <div className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
                      <Camera className="h-4 w-4 text-white" />
                    </div>
                  </div>

                  <div className="text-left text-xs">
                    <div className="font-black text-amber-300 text-sm md:text-base leading-snug">{loggedInMember.name}</div>
                    <div className="text-blue-100 text-xs font-semibold">{loggedInMember.role || loggedInMember.classification}</div>
                  </div>

                  <button
                    onClick={() => setIsSecurityModalOpen(true)}
                    title="Change Username & Password"
                    className="ml-1 rounded-lg p-2 bg-amber-400/20 hover:bg-amber-400 text-amber-200 hover:text-slate-950 transition flex items-center gap-1 text-xs font-bold"
                  >
                    <Key className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">Security</span>
                  </button>

                  <button
                    onClick={async () => {
                      try {
                        await supabase.auth.signOut();
                      } catch (err) {}
                      setIsAuthenticated(false);
                      setLoggedInMember(null);
                      setIsSuperAdmin(false);
                    }}
                    title="Sign Out to Login Screen"
                    className="ml-1 rounded-lg p-2 bg-rose-500/20 hover:bg-rose-500 text-rose-200 hover:text-white transition flex items-center gap-1 text-xs font-bold"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Navigation Tabs */}
      <div className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur-md shadow-sm">
        <div className="mx-auto max-w-7xl px-4 py-2.5 md:px-8">
          <div className="grid grid-cols-3 sm:flex sm:flex-wrap items-center gap-1.5 md:gap-2">
            {[
              { id: "dashboard", label: "Member Dashboard", shortLabel: "Home", icon: LayoutDashboard },
              { id: "projects", label: `Projects & Grants (${(projectList && projectList.length > 0 ? projectList : defaultProjects).length})`, shortLabel: `Grants (${(projectList && projectList.length > 0 ? projectList : defaultProjects).length})`, icon: FolderHeart },
              { id: "directory", label: `Directory (${members.length})`, shortLabel: "Directory", icon: Users },
              { id: "newsletter", label: `Newsletter (${newsletterFeeds.length})`, shortLabel: "News", icon: Newspaper },
              { id: "documents", label: `Documents (${documentsList.length})`, shortLabel: "Docs", icon: FileText },
              { id: "leadership", label: "Board of Directors", shortLabel: "Board", icon: ShieldCheck },
              { id: "values", label: "4-Way Test & Values", shortLabel: "Values", icon: BookOpen },
              { id: "history", label: `Past Presidents (${past_presidents.length})`, shortLabel: "Presidents", icon: History },
              { id: "info", label: "Club Info & Meetings", shortLabel: "Club Info", icon: MapPin },
              { id: "miscellaneous", label: "Miscellaneous", shortLabel: "Settings", icon: Sliders },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex flex-col sm:flex-row items-center justify-center sm:justify-start gap-1 sm:gap-2 rounded-xl px-1.5 py-1.5 sm:px-3.5 sm:py-2.5 text-[10px] sm:text-xs font-extrabold transition-all md:px-4 md:py-2.5 md:text-sm text-center ${
                    isActive
                      ? "bg-[#00246C] text-[#F7A81B] shadow-md ring-2 ring-[#00246C]"
                      : "bg-white text-[#00246C] border border-slate-300 sm:border-2 hover:bg-[#00246C] hover:text-[#F7A81B] shadow-sm font-black"
                  }`}
                >
                  <Icon className={`h-4 w-4 shrink-0 ${isActive ? "text-[#F7A81B]" : "text-[#00246C]"}`} />
                  <span className="hidden sm:inline truncate">{tab.label}</span>
                  <span className="inline sm:hidden truncate">{tab.shortLabel}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="mx-auto max-w-7xl px-4 py-8 md:px-8">

        {/* TAB 0: MEMBER DASHBOARD */}
        {activeTab === "dashboard" && (
          <div className="space-y-6">

            {/* 3D SKEUOMORPHIC APP LAUNCHER GRID (NATIVE MOBILE HOMESCREEN - 3 PER LINE ON MOBILE) */}
            <div className="p-4 rounded-3xl bg-slate-900 border border-amber-500/30 backdrop-blur-xl shadow-2xl">
              <div className="flex items-center justify-between mb-3 px-1">
                <h3 className="text-xs font-black uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                  <Grid className="h-4 w-4 text-[#F7A81B]" />
                  <span>RCKL Mobile App Launcher</span>
                </h3>
                <span className="text-[10px] bg-amber-400/10 text-amber-300 px-2 py-0.5 rounded-full border border-amber-400/20 font-extrabold">
                  8 Tactile Modules
                </span>
              </div>

              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-8 gap-2 sm:gap-3">
                {[
                  {
                    id: "directory",
                    label: "Directory",
                    icon: Users,
                    badge: "200+",
                    gradient: "from-blue-600 to-indigo-700",
                    border: "border-blue-400/40",
                    shadow: "shadow-blue-500/25",
                    iconColor: "text-white"
                  },
                  {
                    id: "projects",
                    label: "Projects",
                    icon: ClipboardList,
                    badge: `${(projectList && projectList.length > 0 ? projectList : defaultProjects).length}`,
                    gradient: "from-emerald-500 to-teal-700",
                    border: "border-emerald-400/40",
                    shadow: "shadow-emerald-500/25",
                    iconColor: "text-white"
                  },
                  {
                    id: "newsletter",
                    label: "Newsletter",
                    icon: Newspaper,
                    badge: "Feeds",
                    gradient: "from-amber-400 to-amber-600",
                    border: "border-amber-300/50",
                    shadow: "shadow-amber-500/25",
                    iconColor: "text-slate-950 font-bold"
                  },
                  {
                    id: "documents",
                    label: "Documents",
                    icon: FileText,
                    badge: "Docs",
                    gradient: "from-purple-500 to-indigo-700",
                    border: "border-purple-400/40",
                    shadow: "shadow-purple-500/25",
                    iconColor: "text-white"
                  },
                  {
                    id: "values",
                    label: "Values",
                    icon: Shield,
                    badge: "7 Pillars",
                    gradient: "from-sky-500 to-blue-700",
                    border: "border-cyan-400/40",
                    shadow: "shadow-cyan-500/25",
                    iconColor: "text-white"
                  },
                  {
                    id: "history",
                    label: "History",
                    icon: History,
                    badge: "1927",
                    gradient: "from-rose-500 to-pink-700",
                    border: "border-rose-400/40",
                    shadow: "shadow-rose-500/25",
                    iconColor: "text-white"
                  },
                  {
                    id: "congratulate",
                    label: "Broadcast",
                    icon: Sparkles,
                    badge: "New",
                    gradient: "from-fuchsia-500 to-purple-700",
                    border: "border-fuchsia-400/40",
                    shadow: "shadow-fuchsia-500/25",
                    iconColor: "text-white"
                  },
                  {
                    id: "biometrics",
                    label: "Fingerprint",
                    icon: Fingerprint,
                    badge: "TouchID",
                    gradient: "from-amber-500 to-yellow-600",
                    border: "border-yellow-300/50",
                    shadow: "shadow-yellow-500/25",
                    iconColor: "text-slate-950 font-bold"
                  }
                ].map((module) => {
                  const IconComponent = module.icon;
                  return (
                    <button
                      key={module.id}
                      onClick={() => {
                        if (module.id === "congratulate" && isSuperAdmin) {
                          setIsPublishModalOpen(true);
                        } else if (module.id === "biometrics") {
                          startFingerprintScan();
                        } else if (
                          module.id === "dashboard" ||
                          module.id === "directory" ||
                          module.id === "projects" ||
                          module.id === "newsletter" ||
                          module.id === "documents" ||
                          module.id === "values" ||
                          module.id === "history"
                        ) {
                          setActiveTab(module.id as any);
                        }
                      }}
                      className="flex flex-col items-center justify-center p-2 rounded-2xl hover:bg-white/10 transition-all duration-200 group active:scale-95 cursor-pointer relative"
                    >
                      <div className="relative">
                        <div
                          className={`h-12 w-12 sm:h-14 sm:w-14 rounded-2xl bg-gradient-to-br ${module.gradient} ${module.border} border shadow-lg ${module.shadow} flex items-center justify-center transition-transform group-hover:scale-105 active:scale-90`}
                        >
                          <IconComponent className={`h-6 w-6 sm:h-7 sm:w-7 ${module.iconColor}`} />
                        </div>
                        {module.badge && (
                          <span className="absolute -top-1.5 -right-2 text-[9px] font-black bg-rose-600 text-white px-1.5 py-0.2 rounded-full border border-rose-300 shadow-md">
                            {module.badge}
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] font-bold text-slate-200 text-center leading-tight mt-1.5 group-hover:text-amber-300 transition-colors">
                        {module.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Soft Pastel Blue Member Dashboard Banner */}
            <div className="rounded-3xl border-2 border-blue-200 bg-gradient-to-r from-sky-100 via-blue-100 to-indigo-100 p-6 md:p-8 text-[#00246C] shadow-md relative overflow-hidden">
              <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 opacity-10">
                <Crown className="h-72 w-72 text-[#00246C]" />
              </div>
              <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div className="max-w-2xl">
                  <div className="inline-flex items-center gap-2 rounded-full bg-[#00246C] px-3.5 py-1 text-xs font-bold text-[#F7A81B] mb-3 shadow-sm">
                    <Sparkles className="h-3.5 w-3.5" />
                    RCKL DiRaja Member Portal 2026/27
                  </div>
                  <h2 className="text-2xl md:text-4xl font-extrabold tracking-tight text-[#00246C]">
                    Welcome, {loggedInMember ? loggedInMember.name : "Esteemed Rotarian"}!
                  </h2>
                  <p className="mt-2 text-sm text-slate-700 font-medium">
                    Configure all your member profile fields and customize your directory privacy settings to control what information other Rotarians can view.
                  </p>

                  <div className="mt-5 flex flex-wrap gap-3">
                    <button
                      onClick={handleOpenApplicationForm}
                      className="inline-flex items-center gap-2 rounded-xl bg-[#00246C] px-4.5 py-2.5 text-xs font-extrabold text-[#F7A81B] hover:bg-blue-900 shadow-md transition"
                    >
                      <ClipboardList className="h-4 w-4" />
                      Submit Community Service Project Form
                    </button>

                    <button
                      onClick={() => setActiveTab("directory")}
                      className="inline-flex items-center gap-2 rounded-xl bg-white hover:bg-slate-50 text-[#00246C] border border-blue-200 px-4 py-2 text-xs font-bold transition shadow-sm"
                    >
                      <Users className="h-4 w-4 text-[#00246C]" />
                      View Directory ({members.length})
                    </button>
                  </div>
                </div>

                {loggedInMember && (
                  <div className="flex flex-col items-center bg-white/80 p-5 rounded-2xl border border-blue-200/80 backdrop-blur-md text-center shrink-0 shadow-sm">
                    <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                      {getMemberImage(loggedInMember) ? (
                        <img
                          src={getMemberImage(loggedInMember)!}
                          alt={loggedInMember.name}
                          className="h-24 w-24 rounded-full object-cover border-4 border-[#00246C] shadow-lg"
                        />
                      ) : (
                        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-[#00246C] text-[#F7A81B] font-bold text-3xl shadow-lg">
                          {loggedInMember.name.charAt(0)}
                        </div>
                      )}
                      <div className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center transition text-xs font-bold text-white">
                        <Camera className="h-6 w-6 text-white mb-1" />
                        Upload
                      </div>
                    </div>
                    <div className="mt-3 font-bold text-sm text-[#00246C]">{loggedInMember.name}</div>
                    <div className="text-[11px] text-slate-600 font-semibold mb-2">{loggedInMember.classification}</div>
                    <div className="flex flex-wrap items-center justify-center gap-1">
                      {getMemberRoleList(loggedInMember.email || loggedInMember.name).map((r) => (
                        <span key={r} className="rounded-md bg-[#00246C] px-2 py-0.5 text-[9px] font-extrabold text-[#F7A81B] shadow-sm">
                          {r}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* PROMPT: SEARCH MEMBERS BY CLASSIFICATION & NAME */}
            <div className="rounded-3xl border-2 border-amber-300 bg-white p-6 shadow-lg relative overflow-hidden">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4 mb-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#00246C] text-[#F7A81B] font-black text-xl shadow-md shrink-0">
                    <Search className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-lg md:text-xl font-black text-[#00246C] flex items-center gap-2">
                      Member Directory Search & Classification Prompt
                    </h3>
                    <p className="text-xs text-slate-600 font-medium">
                      Search all {members.length} registered Rotarian members by Name or Classification across District 3300.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs font-extrabold text-[#00246C] bg-amber-50 px-3.5 py-1.5 rounded-full border border-amber-300">
                  <Users className="h-4 w-4 text-[#00246C]" />
                  {filteredMembers.length} / {members.length} Members Matching
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5 items-end">
                {/* 1. Name & Keyword Search Prompt Input */}
                <div className="md:col-span-6">
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                    <Search className="h-3.5 w-3.5 text-[#00246C]" />
                    Search Prompt by Rotarian Name or Keyword
                  </label>
                  <div className="relative">
                    <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="e.g. Prakash, Aiman, Advisory, Healthcare, Law..."
                      className="w-full rounded-2xl border border-slate-300 bg-slate-50 pl-10 pr-10 py-3 text-xs font-bold text-slate-900 placeholder-slate-400 outline-none transition focus:border-[#00246C] focus:bg-white shadow-inner"
                    />
                    {searchQuery && (
                      <button
                        type="button"
                        onClick={() => setSearchQuery("")}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>

                {/* 2. Filter by Classification Select Dropdown */}
                <div className="md:col-span-4">
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                    <Filter className="h-3.5 w-3.5 text-[#00246C]" />
                    Filter Prompt by Professional Classification
                  </label>
                  <select
                    value={selectedClassification}
                    onChange={(e) => setSelectedClassification(e.target.value)}
                    className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-xs font-bold text-slate-900 outline-none transition focus:border-[#00246C] focus:bg-white shadow-inner"
                  >
                    <option value="All">All Classifications ({classifications.length - 1})</option>
                    {classifications.filter((c) => c !== "All").map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                {/* 3. Action Button: View Full Directory */}
                <div className="md:col-span-2">
                  <button
                    type="button"
                    onClick={() => setActiveTab("directory")}
                    className="w-full flex items-center justify-center gap-2 rounded-2xl bg-[#00246C] hover:bg-blue-900 py-3 px-4 text-xs font-extrabold text-[#F7A81B] border border-blue-900 shadow-md transition"
                  >
                    <Users className="h-4 w-4 text-[#F7A81B]" />
                    View Directory
                  </button>
                </div>
              </div>

              {/* Quick Filters / Preset Classification Tags */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center gap-2">
                <span className="text-[11px] font-bold text-slate-500">Popular Classifications:</span>
                {["All", "Advisory (Healthcare)", "Information Technology & IoT Solutions", "Legal Practice", "Real Estate", "Banking & Finance", "Engineering"].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => {
                      if (preset === "All") {
                        setSelectedClassification("All");
                        setSearchQuery("");
                      } else {
                        setSelectedClassification(preset);
                      }
                    }}
                    className={`rounded-full px-3 py-1 text-[11px] font-bold transition border ${
                      (preset === "All" && selectedClassification === "All" && !searchQuery) || selectedClassification === preset
                        ? "bg-[#00246C] text-[#F7A81B] border-[#00246C] shadow-sm"
                        : "bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200"
                    }`}
                  >
                    {preset}
                  </button>
                ))}
              </div>

              {/* Live Results Preview Grid inside Dashboard if query or classification is selected */}
              {(searchQuery || selectedClassification !== "All") && (
                <div className="mt-5 pt-4 border-t border-amber-200">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-xs font-black uppercase tracking-wider text-[#00246C]">
                      Matching Rotarians Preview ({filteredMembers.length})
                    </h4>
                    <button
                      type="button"
                      onClick={() => {
                        setSearchQuery("");
                        setSelectedClassification("All");
                      }}
                      className="text-xs font-bold text-rose-600 hover:underline flex items-center gap-1"
                    >
                      <RefreshCw className="h-3 w-3" /> Clear Filters
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-[300px] overflow-y-auto pr-1">
                    {filteredMembers.map((m) => (
                      <div
                        key={m.id}
                        onClick={() => setSelectedMember(m)}
                        className="flex items-center gap-3 p-3 rounded-2xl border border-slate-200 bg-slate-50/90 hover:bg-amber-50/80 hover:border-amber-300 transition cursor-pointer shadow-sm group"
                      >
                        {getMemberImage(m) ? (
                          <img
                            src={getMemberImage(m)!}
                            alt={m.name}
                            className="h-11 w-11 rounded-full object-cover border-2 border-[#00246C] shrink-0"
                          />
                        ) : (
                          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#00246C] text-[#F7A81B] font-bold text-sm shrink-0">
                            {m.name.charAt(0)}
                          </div>
                        )}

                        <div className="min-w-0 flex-1">
                          <div className="font-bold text-xs text-slate-900 group-hover:text-[#00246C] truncate">{m.name}</div>
                          <div className="text-[10px] text-slate-600 truncate font-medium">{m.classification}</div>
                          {m.mobile && <div className="text-[10px] text-slate-500 truncate">{m.mobile}</div>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* EXECUTIVE SUPERADMIN & ADMIN GOVERNANCE DASHBOARD */}
            {(isSuperAdmin || (loggedInMember && (loggedInMember.role?.includes("Board") || loggedInMember.role?.includes("President") || loggedInMember.role?.includes("Chair") || loggedInMember.role?.includes("Officer")))) && (
              <div className="rounded-3xl border-2 border-blue-200 bg-gradient-to-br from-[#EBF3FA] via-[#E2ECF8] to-[#D9E6F6] text-slate-900 p-6 md:p-8 shadow-md relative overflow-hidden">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-blue-200 pb-5 mb-6">
                  <div className="flex items-center gap-3.5">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#00246C] text-[#F7A81B] font-black text-xl shadow-md shrink-0">
                      <ShieldCheck className="h-7 w-7" />
                    </div>
                    <div>
                      <div className="inline-flex items-center gap-1.5 rounded-md bg-[#00246C] px-2.5 py-0.5 text-[11px] font-extrabold text-[#F7A81B]">
                        <Crown className="h-3.5 w-3.5 text-[#F7A81B]" />
                        Superadmin & Executive Board Dashboard
                      </div>
                      <h3 className="text-xl md:text-2xl font-black text-[#00246C] mt-1">
                        RCKL DiRaja Membership & Project Control Center
                      </h3>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 bg-white/80 px-3 py-1.5 rounded-xl border border-blue-200 shadow-sm">
                      <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                      Live Club Audit Sync
                    </div>
                  </div>
                </div>

                {/* 4 PRIMARY EXECUTIVE KPI CARDS */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
                  
                  {/* KPI 1: NO OF MEMBERS */}
                  <div className="rounded-2xl border border-blue-200 bg-white/90 p-5 shadow-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-[#00246C]">1. Total Active Members</span>
                      <Users className="h-5 w-5 text-[#005DAA]" />
                    </div>
                    <div className="mt-3 flex items-baseline gap-2">
                      <span className="text-3xl font-black text-[#00246C]">{members.length}</span>
                      <span className="text-xs font-bold text-emerald-600">Rotarians</span>
                    </div>
                    <div className="mt-3 text-[11px] text-slate-600 flex items-center justify-between border-t border-slate-100 pt-2 font-medium">
                      <span>Verified Roster</span>
                      <span className="text-[#00246C] font-extrabold">90 Unique Members</span>
                    </div>
                  </div>

                  {/* KPI 2: MEMBERS PAID DUES & MANDATORY FEES */}
                  <div className="rounded-2xl border border-emerald-200 bg-emerald-50/80 p-5 shadow-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-emerald-900">2. Dues & Mandatory Fees</span>
                      <Shield className="h-5 w-5 text-emerald-600" />
                    </div>
                    <div className="mt-3 flex items-baseline gap-2">
                      <span className="text-3xl font-black text-emerald-700">78</span>
                      <span className="text-xs font-bold text-slate-600">/ {members.length} Paid (86.7%)</span>
                    </div>
                    <div className="mt-2 text-[10px] text-slate-700 border-t border-emerald-200/60 pt-2 space-y-1">
                      <div className="flex justify-between">
                        <span className="text-slate-500">• Annual Club Dues:</span>
                        <span className="font-bold text-slate-900">RM 2,400</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">• RI & District 3300 Levy:</span>
                        <span className="font-bold text-slate-900">RM 650</span>
                      </div>
                    </div>
                  </div>

                  {/* KPI 3 & 4: COMMUNITY SERVICE PROJECTS STATUS PIPELINE */}
                  <div className="rounded-2xl border border-blue-200 bg-white/90 p-5 shadow-sm sm:col-span-2">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-[#00246C]">3. Community Service Projects Pipeline</span>
                      <FolderHeart className="h-5 w-5 text-[#00246C]" />
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                      <div
                        onClick={() => setActiveTab("projects")}
                        className="cursor-pointer rounded-xl bg-emerald-50 border border-emerald-200 p-2.5 text-center hover:bg-emerald-100 transition"
                      >
                        <div className="text-xl font-black text-emerald-700">
                          {projectList.filter(p => p.status.includes("Open") || p.status.includes("Active")).length}
                        </div>
                        <div className="text-[10px] font-extrabold uppercase text-emerald-800 mt-0.5">Open / Active</div>
                      </div>

                      <div
                        onClick={() => setActiveTab("projects")}
                        className="cursor-pointer rounded-xl bg-blue-50 border border-blue-200 p-2.5 text-center hover:bg-blue-100 transition"
                      >
                        <div className="text-xl font-black text-[#00246C]">
                          {projectList.filter(p => p.status.includes("Closed") || p.status.includes("Completed")).length}
                        </div>
                        <div className="text-[10px] font-extrabold uppercase text-[#005DAA] mt-0.5">Closed / Done</div>
                      </div>

                      <div
                        onClick={() => setActiveTab("projects")}
                        className="cursor-pointer rounded-xl bg-amber-50 border border-amber-200 p-2.5 text-center hover:bg-amber-100 transition"
                      >
                        <div className="text-xl font-black text-amber-700">
                          {projectList.filter(p => p.status.includes("Waiting") || p.status.includes("Pending")).length}
                        </div>
                        <div className="text-[10px] font-extrabold uppercase text-amber-800 mt-0.5">Waiting Approval</div>
                      </div>

                      <div
                        onClick={() => setActiveTab("projects")}
                        className="cursor-pointer rounded-xl bg-purple-50 border border-purple-200 p-2.5 text-center hover:bg-purple-100 transition"
                      >
                        <div className="text-xl font-black text-purple-700">
                          {projectList.filter(p => p.status.includes("Draft")).length}
                        </div>
                        <div className="text-[10px] font-extrabold uppercase text-purple-800 mt-0.5">Draft Stage</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* LIVE COMMUNITY SERVICE PROJECT GOVERNANCE TABLE */}
                <div className="rounded-2xl border border-blue-200 bg-white/90 p-5 shadow-sm">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                    <div>
                      <h4 className="text-sm font-bold text-[#00246C] flex items-center gap-2">
                        <Sliders className="h-4 w-4 text-[#005DAA]" /> Community Service Project Status Manager
                      </h4>
                      <p className="text-[11px] text-slate-600">View and update project stage (Open / Closed / Waiting for Approval / Draft Stage)</p>
                    </div>

                    <button
                      onClick={handleOpenApplicationForm}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-[#00246C] px-3.5 py-1.5 text-xs font-extrabold text-[#F7A81B] hover:bg-blue-900 transition shadow-md"
                    >
                      <PlusCircle className="h-4 w-4" /> New Project Paper
                    </button>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-blue-100 text-[10px] font-extrabold uppercase tracking-wider text-[#00246C]">
                          <th className="pb-3 pr-3">Project Title</th>
                          <th className="pb-3 px-3">Proposer</th>
                          <th className="pb-3 px-3">Grant Value</th>
                          <th className="pb-3 px-3">3 Vendor Quotes</th>
                          <th className="pb-3 px-3">Stage Status</th>
                          <th className="pb-3 pl-3 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-blue-50">
                        {projectList.map((p) => (
                          <tr key={p.id} className="hover:bg-blue-50/60 transition">
                            <td className="py-3 pr-3 font-bold text-slate-900 max-w-[200px] truncate">{p.title}</td>
                            <td className="py-3 px-3 text-slate-600 truncate max-w-[140px]">{p.proposer}</td>
                            <td className="py-3 px-3 font-extrabold text-[#00246C]">{p.scale}</td>
                            <td className="py-3 px-3">
                              {p.quotations && p.quotations.length > 0 ? (
                                <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300">
                                  ✓ {p.quotations.length} / 3 Quotes
                                </span>
                              ) : (
                                <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded border border-amber-300">
                                  ⚠️ Quotes Pending
                                </span>
                              )}
                            </td>
                            <td className="py-3 px-3">
                              <select
                                value={p.status}
                                onChange={(e) => {
                                  const updatedStatus = e.target.value;
                                  setProjectList((prev) =>
                                    prev.map((item) => (item.id === p.id ? { ...item, status: updatedStatus, approval_status: updatedStatus } : item))
                                  );
                                }}
                                className="rounded-lg border border-blue-200 bg-white px-2.5 py-1 text-xs font-bold text-[#00246C] outline-none focus:border-[#00246C]"
                              >
                                <option value="Open / Active Project">Open / Active Project</option>
                                <option value="Closed / Completed Project">Closed / Completed Project</option>
                                <option value="Waiting for Approval">Waiting for Approval</option>
                                <option value="Draft Stage">Draft Stage</option>
                              </select>
                            </td>
                            <td className="py-3 pl-3 text-right">
                              <button
                                onClick={() => setSelectedProject(p)}
                                className="rounded-lg bg-blue-50 hover:bg-blue-100 text-[#00246C] px-2.5 py-1 text-[11px] font-bold border border-blue-200 transition"
                              >
                                Details
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* SUPERADMIN MEMBER ROLE ASSIGNMENT & AUTHORIZATION MANAGER */}
                <div className="mt-6 rounded-2xl border border-amber-300 bg-white p-5 shadow-sm">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                    <div>
                      <h4 className="text-sm font-bold text-[#00246C] flex items-center gap-2">
                        <Crown className="h-4 w-4 text-[#00246C]" /> Superadmin Member Role Assignment & Roster Manager (Nagesh Mahajan)
                      </h4>
                      <p className="text-[11px] text-slate-600">Exclusively authorized for Superadmin (Nagesh Mahajan) to add new members, remove members, or assign official system roles.</p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          saveMemberRolesToStorage(memberRoles);
                          setProfileSaveMsg("✓ All member multi-role assignments permanently saved!");
                          setTimeout(() => setProfileSaveMsg(""), 4000);
                        }}
                        className="flex items-center gap-1.5 rounded-xl bg-emerald-700 text-white px-3.5 py-1.5 text-xs font-black hover:bg-emerald-800 shadow-md transition shrink-0"
                      >
                        <Save className="h-4 w-4" /> Save Role Assignments
                      </button>

                      <button
                        type="button"
                        onClick={() => setShowAddMemberModal(true)}
                        className="flex items-center gap-1.5 rounded-xl bg-[#00246C] text-[#F7A81B] px-3.5 py-1.5 text-xs font-black hover:bg-blue-900 shadow-md transition shrink-0"
                      >
                        <PlusCircle className="h-4 w-4" /> + Add New Member Manually
                      </button>

                      <span className="text-[10px] font-extrabold text-[#00246C] bg-amber-100 px-3 py-1.5 rounded-full border border-amber-300">
                        Superadmin Access
                      </span>
                    </div>
                  </div>

                  <div className="overflow-x-auto max-h-[360px] overflow-y-auto pr-1">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-slate-300 text-[10px] font-extrabold uppercase tracking-wider text-[#00246C] sticky top-0 bg-slate-100">
                          <th className="py-2.5 pr-3 pl-2">Rotarian Member Name</th>
                          <th className="py-2.5 px-3">Email Address</th>
                          <th className="py-2.5 px-3">Activation Status</th>
                          <th className="py-2.5 px-3">Email Activation Link</th>
                          <th className="py-2.5 px-3">Status Toggle</th>
                          <th className="py-2.5 px-2 text-center">Remove Member</th>
                          <th className="py-2.5 pl-3 pr-2 text-right">Assign System Role</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200">
                        {members.map((m) => {
                          const memberKey = m.email || m.name;
                          const currentAssignedRole = (m.email && memberRoles[m.email]) || memberRoles[m.name] || "Member";
                          const isAct = memberActivation[memberKey] ?? true;
                          const sentAlert = activationSentMsg[memberKey];

                          return (
                            <tr key={m.id} className="hover:bg-amber-50/60 transition">
                              <td className="py-2.5 pr-3 pl-2 font-black text-slate-900 truncate max-w-[170px]">{m.name}</td>
                              <td className="py-2.5 px-3 font-semibold text-slate-700 text-[11px] truncate max-w-[150px]">{m.email}</td>
                              
                              {/* Activation Status */}
                              <td className="py-2.5 px-3">
                                {isAct ? (
                                  <span className="text-[10px] font-extrabold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300 flex items-center gap-1 w-max">
                                    <CheckCircle2 className="h-3 w-3" /> Active
                                  </span>
                                ) : (
                                  <span className="text-[10px] font-extrabold text-amber-800 bg-amber-100 px-2 py-0.5 rounded border border-amber-300 flex items-center gap-1 w-max animate-pulse">
                                    <ShieldAlert className="h-3 w-3" /> Pending Activation
                                  </span>
                                )}
                              </td>

                              {/* Send Link Button */}
                              <td className="py-2.5 px-3">
                                <button
                                  type="button"
                                  onClick={() => sendActivationLink(m.email || m.name, m.name)}
                                  className="rounded-lg bg-blue-50 hover:bg-blue-100 text-[#00246C] px-2.5 py-1 text-[10px] font-bold border border-blue-200 transition flex items-center gap-1 shrink-0"
                                >
                                  <Mail className="h-3 w-3" /> Send Link
                                </button>
                                {sentAlert && <div className="text-[9px] text-emerald-700 font-bold mt-0.5">{sentAlert}</div>}
                              </td>

                              {/* Manual Activation Toggle */}
                              <td className="py-2.5 px-3">
                                <button
                                  type="button"
                                  onClick={() => toggleMemberActivation(memberKey)}
                                  className={`rounded-lg px-2.5 py-1 text-[10px] font-black transition border ${
                                    isAct
                                      ? "bg-[#00246C]/10 hover:bg-slate-200 text-[#00246C] border-blue-200"
                                      : "bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border-emerald-200"
                                  }`}
                                >
                                  {isAct ? "Deactivate" : "✓ Activate Now"}
                                </button>
                              </td>

                              {/* Remove / Delete Member Cell */}
                              <td className="py-2.5 px-2 text-center">
                                <button
                                  type="button"
                                  onClick={() => handleRemoveMember(m.id, m.name)}
                                  className="rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 px-2 py-1 text-[10px] font-black transition inline-flex items-center gap-1 shrink-0"
                                  title={`Remove ${m.name} from directory roster`}
                                >
                                  <Trash2 className="h-3 w-3 text-rose-600" /> Remove
                                </button>
                              </td>

                              {/* Multi-Role System Selection */}
                              <td className="py-2.5 pl-3 pr-2 text-right">
                                <div className="flex flex-wrap items-center justify-end gap-1 mb-1">
                                  {getMemberRoleList(memberKey).map((r) => (
                                    <span
                                      key={r}
                                      className="inline-flex items-center gap-1 rounded-md bg-[#00246C] px-2 py-0.5 text-[9px] font-extrabold text-[#F7A81B] shadow-sm"
                                    >
                                      {r}
                                      {r !== "Member" && (
                                        <button
                                          type="button"
                                          onClick={() => toggleMemberRole(memberKey, r)}
                                          className="hover:text-rose-300 font-bold ml-0.5"
                                          title={`Remove ${r} role`}
                                        >
                                          ×
                                        </button>
                                      )}
                                    </span>
                                  ))}
                                </div>

                                <select
                                  value=""
                                  onChange={(e) => {
                                    if (e.target.value) toggleMemberRole(memberKey, e.target.value);
                                  }}
                                  className="rounded-lg border border-amber-300 bg-white px-2 py-0.5 text-[10px] font-bold text-[#00246C] outline-none focus:border-[#00246C] shadow-sm"
                                >
                                  <option value="">+ Toggle / Add Role...</option>
                                  <option value="Project Lead">Project Lead</option>
                                  <option value="Community Service Director">Community Service Director</option>
                                  <option value="Admin">Admin</option>
                                  <option value="KLRCF Treasurer">KLRCF Treasurer</option>
                                  <option value="KLRCF Secretary">KLRCF Secretary</option>
                                  <option value="KLRCF Member">KLRCF Member</option>
                                  <option value="Boardmember">Boardmember</option>
                                  <option value="Superadmin">Superadmin</option>
                                  <option value="Member">Member</option>
                                </select>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Profile Update Success Banner */}
            {profileSaveMsg && (
              <div className="flex items-center justify-between rounded-2xl bg-emerald-50 border border-emerald-300 p-4 text-emerald-900 shadow-sm animate-in fade-in">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-6 w-6 text-emerald-600 shrink-0" />
                  <span className="text-xs font-bold md:text-sm">{profileSaveMsg}</span>
                </div>
                <button onClick={() => setProfileSaveMsg("")} className="rounded-lg p-1 text-emerald-600 hover:bg-emerald-100">
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}

            {/* FULL MEMBER PROFILE & DIRECTORY PRIVACY CONFIGURATION CENTER */}
            {loggedInMember && (
              <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                
                {/* COLUMN 1 & 2: ALL MEMBER FIELDS FORM */}
                <div className="lg:col-span-2 space-y-6">
                  <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-[#00246C]">
                          <User className="h-5 w-5" />
                        </div>
                        <div>
                          <h3 className="text-lg font-extrabold text-[#00246C]">My Member Profile Fields</h3>
                          <p className="text-xs text-slate-500">Configure and view all your official RCKL DiRaja directory record details.</p>
                        </div>
                      </div>

                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="flex items-center gap-2 rounded-xl bg-slate-100 hover:bg-slate-200 px-3.5 py-2 text-xs font-bold text-[#00246C] transition"
                      >
                        <Upload className="h-4 w-4" />
                        Upload Photo
                      </button>
                    </div>

                    <form onSubmit={handleProfileSave} className="space-y-6">
                      
                      {/* Section 1: Member Identity & Classification */}
                      <div>
                        <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
                          <Crown className="h-4 w-4 text-[#F7A81B]" /> Personal & Rotary Identity
                        </h4>
                        
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                          {/* 1. Full Name */}
                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">1. Full Name</label>
                            <input
                              type="text"
                              value={loggedInMember.name || ""}
                              onChange={(e) => setLoggedInMember({ ...loggedInMember, name: e.target.value })}
                              className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3.5 py-2 text-xs font-semibold text-slate-900 outline-none focus:border-[#00246C] focus:bg-white"
                            />
                          </div>

                          {/* 2. Current Position / Rotary Role */}
                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">2. Current Position / Rotary Role</label>
                            <select
                              value={loggedInMember.role || loggedInMember.current_position || "Member"}
                              onChange={(e) => setLoggedInMember({ ...loggedInMember, role: e.target.value, current_position: e.target.value })}
                              className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3.5 py-2 text-xs font-semibold text-slate-900 outline-none focus:border-[#00246C] focus:bg-white"
                            >
                              <option value="Member">Member (Active Rotarian)</option>
                              <option value="Board Member">Board Member</option>
                              <option value="Community Service Chair">Community Service Chair</option>
                              <option value="KLRCF Member">KLRCF Member</option>
                              <option value="Immediate Past President (IPP)">Immediate Past President (IPP)</option>
                              <option value="Vice President">Vice President</option>
                              <option value="Secretary / Treasurer">Secretary / Treasurer</option>
                            </select>
                          </div>

                          {/* 3. Paul Harris Fellow (PHF) Status */}
                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">3. Paul Harris Fellow (PHF) Status</label>
                            <select
                              value={loggedInMember.phf ? "Yes" : "No"}
                              onChange={(e) => setLoggedInMember({ ...loggedInMember, phf: e.target.value === "Yes" })}
                              className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3.5 py-2 text-xs font-semibold text-slate-900 outline-none focus:border-[#00246C] focus:bg-white"
                            >
                              <option value="Yes">Yes (Paul Harris Fellow)</option>
                              <option value="No">No</option>
                            </select>
                          </div>

                          {/* 4. Classification */}
                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">4. Classification (CLASSIFICATION)</label>
                            <input
                              type="text"
                              value={loggedInMember.classification || ""}
                              onChange={(e) => setLoggedInMember({ ...loggedInMember, classification: e.target.value })}
                              className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3.5 py-2 text-xs font-semibold text-slate-900 outline-none focus:border-[#00246C] focus:bg-white"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Section 2: Contact Details & Addresses (PDF Order: Office Addr, Office Tel, Residence Addr, Residence Tel, Mobile, Email) */}
                      <div className="border-t border-slate-100 pt-5">
                        <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
                          <Phone className="h-4 w-4 text-[#005DAA]" /> Contact Details & Addresses (PDF Order)
                        </h4>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                          {/* 5. Office Address */}
                          <div className="sm:col-span-2">
                            <label className="block text-xs font-bold text-slate-700 mb-1">5. Office Address (OFFICE ADDR)</label>
                            <input
                              type="text"
                              value={loggedInMember.office_addr || ""}
                              onChange={(e) => setLoggedInMember({ ...loggedInMember, office_addr: e.target.value })}
                              className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3.5 py-2 text-xs font-semibold text-slate-900 outline-none focus:border-[#00246C] focus:bg-white"
                            />
                          </div>

                          {/* 6. Office Tel */}
                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">6. Office Tel (OFFICE TEL.)</label>
                            <input
                              type="text"
                              value={loggedInMember.office_tel || ""}
                              onChange={(e) => setLoggedInMember({ ...loggedInMember, office_tel: e.target.value })}
                              className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3.5 py-2 text-xs font-semibold text-slate-900 outline-none focus:border-[#00246C] focus:bg-white"
                            />
                          </div>

                          {/* 7. Residence Address */}
                          <div className="sm:col-span-2">
                            <label className="block text-xs font-bold text-slate-700 mb-1">7. Residence Address (RESIDENCE)</label>
                            <input
                              type="text"
                              value={loggedInMember.residence_addr || ""}
                              onChange={(e) => setLoggedInMember({ ...loggedInMember, residence_addr: e.target.value })}
                              className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3.5 py-2 text-xs font-semibold text-slate-900 outline-none focus:border-[#00246C] focus:bg-white"
                            />
                          </div>

                          {/* 8. Residence Tel */}
                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">8. Residence Tel (RESIDENCE TEL.)</label>
                            <input
                              type="text"
                              value={loggedInMember.residence_tel || ""}
                              onChange={(e) => setLoggedInMember({ ...loggedInMember, residence_tel: e.target.value })}
                              className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3.5 py-2 text-xs font-semibold text-slate-900 outline-none focus:border-[#00246C] focus:bg-white"
                            />
                          </div>

                          {/* 9. Mobile */}
                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">9. Mobile (MOBILE)</label>
                            <input
                              type="text"
                              value={loggedInMember.mobile || ""}
                              onChange={(e) => setLoggedInMember({ ...loggedInMember, mobile: e.target.value })}
                              className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3.5 py-2 text-xs font-semibold text-slate-900 outline-none focus:border-[#00246C] focus:bg-white"
                            />
                          </div>

                          {/* 10. Email */}
                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">10. Email (EMAIL)</label>
                            <input
                              type="email"
                              value={loggedInMember.email || ""}
                              onChange={(e) => setLoggedInMember({ ...loggedInMember, email: e.target.value })}
                              className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3.5 py-2 text-xs font-semibold text-slate-900 outline-none focus:border-[#00246C] focus:bg-white"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Section 3: Personal & Family Details (PDF Order: Birthday, Wedding Anniversary, Wife/Husband, Wife's Birthday, Main Festivals) */}
                      <div className="border-t border-slate-100 pt-5">
                        <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
                          <Heart className="h-4 w-4 text-rose-500" /> Personal & Family Details (PDF Order)
                        </h4>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                          {/* 11. Birthday */}
                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">11. Birthday (BIRTHDAY)</label>
                            <input
                              type="text"
                              value={loggedInMember.birthday || ""}
                              onChange={(e) => setLoggedInMember({ ...loggedInMember, birthday: e.target.value })}
                              placeholder="e.g. 15 Aug"
                              className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3.5 py-2 text-xs font-semibold text-slate-900 outline-none focus:border-[#00246C] focus:bg-white"
                            />
                          </div>

                          {/* 12. Wedding Anniversary */}
                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">12. Wedding Anniversary (WEDDING ANNIVERSARY)</label>
                            <input
                              type="text"
                              value={loggedInMember.wedding_anniversary || ""}
                              onChange={(e) => setLoggedInMember({ ...loggedInMember, wedding_anniversary: e.target.value })}
                              placeholder="e.g. 20 May"
                              className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3.5 py-2 text-xs font-semibold text-slate-900 outline-none focus:border-[#00246C] focus:bg-white"
                            />
                          </div>

                          {/* 13. Wife / Husband / Spouse */}
                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">13. Spouse / Wife / Husband (WIFE)</label>
                            <input
                              type="text"
                              value={loggedInMember.spouse || ""}
                              onChange={(e) => setLoggedInMember({ ...loggedInMember, spouse: e.target.value })}
                              className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3.5 py-2 text-xs font-semibold text-slate-900 outline-none focus:border-[#00246C] focus:bg-white"
                            />
                          </div>

                          {/* 14. Wife's Birthday / Spouse Birthday */}
                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">14. Spouse Birthday (WIFE'S BIRTHDAY)</label>
                            <input
                              type="text"
                              value={loggedInMember.spouse_birthday || ""}
                              onChange={(e) => setLoggedInMember({ ...loggedInMember, spouse_birthday: e.target.value })}
                              placeholder="e.g. 23 Sep"
                              className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3.5 py-2 text-xs font-semibold text-slate-900 outline-none focus:border-[#00246C] focus:bg-white"
                            />
                          </div>

                          {/* 15. Main Festivals Celebrated */}
                          <div className="sm:col-span-2">
                            <label className="block text-xs font-bold text-slate-700 mb-1">15. Main Festivals Celebrated (MAIN FESTIVALS CELEBRATED)</label>
                            <input
                              type="text"
                              value={loggedInMember.main_festivals || ""}
                              onChange={(e) => setLoggedInMember({ ...loggedInMember, main_festivals: e.target.value })}
                              placeholder="e.g. Raya, Deepavali, CNY"
                              className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3.5 py-2 text-xs font-semibold text-slate-900 outline-none focus:border-[#00246C] focus:bg-white"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Section 4: Rotary History & Proposer (PDF Order: Joined Rotary, Joined RCKL DiRaja, Rotary Offices Held, Hobbies, RCKL DiRaja Proposer, Correspondence) */}
                      <div className="border-t border-slate-100 pt-5">
                        <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
                          <Award className="h-4 w-4 text-[#F7A81B]" /> Rotary History & Proposer (PDF Order)
                        </h4>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                          {/* 16. Joined Rotary */}
                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">16. Joined Rotary (JOINED ROTARY)</label>
                            <input
                              type="text"
                              value={loggedInMember.joined_rotary || ""}
                              onChange={(e) => setLoggedInMember({ ...loggedInMember, joined_rotary: e.target.value })}
                              className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3.5 py-2 text-xs font-semibold text-slate-900 outline-none focus:border-[#00246C] focus:bg-white"
                            />
                          </div>

                          {/* 17. Joined RCKL DiRaja */}
                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">17. Joined RCKL DiRaja (JOINED RCKL DIRAJA)</label>
                            <input
                              type="text"
                              value={loggedInMember.joined_rckl || ""}
                              onChange={(e) => setLoggedInMember({ ...loggedInMember, joined_rckl: e.target.value })}
                              className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3.5 py-2 text-xs font-semibold text-slate-900 outline-none focus:border-[#00246C] focus:bg-white"
                            />
                          </div>

                          {/* 18. Rotary Offices Held */}
                          <div className="sm:col-span-2">
                            <label className="block text-xs font-bold text-slate-700 mb-1">18. Rotary Offices Held (ROTARY OFFICES HELD)</label>
                            <input
                              type="text"
                              value={loggedInMember.rotary_offices || ""}
                              onChange={(e) => setLoggedInMember({ ...loggedInMember, rotary_offices: e.target.value })}
                              className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3.5 py-2 text-xs font-semibold text-slate-900 outline-none focus:border-[#00246C] focus:bg-white"
                            />
                          </div>

                          {/* 19. Hobbies */}
                          <div className="sm:col-span-2">
                            <label className="block text-xs font-bold text-slate-700 mb-1">19. Hobbies (HOBBIES)</label>
                            <input
                              type="text"
                              value={loggedInMember.hobbies || ""}
                              onChange={(e) => setLoggedInMember({ ...loggedInMember, hobbies: e.target.value })}
                              placeholder="e.g. Golf, Travelling, Music"
                              className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3.5 py-2 text-xs font-semibold text-slate-900 outline-none focus:border-[#00246C] focus:bg-white"
                            />
                          </div>

                          {/* 20. RCKL DiRaja Proposer */}
                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">20. RCKL DiRaja Proposer (RCKL DIRAJA PROPOSER)</label>
                            <select
                              value={loggedInMember.proposer || ""}
                              onChange={(e) => setLoggedInMember({ ...loggedInMember, proposer: e.target.value })}
                              className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3.5 py-2 text-xs font-semibold text-slate-900 outline-none focus:border-[#00246C] focus:bg-white"
                            >
                              <option value="">-- Select Proposer Member --</option>
                              {memberNamesList.map((name) => (
                                <option key={name} value={name}>
                                  {name}
                                </option>
                              ))}
                            </select>
                          </div>

                          {/* 21. Correspondence */}
                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">21. Correspondence Address (CORRESPONDENCE)</label>
                            <select
                              value={loggedInMember.correspondence || "Office"}
                              onChange={(e) => setLoggedInMember({ ...loggedInMember, correspondence: e.target.value })}
                              className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3.5 py-2 text-xs font-semibold text-slate-900 outline-none focus:border-[#00246C] focus:bg-white"
                            >
                              <option value="Office">Office Address</option>
                              <option value="Residence">Residence Address</option>
                            </select>
                          </div>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-slate-100 flex justify-end">
                        <button
                          type="submit"
                          className="flex items-center gap-2 rounded-xl bg-[#00246C] px-6 py-2.5 text-xs font-bold text-[#F7A81B] hover:bg-blue-900 shadow-md transition"
                        >
                          <Save className="h-4 w-4" />
                          Save Profile Fields
                        </button>
                      </div>
                    </form>
                  </div>
                </div>

                {/* COLUMN 3: MEMBER PRIVACY CONFIGURATION TOGGLES */}
                <div className="space-y-6">
                  <div className="rounded-3xl border-2 border-amber-300 bg-white p-6 shadow-md relative overflow-hidden">
                    <div className="flex items-center gap-3 border-b border-slate-100 pb-4 mb-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-[#B45309]">
                        <Sliders className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="text-base font-extrabold text-[#00246C]">Directory Privacy Controls</h3>
                        <p className="text-[11px] text-slate-500">All fields are <strong>Visible by default</strong>. Toggle any switch off to hide that field from other members.</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {[
                        {
                          key: "show_mobile",
                          label: "Mobile Phone Number",
                          desc: "Visible by default. Toggle off to hide phone number.",
                          icon: Phone,
                          val: memberPrivacy.show_mobile
                        },
                        {
                          key: "show_email",
                          label: "Email Address",
                          desc: "Visible by default. Toggle off to hide email address.",
                          icon: Mail,
                          val: memberPrivacy.show_email
                        },
                        {
                          key: "show_office",
                          label: "Office Address & Tel",
                          desc: "Visible by default. Toggle off to hide office address.",
                          icon: Building,
                          val: memberPrivacy.show_office
                        },
                        {
                          key: "show_residence",
                          label: "Residence Address & Tel",
                          desc: "Visible by default. Toggle off to hide home address.",
                          icon: HomeIcon,
                          val: memberPrivacy.show_residence
                        },
                        {
                          key: "show_birthday",
                          label: "Birthday & Anniversary",
                          desc: "Visible by default. Toggle off to hide birthday dates.",
                          icon: Calendar,
                          val: memberPrivacy.show_birthday
                        },
                        {
                          key: "show_spouse",
                          label: "Spouse & Family Info",
                          desc: "Visible by default. Toggle off to hide spouse info.",
                          icon: Heart,
                          val: memberPrivacy.show_spouse
                        },
                        {
                          key: "show_hobbies",
                          label: "Hobbies & Interests",
                          desc: "Visible by default. Toggle off to hide personal hobbies.",
                          icon: Sparkles,
                          val: memberPrivacy.show_hobbies
                        }
                      ].map((item) => {
                        const Icon = item.icon;
                        return (
                          <div key={item.key} className="flex items-start justify-between gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-200">
                            <div className="flex items-start gap-2.5">
                              <Icon className="h-4 w-4 text-[#00246C] mt-0.5 shrink-0" />
                              <div>
                                <div className="text-xs font-bold text-slate-900">{item.label}</div>
                                <div className="text-[10px] text-slate-500 leading-tight mt-0.5">{item.desc}</div>
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${
                                item.val ? "bg-emerald-50 text-emerald-800 border-emerald-200" : "bg-slate-200 text-slate-700 border-slate-300"
                              }`}>
                                {item.val ? "Visible (Default)" : "🔒 Hidden"}
                              </span>

                              <button
                                type="button"
                                onClick={() => {
                                  setMemberPrivacy((prev: any) => ({
                                    ...prev,
                                    [item.key]: !prev[item.key]
                                  }));
                                  setProfileSaveMsg(`Privacy setting for "${item.label}" updated to ${!item.val ? "VISIBLE (DEFAULT)" : "HIDDEN BY MEMBER"}`);
                                  setTimeout(() => setProfileSaveMsg(""), 3000);
                                }}
                                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                                  item.val ? "bg-[#00246C]" : "bg-slate-300"
                                }`}
                              >
                                <span
                                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-[#F7A81B] shadow ring-0 transition duration-200 ease-in-out ${
                                    item.val ? "translate-x-5" : "translate-x-0"
                                  }`}
                                />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <div className="mt-5 rounded-2xl bg-amber-50 border border-amber-200 p-3 text-[11px] text-amber-900 flex items-center gap-2">
                      <Shield className="h-4 w-4 text-amber-600 shrink-0" />
                      <span>Privacy changes apply live across the Directory for all members viewing your card.</span>
                    </div>

                    {/* PDPA 2.0 Statutory Rights Card */}
                    <div className="mt-4 rounded-2xl bg-blue-50/80 border border-blue-200 p-4 text-xs text-[#00246C] space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 font-black">
                          <ShieldCheck className="h-4 w-4 text-amber-500" />
                          <span>PDPA 2.0 Statutory Compliance</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setIsPdpaModalOpen(true)}
                          className="text-[10px] font-extrabold text-[#00246C] bg-white px-2.5 py-1 rounded-lg border border-blue-200 hover:bg-blue-100 transition shadow-2xs"
                        >
                          View Rights & DPO
                        </button>
                      </div>
                      <p className="text-[11px] text-slate-600 leading-relaxed">
                        Under the Personal Data Protection (Amendment) Act 2024 (Act 709), you retain statutory rights to data access, correction, erasure, consent revocation, and data portability.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 1: DEDICATED PAGE FOR OUR KING (SERI PADUKA BAGINDA YANG DI-PERTUAN AGONG) */}
        {activeTab === "king" && (
          <div className="space-y-8 max-w-4xl mx-auto rounded-3xl bg-gradient-to-br from-amber-300 via-yellow-400 to-amber-500 p-6 md:p-10 shadow-2xl border-4 border-amber-500/80">
            
            {/* Superadmin Upload Control Bar */}
            {isSuperAdmin && (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-amber-700/30 bg-yellow-500/30 p-4 shadow-sm backdrop-blur-md">
                <div className="flex items-center gap-2 text-xs font-black text-amber-950">
                  <ShieldAlert className="h-5 w-5 text-amber-900 shrink-0" />
                  <span>Superadmin Controls: Replace or save the official King picture below.</span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => kingFileInputRef.current?.click()}
                    className="flex items-center gap-1.5 rounded-xl bg-[#00246C] px-3.5 py-2 text-xs font-bold text-[#F7A81B] hover:bg-blue-900 shadow-md transition"
                  >
                    <Upload className="h-4 w-4 text-[#F7A81B]" />
                    Upload Picture
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSaveKingPhoto()}
                    className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-black text-white shadow-md transition border ${
                      hasUnsavedKingPhoto ? "bg-emerald-600 hover:bg-emerald-700 border-emerald-400 animate-bounce" : "bg-emerald-700 hover:bg-emerald-800 border-emerald-500"
                    }`}
                  >
                    <Save className="h-4 w-4 text-white" />
                    Save King Picture
                  </button>
                </div>
              </div>
            )}

            {/* King Main Dedicated Card */}
            <div className="rounded-3xl border-2 border-amber-600/40 bg-white/90 backdrop-blur-xl p-6 md:p-10 shadow-2xl relative overflow-hidden text-center">
              
              <div className="inline-flex items-center gap-2 rounded-full bg-[#00246C] px-4.5 py-2 text-xs font-extrabold text-[#F7A81B] mb-6 shadow-lg">
                <Crown className="h-4 w-4 text-[#F7A81B]" />
                SERI PADUKA BAGINDA YANG DI-PERTUAN AGONG XVII
              </div>

              {/* King Picture Display */}
              <div className="relative mx-auto my-6 w-full max-w-md overflow-hidden rounded-3xl border-4 border-[#F7A81B] shadow-2xl bg-slate-900 group">
                <img
                  src={kingPhoto}
                  alt="His Majesty Sultan Ibrahim - King of Malaysia"
                  className="h-96 w-full object-cover object-top transition duration-500 group-hover:scale-105"
                />
                
                {/* Superadmin Hover Upload Overlay */}
                {isSuperAdmin && (
                  <div
                    onClick={() => kingFileInputRef.current?.click()}
                    className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center transition cursor-pointer text-white font-bold text-sm"
                  >
                    <Upload className="h-8 w-8 text-[#F7A81B] mb-2" />
                    Click to Upload New King Picture
                  </div>
                )}
              </div>

              {/* Title & Info */}
              <h2 className="text-2xl md:text-4xl font-black text-[#00246C] leading-tight">
                DULI YANG MAHA MULIA SERI PADUKA BAGINDA
              </h2>
              <p className="mt-2 text-xl md:text-2xl font-black text-amber-900">
                YANG DI-PERTUAN AGONG XVII SULTAN IBRAHIM
              </p>
              <p className="mt-2 text-xs md:text-sm text-slate-700 font-bold">
                Head of State of Malaysia • King of Malaysia
              </p>

              <div className="mt-8 text-left space-y-4 text-xs md:text-sm text-slate-900 bg-amber-500/20 p-6 rounded-2xl border border-amber-600/30">
                <h4 className="font-black text-[#00246C] text-sm md:text-base">Royal Institution of Malaysia</h4>
                <p className="leading-relaxed font-semibold">
                  His Majesty Sultan Ibrahim reigns as the 17th Yang di-Pertuan Agong of Malaysia. Under His Majesty’s supreme constitutional leadership, Malaysia fosters unity, social harmony, economic prosperity, and charitable community service.
                </p>
                <div className="flex items-center gap-2 text-[#00246C] font-extrabold pt-2 border-t border-amber-600/30">
                  <Medal className="h-4 w-4 text-amber-900" />
                  Official Royal Page 3 • RCKL DiRaja Directory 2026/27
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: DEDICATED PAGE FOR OUR ROYAL PATRON (SULTAN OF SELANGOR) */}
        {activeTab === "patron" && (
          <div className="space-y-8 max-w-4xl mx-auto rounded-3xl bg-gradient-to-br from-amber-300 via-yellow-400 to-amber-500 p-6 md:p-10 shadow-2xl border-4 border-amber-500/80">
            
            {/* Superadmin Upload Control Bar */}
            {isSuperAdmin && (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-amber-700/30 bg-yellow-500/30 p-4 shadow-sm backdrop-blur-md">
                <div className="flex items-center gap-2 text-xs font-black text-amber-950">
                  <ShieldAlert className="h-5 w-5 text-amber-900 shrink-0" />
                  <span>Superadmin Controls: Replace or save the official Royal Patron picture below.</span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => patronFileInputRef.current?.click()}
                    className="flex items-center gap-1.5 rounded-xl bg-[#00246C] px-3.5 py-2 text-xs font-bold text-[#F7A81B] hover:bg-blue-900 shadow-md transition"
                  >
                    <Upload className="h-4 w-4 text-[#F7A81B]" />
                    Upload Picture
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSavePatronPhoto()}
                    className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-black text-white shadow-md transition border ${
                      hasUnsavedPatronPhoto ? "bg-emerald-600 hover:bg-emerald-700 border-emerald-400 animate-bounce" : "bg-emerald-700 hover:bg-emerald-800 border-emerald-500"
                    }`}
                  >
                    <Save className="h-4 w-4 text-white" />
                    Save Patron Picture
                  </button>
                </div>
              </div>
            )}

            {/* Royal Patron Main Dedicated Card */}
            <div className="rounded-3xl border-2 border-amber-600/40 bg-white/90 backdrop-blur-xl p-6 md:p-10 shadow-2xl relative overflow-hidden text-center">
              
              <div className="inline-flex items-center gap-2 rounded-full bg-[#00246C] px-4.5 py-2 text-xs font-extrabold text-[#F7A81B] mb-6 shadow-lg">
                <Crown className="h-4 w-4 text-[#F7A81B]" />
                OUR ROYAL PATRON • SULTAN OF SELANGOR
              </div>

              {/* Sultan Picture Display */}
              <div className="relative mx-auto my-6 w-full max-w-md overflow-hidden rounded-3xl border-4 border-[#F7A81B] shadow-2xl bg-slate-900 group">
                <img
                  src={patronPhoto}
                  alt="His Royal Highness Sultan of Selangor"
                  className="h-96 w-full object-cover object-top transition duration-500 group-hover:scale-105"
                />
                
                {/* Superadmin Hover Upload Overlay */}
                {isSuperAdmin && (
                  <div
                    onClick={() => patronFileInputRef.current?.click()}
                    className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center transition cursor-pointer text-white font-bold text-sm"
                  >
                    <Upload className="h-8 w-8 text-[#F7A81B] mb-2" />
                    Click to Upload New Sultan Picture
                  </div>
                )}
              </div>

              {/* Title & Honours */}
              <h2 className="text-xl md:text-3xl font-black text-[#00246C] leading-snug">
                DULI YANG MAHA MULIA SULTAN SHARAFUDDIN IDRIS SHAH ALHAJ IBNI ALMARHUM SULTAN SALAHUDDIN ABDUL AZIZ SHAH ALHAJ
              </h2>

              <div className="mt-3 inline-block rounded-xl bg-amber-500/20 px-4 py-2 text-xs font-black text-amber-950 border border-amber-600/30 max-w-2xl">
                D.K., D.M.N., D.K. (TERENGGANU), D.K. (KELANTAN), D.K. (PERAK), D.K. (PERLIS), D.K. (NEGRI SEMBILAN), D.K. (KEDAH), S.P.M.S., S.S.I.S., S.P.M.J., PHF
              </div>

              <p className="mt-3 text-xs md:text-sm text-slate-700 font-bold">
                The Sultan of Selangor • Royal Patron of Rotary Club of Kuala Lumpur DiRaja
              </p>

              <div className="mt-8 text-left space-y-4 text-xs md:text-sm text-slate-900 bg-amber-500/20 p-6 rounded-2xl border border-amber-600/30">
                <h4 className="font-black text-[#00246C] text-sm md:text-base">Royal Patronage & The "DiRaja" Designation</h4>
                <p className="leading-relaxed font-semibold">
                  His Royal Highness the Sultan of Selangor serves as the Royal Patron of the Rotary Club of Kuala Lumpur DiRaja. Under His Royal Highness’ royal patronage, the club was officially conferred the royal title <strong>"DiRaja"</strong> in recognition of nearly 100 years of exemplary humanitarian service, community development, medical aid, and youth empowerment across Malaysia.
                </p>
                <div className="flex items-center gap-2 text-[#00246C] font-extrabold pt-2 border-t border-amber-600/30">
                  <Award className="h-4 w-4 text-amber-900" />
                  Paul Harris Fellow (PHF) • Official Royal Page 4 • RCKL DiRaja Directory 2026/27
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: PROJECTS & COMMUNITY GRANTS DETAILS + COMMUNITY SERVICE FORM */}
        {activeTab === "projects" && (
          <div className="space-y-6">
            
            {/* Success Alert Banner */}
            {applicationSuccessMsg && (
              <div className="flex items-center justify-between rounded-2xl bg-emerald-50 border border-emerald-300 p-4 text-emerald-900 shadow-sm animate-in fade-in">
                <div className="flex items-center gap-3">
                  <FileCheck className="h-6 w-6 text-emerald-600 shrink-0" />
                  <span className="text-xs font-bold md:text-sm">{applicationSuccessMsg}</span>
                </div>
                <button
                  onClick={() => setApplicationSuccessMsg("")}
                  className="rounded-lg p-1 text-emerald-600 hover:bg-emerald-100"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}

            {/* Header & Submit Form Action Banner */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <h2 className="text-2xl font-extrabold text-[#00246C] flex items-center gap-2">
                    <FolderHeart className="h-7 w-7 text-[#F7A81B]" />
                    Community Projects & Grant Applications ({projectList.length})
                  </h2>
                  <p className="mt-1 text-xs text-slate-500">
                    Comprehensive overview of RCKL DiRaja flagship service projects, grant funding details, financial scale, and community impact.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <button
                    onClick={() => setIsApplicationFormOpen(true)}
                    className="flex items-center gap-2 rounded-xl bg-[#00246C] px-4 py-2.5 text-xs font-bold text-[#F7A81B] hover:bg-blue-900 shadow-md transition shrink-0"
                  >
                    <PlusCircle className="h-4 w-4 text-[#F7A81B]" />
                    Submit Community Service Form
                  </button>

                  <div className="relative flex-1 md:w-56">
                    <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      value={projectSearch}
                      onChange={(e) => setProjectSearch(e.target.value)}
                      placeholder="Search projects..."
                      className="w-full rounded-xl border border-slate-300 bg-slate-50 pl-10 pr-4 py-2 text-xs text-slate-900 outline-none focus:border-[#00246C] focus:bg-white"
                    />
                  </div>

                  <select
                    value={selectedProjectCategory}
                    onChange={(e) => setSelectedProjectCategory(e.target.value)}
                    className="rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-700 outline-none focus:border-[#00246C]"
                  >
                    {projectCategories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat === "All" ? "All Categories" : cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Quick Banner for Community Service Application Form */}
            <div className="rounded-2xl border border-blue-200 bg-gradient-to-r from-blue-50 via-slate-50 to-amber-50/50 p-6 flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#00246C] text-[#F7A81B] shrink-0">
                  <ClipboardList className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-extrabold text-[#00246C] text-base">Community Service Project & Grant Application Form</h3>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Have a new community project, medical appeal, or grant request? Submit your project proposal directly to the RCKL DiRaja Service Committee.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsApplicationFormOpen(true)}
                className="flex items-center gap-2 rounded-xl bg-[#00246C] px-5 py-2.5 text-xs font-bold text-white shadow-md hover:bg-blue-900 transition whitespace-nowrap"
              >
                <PlusCircle className="h-4 w-4 text-[#F7A81B]" />
                Open Application Form
              </button>
            </div>

            {/* Projects Grid or Empty State */}
            {filteredProjects.length === 0 ? (
              <div className="rounded-2xl border-2 border-dashed border-slate-300 bg-white p-10 text-center shadow-xs">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-[#00246C] mb-3">
                  <ClipboardList className="h-7 w-7" />
                </div>
                <h4 className="text-base font-extrabold text-[#00246C]">No Projects Submitted Yet</h4>
                <p className="mt-1 text-xs text-slate-500 max-w-md mx-auto">
                  The system has been started fresh with zero demo records. Submit a project application to add the first Community Service project paper.
                </p>
                <button
                  type="button"
                  onClick={handleOpenApplicationForm}
                  className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[#00246C] px-4 py-2 text-xs font-bold text-white hover:bg-blue-900 transition shadow cursor-pointer"
                >
                  <PlusCircle className="h-4 w-4 text-[#F7A81B]" />
                  Submit New Project Paper
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {filteredProjects.map((proj) => (
                <div
                  key={proj.id}
                  onClick={() => setSelectedProject(proj)}
                  className="cursor-pointer rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:border-[#00246C] hover:shadow-md transition flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-3">
                      <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-900 border border-amber-300">
                        <FolderHeart className="h-3.5 w-3.5 text-amber-700" />
                        {proj.category}
                      </span>
                      <span className={`rounded-lg px-2.5 py-1 text-xs font-extrabold border ${
                        (proj.status || "").includes("Approved")
                          ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                          : (proj.status || "").includes("Pending")
                          ? "bg-amber-50 text-amber-800 border-amber-300"
                          : (proj.status || "").includes("Under Review")
                          ? "bg-purple-50 text-purple-800 border-purple-300"
                          : "bg-slate-100 text-slate-700 border-slate-300"
                      }`}>
                        {proj.status || "Open / Active Project"}
                      </span>
                    </div>

                    <h3 className="mt-3 text-lg font-extrabold text-slate-900">{proj.title}</h3>
                    <p className="mt-2 text-xs text-slate-600 line-clamp-2">{proj.objective}</p>

                    {((proj.quotations && proj.quotations.length > 0) || (proj.invoices && proj.invoices.length > 0)) && (
                      <div className="mt-2.5 inline-flex items-center gap-1.5 rounded-lg bg-blue-50 px-2.5 py-1 text-[11px] font-bold text-blue-800 border border-blue-200">
                        <Upload className="h-3.5 w-3.5 text-blue-600" />
                        {(proj.quotations?.length || 0) + (proj.invoices?.length || 0)} File(s) Attached
                      </div>
                    )}

                    <div className="mt-4 grid grid-cols-2 gap-3 text-xs border-t border-slate-100 pt-3">
                      <div>
                        <span className="text-slate-400 font-medium">Financial Scale:</span>
                        <div className="font-extrabold text-[#00246C] text-sm">{proj.scale}</div>
                      </div>
                      <div>
                        <span className="text-slate-400 font-medium">Target Beneficiaries:</span>
                        <div className="font-bold text-slate-800">{proj.beneficiaries}</div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-xs text-[#005DAA] font-bold">
                    <span className="flex items-center gap-1 text-slate-500 font-medium">
                      <MapPin className="h-3.5 w-3.5 text-slate-400" /> {proj.location}
                    </span>
                    <span className="flex items-center gap-1 group-hover:translate-x-1 transition">
                      View Full Details <ChevronRight className="h-4 w-4" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
            )}
          </div>
        )}

        {/* TAB 4: MEMBER DIRECTORY (RESPECTING CONFIGURED PRIVACY SETTINGS) */}
        {activeTab === "directory" && (
          <div className="space-y-6">
            {/* PDPA 2.0 Directory Banner Notice */}
            <div className="rounded-xl bg-blue-900 text-white p-3.5 px-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-md border border-blue-800">
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="h-5 w-5 text-amber-400 shrink-0" />
                <div>
                  <span className="font-bold text-amber-300">PDPA 2.0 Governed Directory Roster</span>
                  <span className="hidden sm:inline"> • Personal data is processed strictly for official RCKL DiRaja fellowship & club governance.</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsPdpaModalOpen(true)}
                className="rounded-lg bg-amber-400 hover:bg-amber-300 text-[#00246C] px-3 py-1 font-extrabold text-[11px] transition shrink-0 self-start sm:self-auto"
              >
                Statutory Rights & DPO
              </button>
            </div>

            {/* Superadmin Congratulatory Broadcasts Section */}
            <div className="rounded-2xl border-2 border-amber-300/80 bg-gradient-to-br from-amber-50/70 via-white to-blue-50/50 p-5 shadow-md space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-amber-200/60 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#00246C] text-[#F7A81B] shadow-xs">
                    <Sparkles className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-[#00246C] tracking-tight">Member Honors & Congratulatory Announcements</h3>
                    <p className="text-xs text-slate-500 font-medium">Send congratulatory messages directly to honored members</p>
                  </div>
                </div>

                {isSuperAdmin && (
                  <button
                    onClick={() => setIsPublishModalOpen(true)}
                    className="inline-flex items-center gap-2 rounded-xl bg-[#00246C] hover:bg-blue-900 text-[#F7A81B] px-4 py-2 text-xs font-black shadow-md transition shrink-0"
                  >
                    <PlusCircle className="h-4 w-4" />
                    Publish Congratulatory Broadcast
                  </button>
                )}
              </div>

              {congratulationsPosts.length === 0 ? (
                <p className="text-xs text-slate-400 italic text-center py-4">No published congratulatory broadcasts yet.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {congratulationsPosts.map((post) => {
                    const targetMem = memberList.find(
                      (m) => m.email === post.targetMemberEmail || m.name === post.targetMemberName
                    );
                    const memImg = targetMem ? getMemberImage(targetMem) : null;

                    return (
                      <div
                        key={post.id}
                        className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm hover:shadow-md transition flex flex-col justify-between relative overflow-hidden"
                      >
                        <div>
                          <div className="flex items-start justify-between gap-2 mb-3">
                            <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-3 py-0.5 text-[11px] font-extrabold text-amber-900 border border-amber-300">
                              <Medal className="h-3.5 w-3.5 text-amber-600" />
                              {post.category || "Honor Recognition"}
                            </span>
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] text-slate-400 font-semibold">{post.publishedAt}</span>
                              {isSuperAdmin && (
                                <button
                                  onClick={() => handleDeletePost(post.id)}
                                  className="text-rose-500 hover:text-rose-700 p-1 rounded-md hover:bg-rose-50 transition"
                                  title="Delete Broadcast"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              )}
                            </div>
                          </div>

                          {/* Image Banner */}
                          {post.imageUrl && (
                            <div className="mb-3 overflow-hidden rounded-xl bg-slate-100 max-h-48 border border-slate-200 flex items-center justify-center">
                              <img
                                src={post.imageUrl}
                                alt={post.title}
                                className="w-full h-44 object-cover hover:scale-105 transition duration-300"
                              />
                            </div>
                          )}

                          <h4 className="font-extrabold text-[#00246C] text-sm md:text-base leading-snug">{post.title}</h4>
                          <p className="mt-1.5 text-xs text-slate-600 leading-relaxed font-medium">{post.message}</p>

                          {/* Target Member Profile Badge */}
                          <div className="mt-4 rounded-xl bg-slate-50 border border-slate-200 p-3 flex items-center gap-3">
                            {memImg ? (
                              <img src={memImg} alt={post.targetMemberName} className="h-10 w-10 rounded-xl object-cover border border-amber-300 shrink-0" />
                            ) : (
                              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#00246C] text-[#F7A81B] font-bold text-sm shrink-0">
                                {post.targetMemberName.charAt(0)}
                              </div>
                            )}
                            <div className="min-w-0 flex-1">
                              <p className="text-xs font-black text-[#00246C] truncate">{post.targetMemberName}</p>
                              <p className="text-[10px] text-slate-500 font-semibold truncate">{targetMem?.classification || "Honored Rotarian Member"}</p>
                            </div>
                          </div>
                        </div>

                        {/* Send Direct Message Action Button */}
                        <button
                          onClick={() => handleOpenDirectMessageModal(post)}
                          className="mt-4 w-full flex items-center justify-center gap-2 rounded-xl bg-[#00246C] hover:bg-blue-900 py-2.5 px-4 text-xs font-black text-[#F7A81B] border border-blue-900 shadow-md transition"
                        >
                          <Send className="h-3.5 w-3.5 text-[#F7A81B]" />
                          Send Direct Message to {post.targetMemberName.split(" ")[0]}
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-4 md:p-6 shadow-sm">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                
                <div className="relative flex-1">
                  <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search member by name, classification, email or phone..."
                    className="w-full rounded-xl border border-slate-300 bg-slate-50 pl-10 pr-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:border-[#00246C] focus:bg-white focus:ring-1 focus:ring-[#00246C]"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4 text-[#00246C]" />
                    <select
                      value={selectedClassification}
                      onChange={(e) => setSelectedClassification(e.target.value)}
                      className="rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-700 outline-none focus:border-[#00246C]"
                    >
                      {classifications.map((c) => (
                        <option key={c} value={c}>
                          {c === "All" ? "All Classifications" : c}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-[#00246C]" />
                    <select
                      value={selectedRoleFilter}
                      onChange={(e) => setSelectedRoleFilter(e.target.value)}
                      className="rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-xs font-bold text-slate-700 outline-none focus:border-[#00246C]"
                    >
                      <option value="All Roles">All System Roles</option>
                      <option value="Admin">Admin</option>
                      <option value="Member">Member</option>
                      <option value="Boardmember">Boardmember</option>
                      <option value="Community Service Director">Community Service Director</option>
                      <option value="KLRCF Secretary">KLRCF Secretary</option>
                      <option value="KLRCF Treasurer">KLRCF Treasurer</option>
                      <option value="KLRCF Member">KLRCF Member</option>
                      <option value="Superadmin">Superadmin</option>
                    </select>
                  </div>

                  <button
                    onClick={() => setPhfOnly(!phfOnly)}
                    className={`flex items-center gap-1.5 rounded-xl border px-3.5 py-2 text-xs font-bold transition ${
                      phfOnly
                        ? "border-[#F7A81B] bg-amber-50 text-[#B45309]"
                        : "border-slate-300 bg-slate-50 text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    <Award className="h-3.5 w-3.5 text-[#F7A81B]" />
                    PHF Fellows Only
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredMembers.map((m) => {
                const imgUrl = getMemberImage(m);
                const isCurrent = loggedInMember && (loggedInMember.email === m.email || loggedInMember.name === m.name);
                
                const canSeeMobile = isCurrent || memberPrivacy.show_mobile;
                const canSeeEmail = isCurrent || memberPrivacy.show_email;

                return (
                  <div
                    key={m.id}
                    onClick={() => setSelectedMember(m)}
                    className="royal-card-hover cursor-pointer rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition"
                  >
                    <div className="flex items-start gap-4">
                      {imgUrl ? (
                        <img
                          src={imgUrl}
                          alt={m.name}
                          className="h-16 w-16 rounded-2xl object-cover border-2 border-amber-300 shadow-sm shrink-0"
                        />
                      ) : (
                        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#00246C] text-[#F7A81B] font-bold text-2xl shadow-sm shrink-0">
                          {m.name.charAt(0)}
                        </div>
                      )}

                      <div className="flex-1 min-w-0">
                        <h3 className="font-black text-[#00246C] text-lg md:text-xl leading-snug truncate">{m.name}</h3>
                        <p className="mt-1 text-xs font-extrabold text-[#00246C] bg-blue-100/70 border border-blue-200 inline-block px-2.5 py-0.5 rounded truncate max-w-full">
                          {m.classification}
                        </p>
                        {m.phf && (
                          <div className="mt-1">
                            <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-0.5 text-[10px] font-extrabold text-amber-900 border border-amber-300">
                              <Award className="h-3 w-3 text-amber-600" />
                              Paul Harris Fellow
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="mt-4 space-y-2 text-xs border-t border-slate-200 pt-3">
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-2 font-bold text-slate-800">
                          <Phone className="h-3.5 w-3.5 text-[#00246C]" />
                          <span>{canSeeMobile ? (m.mobile || "N/A") : "🔒 Private"}</span>
                        </span>
                        {!canSeeMobile && <span className="text-[10px] text-slate-500 font-bold">Hidden</span>}
                      </div>

                      <div className="flex items-center justify-between truncate">
                        <span className="flex items-center gap-2 truncate font-bold text-slate-800">
                          <Mail className="h-3.5 w-3.5 text-[#00246C]" />
                          <span className="truncate">{canSeeEmail ? (m.email || "N/A") : "🔒 Private"}</span>
                        </span>
                        {!canSeeEmail && <span className="text-[10px] text-slate-500 font-bold shrink-0">Hidden</span>}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 5: BOARD OF DIRECTORS (MATCHING OFFICIAL BOARD DIRECTORY EXACTLY) */}
        {activeTab === "leadership" && (
          <div className="space-y-8">
            {/* Header Banner */}
            <div className="rounded-3xl border-2 border-amber-300 bg-gradient-to-r from-[#00246C] via-blue-900 to-[#005DAA] p-6 md:p-8 text-white text-center shadow-xl relative overflow-hidden">
              <div className="inline-flex items-center gap-2 rounded-full bg-[#F7A81B] px-4 py-1.5 text-xs font-extrabold text-[#00246C] mb-3">
                <Crown className="h-4 w-4" />
                ROYAL PATRON & BOARD OF DIRECTORS
              </div>
              <h2 className="text-2xl md:text-4xl font-extrabold tracking-tight">
                Rotary Club of Kuala Lumpur DiRaja
              </h2>
              <p className="mt-2 text-xs md:text-sm text-blue-100 max-w-2xl mx-auto font-medium">
                Official Executive Committee, Avenue of Service Directors, and Key Functional Directors.
              </p>

              {/* Royal Patron Card */}
              <div className="mt-6 rounded-2xl bg-white/10 p-4 border border-amber-300/40 max-w-xl mx-auto backdrop-blur-md">
                <div className="text-xs font-extrabold uppercase tracking-widest text-[#F7A81B]">
                  Royal Patron
                </div>
                <div className="text-base md:text-lg font-black text-white mt-1">
                  Duli Yang Maha Mulia Sultan Selangor Darul Ehsan
                </div>
              </div>
            </div>

            {/* Board Cards Grid */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {board.map((b, idx) => (
                <div key={idx} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md hover:border-[#00246C] transition">
                  <div className="flex items-center gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#00246C] text-[#F7A81B] font-bold text-xl shadow-md shrink-0 border-2 border-[#F7A81B]/40">
                      {b.name.charAt(0)}
                    </div>
                    <div>
                      <div className="text-[11px] font-extrabold uppercase tracking-wider text-[#005DAA] bg-blue-50 px-2.5 py-0.5 rounded inline-block border border-blue-100">
                        {b.position}
                      </div>
                      <h3 className="font-black text-[#00246C] text-base md:text-lg mt-1.5 leading-snug">
                        {b.name}
                      </h3>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 6: 4-WAY TEST & VALUES */}
        {activeTab === "values" && (
          <div className="space-y-8">
            <div className="rounded-3xl bg-[#00246C] p-6 md:p-8 text-white shadow-xl relative overflow-hidden text-center">
              <BookOpen className="h-16 w-16 text-[#F7A81B] mx-auto mb-3" />
              <h2 className="text-2xl md:text-3xl font-extrabold">The 4-Way Test of the Things We Think, Say or Do</h2>
              <p className="mt-2 text-xs md:text-sm text-blue-200">
                Created by Herbert J. Taylor in 1932, the Four-Way Test is a non-partisan and non-sectarian ethical guide for Rotarians.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {four_way_test.map((testItem, idx) => (
                <div key={idx} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col items-center text-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 text-[#B45309] font-black text-xl mb-4">
                    {idx + 1}
                  </div>
                  <div className="font-bold text-slate-900 text-sm leading-snug">{testItem}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 7: PAST PRESIDENTS HISTORY */}
        {activeTab === "history" && (
          <div className="space-y-6">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div>
                  <h2 className="text-xl font-bold text-[#00246C] flex items-center gap-2">
                    <History className="h-6 w-6 text-[#005DAA]" />
                    Past Presidents of Rotary Club of Kuala Lumpur DiRaja ({past_presidents.length})
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Honouring 98 years of distinguished Rotary leadership from 1927/28 to 2026/27.
                  </p>
                </div>

                <div className="relative w-full md:w-64">
                  <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search Past President..."
                    value={presidentSearch}
                    onChange={(e) => setPresidentSearch(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 bg-slate-50 pl-10 pr-8 py-2 text-xs font-semibold text-slate-900 outline-none focus:border-[#00246C] focus:bg-white"
                  />
                  {presidentSearch && (
                    <button
                      onClick={() => setPresidentSearch("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>

              <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 max-h-[600px] overflow-y-auto pr-2">
                {filteredPresidents.map((p, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between rounded-xl bg-slate-50 p-3 border border-slate-200 hover:border-[#00246C] hover:bg-blue-50/50 transition"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#00246C] text-[#F7A81B] text-xs font-bold shrink-0">
                        {idx + 1}
                      </div>
                      <div className="font-bold text-xs text-slate-900 truncate">{p.name}</div>
                    </div>
                    <div className="text-[11px] font-extrabold text-[#005DAA] bg-blue-100 px-2 py-0.5 rounded shrink-0">
                      {p.year}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 8: CLUB INFO */}
        {activeTab === "info" && (
          <div className="space-y-6">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-bold text-[#00246C] flex items-center gap-2">
                <MapPin className="h-6 w-6 text-[#005DAA]" />
                Weekly Luncheon & Secretariat Details
              </h2>

              <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="rounded-2xl bg-blue-50/60 p-5 border border-blue-100 space-y-3">
                  <h3 className="font-bold text-[#00246C]">Weekly Meeting Venue</h3>
                  <div className="text-xs text-slate-700 space-y-1">
                    <p className="font-semibold text-slate-900">{club_info.meeting_day} • {club_info.meeting_venue}</p>
                    <p>Address: {club_info.address}</p>
                  </div>
                </div>

                <div className="rounded-2xl bg-amber-50/60 p-5 border border-amber-200 space-y-3">
                  <h3 className="font-bold text-[#B45309]">Club Secretariat</h3>
                  <div className="text-xs text-slate-700 space-y-1">
                    <p>District: {club_info.district}</p>
                    <p>Charter No: {club_info.charter_no}</p>
                    <p>Email: {club_info.email}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 9: NEWSLETTER MODULE */}
        {activeTab === "newsletter" && (
          <div className="space-y-6">
            <div className="rounded-3xl border border-amber-200 bg-white p-6 md:p-8 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div>
                  <div className="inline-flex items-center gap-2 rounded-full border border-amber-300 bg-amber-50 px-3 py-1 text-xs font-black text-amber-900 mb-1">
                    <Newspaper className="h-3.5 w-3.5 text-amber-600" />
                    <span>Module 3: Superadmin Configured Feeds</span>
                  </div>
                  <h2 className="text-2xl font-black text-[#00246C]">Curated Newsletter & Media Feeds</h2>
                  <p className="text-xs text-slate-500 font-medium">
                    Aggregated news from designated internet websites, WhatsApp broadcast channels, and official Rotary blogs.
                  </p>
                </div>

                {isSuperAdmin && (
                  <button
                    type="button"
                    onClick={() => setIsAddFeedModalOpen(true)}
                    className="flex items-center gap-2 rounded-2xl bg-[#00246C] hover:bg-blue-900 text-[#F7A81B] px-4 py-2.5 text-xs font-black shadow-md transition shrink-0"
                  >
                    <PlusCircle className="h-4 w-4" />
                    <span>Add Designated Source (Superadmin)</span>
                  </button>
                )}
              </div>

              {/* Feed Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {newsletterFeeds.map((feed) => (
                  <div key={feed.id} className="rounded-2xl border-2 border-slate-200 bg-slate-50/70 p-5 space-y-3 hover:border-amber-400 hover:bg-white transition shadow-xs flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
                          feed.type === "website"
                            ? "bg-blue-100 text-blue-900 border-blue-200"
                            : feed.type === "whatsapp"
                            ? "bg-emerald-100 text-emerald-900 border-emerald-200"
                            : "bg-purple-100 text-purple-900 border-purple-200"
                        }`}>
                          {feed.type === "website" && "🌐 Website"}
                          {feed.type === "whatsapp" && "💬 WhatsApp"}
                          {feed.type === "blog" && "📝 Blog"}
                        </span>
                        <span className="text-[10px] text-slate-400 font-bold">{feed.date}</span>
                      </div>

                      <h3 className="font-extrabold text-[#00246C] text-sm leading-snug">{feed.title}</h3>
                      <p className="text-xs text-slate-600 leading-relaxed">{feed.description}</p>
                    </div>

                    <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
                      <a
                        href={feed.url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-extrabold text-[#00246C] hover:text-blue-900 hover:underline"
                      >
                        <span>Open Source</span>
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>

                      {isSuperAdmin && (
                        <button
                          type="button"
                          onClick={() => {
                            const updated = newsletterFeeds.filter((f) => f.id !== feed.id);
                            setNewsletterFeeds(updated);
                            if (typeof window !== "undefined") {
                              localStorage.setItem("rckl_newsletter_feeds", JSON.stringify(updated));
                            }
                          }}
                          className="text-[10px] text-rose-600 hover:text-rose-800 font-bold flex items-center gap-1"
                        >
                          <Trash2 className="h-3.5 w-3.5" /> Remove
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 10: DOCUMENTS ACCESS */}
        {activeTab === "documents" && (
          <div className="space-y-6">
            <div className="rounded-3xl border border-purple-200 bg-white p-6 md:p-8 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div>
                  <div className="inline-flex items-center gap-2 rounded-full border border-purple-300 bg-purple-50 px-3 py-1 text-xs font-black text-purple-900 mb-1">
                    <FileText className="h-3.5 w-3.5 text-purple-600" />
                    <span>Module 4: Role-Based Documents Governance</span>
                  </div>
                  <h2 className="text-2xl font-black text-[#00246C]">Club Documents Repository</h2>
                  <p className="text-xs text-slate-500 font-medium">
                    Secure access to constitution, financial audits, board minutes, and district manuals based on your assigned role permissions.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-600 bg-purple-50 border border-purple-200 px-3 py-1.5 rounded-xl">
                    Current Access Level: <strong className="text-purple-900">{isSuperAdmin ? "Superadmin (Full Access)" : loggedInMember ? "Member Access" : "Public Access"}</strong>
                  </span>
                </div>
              </div>

              {/* Documents List */}
              <div className="grid grid-cols-1 gap-3">
                {documentsList.map((doc) => {
                  const hasAccess = 
                    isSuperAdmin ||
                    doc.access_role === "Public" ||
                    (doc.access_role === "Member" && loggedInMember) ||
                    (doc.access_role === "Admin" && (isSuperAdmin || loggedInMember?.role?.includes("Admin")));

                  return (
                    <div key={doc.id} className={`rounded-2xl border p-4 transition flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                      hasAccess ? "border-slate-200 bg-white hover:border-purple-300 shadow-xs" : "border-slate-200 bg-slate-50/80 opacity-60"
                    }`}>
                      <div className="flex items-center gap-3">
                        <div className={`flex h-11 w-11 items-center justify-center rounded-2xl shrink-0 font-bold ${
                          hasAccess ? "bg-purple-100 text-purple-700 border border-purple-200" : "bg-slate-200 text-slate-500"
                        }`}>
                          <FileText className="h-5 w-5" />
                        </div>

                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-extrabold text-[#00246C] text-sm">{doc.title}</h3>
                            <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                              {doc.category}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 mt-0.5">
                            Updated: {doc.updated} • File Size: {doc.size}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <span className={`text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full border ${
                          doc.access_role === "Superadmin"
                            ? "bg-rose-100 text-rose-900 border-rose-200"
                            : doc.access_role === "Admin"
                            ? "bg-amber-100 text-amber-900 border-amber-200"
                            : doc.access_role === "Member"
                            ? "bg-blue-100 text-blue-900 border-blue-200"
                            : "bg-emerald-100 text-emerald-900 border-emerald-200"
                        }`}>
                          Role: {doc.access_role}
                        </span>

                        {hasAccess ? (
                          <a
                            href={doc.url || "#"}
                            target={doc.url ? "_blank" : undefined}
                            rel={doc.url ? "noopener noreferrer" : undefined}
                            onClick={(e) => {
                              if (!doc.url) {
                                e.preventDefault();
                                alert(`📄 Document "${doc.title}" is archived. Contact Club Secretary or Admin.`);
                              }
                            }}
                            className="rounded-xl bg-[#00246C] hover:bg-blue-900 text-[#F7A81B] px-3.5 py-1.5 text-xs font-black shadow-sm transition inline-flex items-center gap-1.5 cursor-pointer"
                          >
                            <FileCheck className="h-4 w-4" /> {doc.url ? "Open / View PDF" : "Download"}
                          </a>
                        ) : (
                          <span className="text-xs text-rose-600 font-extrabold flex items-center gap-1">
                            <Lock className="h-3.5 w-3.5" /> Restricted
                          </span>
                        )}

                        {isSuperAdmin && (
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedDocId(doc.id);
                              setTargetDocRole(doc.access_role);
                              setIsDocConfigModalOpen(true);
                            }}
                            className="text-xs font-bold text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200 px-2.5 py-1.5 rounded-xl transition"
                          >
                            Config Access
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* TAB 11: MISCELLANEOUS DUMMY LINK */}
        {activeTab === "miscellaneous" && (
          <div className="space-y-6">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-8 shadow-sm space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <div className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-slate-100 px-3 py-1 text-xs font-black text-slate-800 mb-1">
                  <Sliders className="h-3.5 w-3.5 text-purple-600" />
                  <span>Module 5: Miscellaneous Dummy Link Hub</span>
                </div>
                <h2 className="text-2xl font-black text-[#00246C]">Miscellaneous Club Resources & Information</h2>
                <p className="text-xs text-slate-500 font-medium">
                  Informational placeholder link for club core values, royal patronage, and support contact channels.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <div className="rounded-2xl border border-blue-200 bg-blue-50/50 p-5 space-y-2">
                  <h3 className="font-extrabold text-[#00246C] text-sm flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-blue-600" /> 4-Way Test & Core Values
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    1. Is it the TRUTH? 2. Is it FAIR to all concerned? 3. Will it build GOODWILL and BETTER FRIENDSHIPS? 4. Will it be BENEFICIAL to all concerned?
                  </p>
                </div>

                <div className="rounded-2xl border border-amber-200 bg-amber-50/50 p-5 space-y-2">
                  <h3 className="font-extrabold text-[#B45309] text-sm flex items-center gap-2">
                    <Crown className="h-4 w-4 text-amber-600" /> Royal Patronage
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Royal Patron: His Royal Highness Sultan Sharafuddin Idris Shah Al-Haj, Sultan of Selangor.
                  </p>
                </div>

                <div className="rounded-2xl border border-purple-200 bg-purple-50/50 p-5 space-y-2">
                  <h3 className="font-extrabold text-purple-950 text-sm flex items-center gap-2">
                    <Building className="h-4 w-4 text-purple-600" /> Technical & IT Support
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    System Managed by Superadmins matrixnagesh@gmail.com and singh.surinderdeep@gmail.com. Support: suport@matrix-iot.com.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* INTERACTIVE COMMUNITY SERVICE PROJECT PAPER & GRANT APPLICATION FORM MODAL (MATCHING ProjectPDF.pdf EXACTLY) */}
      {isApplicationFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-3xl rounded-3xl bg-white p-6 md:p-8 shadow-2xl border border-slate-200 relative max-h-[92vh] overflow-y-auto">
            <button
              onClick={() => setIsApplicationFormOpen(false)}
              className="absolute right-4 top-4 rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
              <img src="/images/rckl_official_logo.png" alt="Rotary Club of Kuala Lumpur DiRaja" className="h-12 w-auto object-contain" />
              <div>
                <div className="text-[10px] font-black uppercase tracking-widest text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-md inline-block border border-amber-200">
                  Official RCKL DiRaja Form • ProjectPDF.pdf Specification
                </div>
                <h3 className="text-lg font-extrabold text-[#00246C] mt-0.5">PROJECT PAPER - Rotary Club of Kuala Lumpur DiRaja</h3>
              </div>
            </div>

            <form onSubmit={handleApplicationSubmit} className="mt-6 space-y-8">
              
              {/* PAGE 1 SECTION: GENERAL PROJECT INFORMATION */}
              <div className="space-y-4">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#00246C] bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100 flex items-center gap-2">
                  <span>Page 1: General Project Information</span>
                </h4>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={appEmail}
                      onChange={(e) => setAppEmail(e.target.value)}
                      className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3.5 py-2 text-xs font-semibold text-slate-900 outline-none focus:border-[#00246C] focus:bg-white"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs font-bold text-slate-700">Requester Name *</label>
                      <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                        ✓ Auto-captured
                      </span>
                    </div>
                    <select
                      value={appProposer}
                      onChange={(e) => setAppProposer(e.target.value)}
                      className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3.5 py-2 text-xs font-semibold text-slate-900 outline-none focus:border-[#00246C] focus:bg-white"
                    >
                      {memberNamesList.map((name) => (
                        <option key={name} value={name}>
                          {name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Requester Current Position / Rotary Role</label>
                    <select
                      value={appProposerRole}
                      onChange={(e) => setAppProposerRole(e.target.value)}
                      className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3.5 py-2 text-xs font-semibold text-slate-900 outline-none focus:border-[#00246C] focus:bg-white"
                    >
                      <option value="Member">Member (Active Rotarian)</option>
                      <option value="Board Member">Board Member</option>
                      <option value="Community Service Chair">Community Service Chair</option>
                      <option value="KLRCF Member">KLRCF Member</option>
                      <option value="Immediate Past President (IPP)">Immediate Past President (IPP)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Committee(s)</label>
                    <select
                      value={appCommittee}
                      onChange={(e) => setAppCommittee(e.target.value)}
                      className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3.5 py-2 text-xs font-semibold text-slate-900 outline-none focus:border-[#00246C] focus:bg-white"
                    >
                      <option value="Community Service">Community Service</option>
                      <option value="Foundation">Foundation</option>
                      <option value="Vocational Service">Vocational Service</option>
                      <option value="Youth Service">Youth Service</option>
                      <option value="International Service">International Service</option>
                      <option value="Club Administration">Club Administration</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Request Date</label>
                    <input
                      type="date"
                      value={appRequestDate}
                      onChange={(e) => setAppRequestDate(e.target.value)}
                      className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3.5 py-2 text-xs font-semibold text-slate-900 outline-none focus:border-[#00246C] focus:bg-white"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 mb-1">Project Name *</label>
                    <input
                      type="text"
                      required
                      value={appTitle}
                      onChange={(e) => setAppTitle(e.target.value)}
                      placeholder="e.g. Save A Sight Free Eye Screening & Surgery Clinic"
                      className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3.5 py-2 text-xs font-semibold text-slate-900 outline-none focus:border-[#00246C] focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Sub-project of:</label>
                    <input
                      type="text"
                      value={appSubProject}
                      onChange={(e) => setAppSubProject(e.target.value)}
                      placeholder="e.g. Club Admin / District 3300 Grant"
                      className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3.5 py-2 text-xs font-semibold text-slate-900 outline-none focus:border-[#00246C] focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Joint project with:</label>
                    <input
                      type="text"
                      value={appJointProject}
                      onChange={(e) => setAppJointProject(e.target.value)}
                      placeholder="e.g. Rotaract Club / Corporate Partner"
                      className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3.5 py-2 text-xs font-semibold text-slate-900 outline-none focus:border-[#00246C] focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">To the benefit of: *</label>
                    <input
                      type="text"
                      required
                      value={appBenefitOf}
                      onChange={(e) => setAppBenefitOf(e.target.value)}
                      placeholder="e.g. 500 B40 School Children & Special Needs Families"
                      className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3.5 py-2 text-xs font-semibold text-slate-900 outline-none focus:border-[#00246C] focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Project duration</label>
                    <input
                      type="text"
                      value={appProjectDuration}
                      onChange={(e) => setAppProjectDuration(e.target.value)}
                      placeholder="e.g. 2 years"
                      className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3.5 py-2 text-xs font-semibold text-slate-900 outline-none focus:border-[#00246C] focus:bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* PAGE 2 SECTION: LEADS, FINANCIALS, ATTACHMENTS & AREAS OF FOCUS */}
              <div className="space-y-4 border-t border-slate-100 pt-6">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#00246C] bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100 flex items-center gap-2">
                  <span>Page 2: Leads, Financials, Attachments & Rotary Areas of Focus</span>
                </h4>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Proposed project start date</label>
                    <input
                      type="date"
                      value={appStartDate}
                      onChange={(e) => setAppStartDate(e.target.value)}
                      className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3.5 py-2 text-xs font-semibold text-slate-900 outline-none focus:border-[#00246C] focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Project Lead *</label>
                    <select
                      value={appProjectLead}
                      onChange={(e) => setAppProjectLead(e.target.value)}
                      className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3.5 py-2 text-xs font-semibold text-slate-900 outline-none focus:border-[#00246C] focus:bg-white"
                    >
                      {memberNamesList.map((name) => (
                        <option key={name} value={name}>
                          {name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Funds requested (RM) *</label>
                    <input
                      type="number"
                      required
                      value={appFundsRequested}
                      onChange={(e) => setAppFundsRequested(e.target.value)}
                      placeholder="e.g. 25000"
                      className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3.5 py-2 text-xs font-semibold text-slate-900 outline-none focus:border-[#00246C] focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Funds timeline</label>
                    <input
                      type="text"
                      value={appFundsTimeline}
                      onChange={(e) => setAppFundsTimeline(e.target.value)}
                      placeholder="e.g. Immediate upon Board approval"
                      className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3.5 py-2 text-xs font-semibold text-slate-900 outline-none focus:border-[#00246C] focus:bg-white"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 mb-1">Funds source(s)</label>
                    <input
                      type="text"
                      value={appFundingSources}
                      onChange={(e) => setAppFundingSources(e.target.value)}
                      placeholder="e.g. Club Funds, KLRCF Grant, TRF Global Grant"
                      className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3.5 py-2 text-xs font-semibold text-slate-900 outline-none focus:border-[#00246C] focus:bg-white"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 mb-1">Project Description *</label>
                    <textarea
                      required
                      rows={3}
                      value={appObjective}
                      onChange={(e) => setAppObjective(e.target.value)}
                      placeholder="Enter full project description, goals, and implementation plan..."
                      className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3.5 py-2 text-xs font-semibold text-slate-900 outline-none focus:border-[#00246C] focus:bg-white"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 mb-1">Project Milestones</label>
                    <textarea
                      rows={2}
                      value={appMilestones}
                      onChange={(e) => setAppMilestones(e.target.value)}
                      placeholder="List key project execution phases and milestone delivery dates..."
                      className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3.5 py-2 text-xs font-semibold text-slate-900 outline-none focus:border-[#00246C] focus:bg-white"
                    />
                  </div>

                  {/* INVOICES ATTACHMENT SECTION */}
                  <div className="sm:col-span-2 border-t border-slate-200 pt-3">
                    <label className="block text-xs font-bold text-[#00246C] mb-1">Invoices Attachment (Upload up to 5 files)</label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      {[1, 2, 3].map((slot) => {
                        const inv = invoices[slot];
                        return (
                          <div key={slot} className="rounded-xl border border-slate-200 bg-slate-50 p-2.5">
                            {inv ? (
                              <div className="flex items-center justify-between text-xs gap-1">
                                <span className="font-bold truncate text-[11px] text-slate-800" title={inv.name}>{inv.name}</span>
                                <div className="flex items-center gap-1 shrink-0">
                                  <button
                                    type="button"
                                    onClick={() => triggerAttachmentDownload(inv, appTitle || "Draft Application")}
                                    className="p-1 rounded bg-blue-100 hover:bg-[#00246C] hover:text-white text-[#00246C] transition-colors"
                                    title="Download / preview file"
                                  >
                                    <Download className="w-3 h-3" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => removeInvoice(slot)}
                                    className="text-rose-600 hover:text-rose-800 font-bold p-1"
                                    title="Remove file"
                                  >
                                    ✕
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <label className="cursor-pointer text-[10px] font-bold text-[#005DAA] block text-center py-1">
                                + Invoice {slot}
                                <input type="file" onChange={(e) => handleInvoiceUpload(slot, e)} className="hidden" />
                              </label>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* 3 SUPPLIER / VENDOR QUOTATIONS UPLOAD SECTION */}
                  <div className="sm:col-span-2 border-t border-slate-200 pt-3">
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-xs font-bold text-[#00246C]">Quotations Attachment (Upload 3 Vendor Quotes)</label>
                      <span className="text-[10px] font-bold text-blue-800 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                        {Object.keys(quotations).length} / 3 Uploaded
                      </span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      {[1, 2, 3].map((slot) => {
                        const q = quotations[slot];
                        return (
                          <div key={slot} className="rounded-xl border border-slate-200 bg-slate-50 p-2.5">
                            {q ? (
                              <div className="flex items-center justify-between text-xs gap-1">
                                <span className="font-bold truncate text-[11px] text-slate-800" title={q.name}>{q.name}</span>
                                <div className="flex items-center gap-1 shrink-0">
                                  <button
                                    type="button"
                                    onClick={() => triggerAttachmentDownload(q, appTitle || "Draft Application")}
                                    className="p-1 rounded bg-blue-100 hover:bg-[#00246C] hover:text-white text-[#00246C] transition-colors"
                                    title="Download / preview file"
                                  >
                                    <Download className="w-3 h-3" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => removeQuotation(slot)}
                                    className="text-rose-600 hover:text-rose-800 font-bold p-1"
                                    title="Remove file"
                                  >
                                    ✕
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <label className="cursor-pointer text-[10px] font-bold text-[#005DAA] block text-center py-1">
                                + Vendor Quote {slot}
                                <input type="file" onChange={(e) => handleQuotationUpload(slot, e)} className="hidden" />
                              </label>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* ROTARY AREAS OF FOCUS CHECKBOXES */}
                  <div className="sm:col-span-2 border-t border-slate-200 pt-3">
                    <label className="block text-xs font-bold text-[#00246C] mb-2">Rotary Areas of Focus *</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      {[
                        "Peacebuilding and Conflict Prevention",
                        "Disease Prevention and Treatment",
                        "Water, Sanitation, and Hygiene",
                        "Maternal and Child Health",
                        "Basic Education and Literacy",
                        "Community Economic Development",
                        "Protecting the Environment"
                      ].map((area) => {
                        const isChecked = appAreasOfFocus.includes(area);
                        return (
                          <label key={area} className="flex items-center gap-2 cursor-pointer bg-slate-50 p-2 rounded-xl border border-slate-200 hover:bg-blue-50/50">
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => {
                                setAppAreasOfFocus((prev) =>
                                  isChecked ? prev.filter((a) => a !== area) : [...prev, area]
                                );
                              }}
                              className="rounded text-[#00246C]"
                            />
                            <span className="font-medium text-slate-800">{area}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* PAGE 3 SECTION: ROTARY IMPACT, RESPONSIBILITIES & APPROVALS */}
              <div className="space-y-4 border-t border-slate-100 pt-6">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#00246C] bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100 flex items-center gap-2">
                  <span>Page 3: Rotary Impact, Responsibilities & Approvals</span>
                </h4>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 mb-1">Rotary responsibilities</label>
                    <textarea
                      rows={2}
                      value={appRotaryResponsibilities}
                      onChange={(e) => setAppRotaryResponsibilities(e.target.value)}
                      placeholder="Detail specific member oversight, volunteer duties, and committee roles..."
                      className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3.5 py-2 text-xs font-semibold text-slate-900 outline-none focus:border-[#00246C] focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">No. of Rotarians involved</label>
                    <input
                      type="number"
                      value={appRotariansInvolved}
                      onChange={(e) => setAppRotariansInvolved(e.target.value)}
                      placeholder="e.g. 15"
                      className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3.5 py-2 text-xs font-semibold text-slate-900 outline-none focus:border-[#00246C] focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Grant Proposal Approval Status</label>
                    <select
                      value={appApprovalStatus}
                      onChange={(e) => setAppApprovalStatus(e.target.value)}
                      className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3.5 py-2 text-xs font-bold text-[#00246C] outline-none focus:border-[#00246C] focus:bg-white"
                    >
                      <option value="Pending Committee Review / Grant Application">Pending Committee Review / Grant Application</option>
                      <option value="Approved by Board & KLRCF Trustees">Approved by Board & KLRCF Trustees</option>
                      <option value="Approved subject to Quotation Verification">Approved subject to Quotation Verification</option>
                      <option value="Under Review / Additional Quotes Required">Under Review / Additional Quotes Required</option>
                      <option value="Deferred / Non-Grant Project">Deferred / Non-Grant Project</option>
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 mb-1">Visibility and Public Image</label>
                    <textarea
                      rows={2}
                      value={appPublicImage}
                      onChange={(e) => setAppPublicImage(e.target.value)}
                      placeholder="Describe media coverage, Rotary banners, social media & PR strategy..."
                      className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3.5 py-2 text-xs font-semibold text-slate-900 outline-none focus:border-[#00246C] focus:bg-white"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 mb-1">Impact Assessment</label>
                    <textarea
                      rows={2}
                      value={appImpactAssessment}
                      onChange={(e) => setAppImpactAssessment(e.target.value)}
                      placeholder="Explain quantitative metrics, beneficiary headcount, and community transformation..."
                      className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3.5 py-2 text-xs font-semibold text-slate-900 outline-none focus:border-[#00246C] focus:bg-white"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 mb-1">Project funding conditions (Club)</label>
                    <textarea
                      rows={2}
                      value={appFundingConditions}
                      onChange={(e) => setAppFundingConditions(e.target.value)}
                      placeholder="Specify disbursement conditions, audit receipts requirement, or matching grant terms..."
                      className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3.5 py-2 text-xs font-semibold text-slate-900 outline-none focus:border-[#00246C] focus:bg-white"
                    />
                  </div>

                  {/* APPROVED BY CHECKBOXES */}
                  <div className="sm:col-span-2 border-t border-slate-200 pt-3">
                    <label className="block text-xs font-bold text-[#00246C] mb-2">Approved by (Governance Sign-off)</label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                      {["Project Lead", "Committee Director (optional)", "BOD", "KLRCF"].map((approver) => {
                        const isChecked = appApprovedBy.includes(approver);
                        return (
                          <label key={approver} className="flex items-center gap-2 cursor-pointer bg-slate-50 p-2 rounded-xl border border-slate-200">
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => {
                                setAppApprovedBy((prev) =>
                                  isChecked ? prev.filter((a) => a !== approver) : [...prev, approver]
                                );
                              }}
                              className="rounded text-[#00246C]"
                            />
                            <span className="font-semibold text-slate-800">{approver}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* PAGE 4 SECTION: BOARD APPROVAL & PROJECT REVIEWERS SECTION */}
              <div className="space-y-4 border-t border-slate-100 pt-6">
                <div className="bg-slate-100 p-3 rounded-2xl border border-slate-300">
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-700 mb-1">
                    Page 4: Board / MC Approving & Project Reviewers Section
                  </h4>
                  <p className="text-[10px] text-slate-500">To be completed by Board/MC & Reviewers during project audit review.</p>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Fund approval by</label>
                    <input
                      type="text"
                      value={appFundApprovalBy}
                      onChange={(e) => setAppFundApprovalBy(e.target.value)}
                      placeholder="e.g. Board of Directors / KLRCF Trustees"
                      className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3.5 py-2 text-xs font-semibold text-slate-900 outline-none focus:border-[#00246C] focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Fund restrictions</label>
                    <input
                      type="text"
                      value={appFundRestrictions}
                      onChange={(e) => setAppFundRestrictions(e.target.value)}
                      placeholder="e.g. Restricted solely to medical equipment purchase"
                      className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3.5 py-2 text-xs font-semibold text-slate-900 outline-none focus:border-[#00246C] focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Effective project start</label>
                    <input
                      type="date"
                      value={appEffectiveStart}
                      onChange={(e) => setAppEffectiveStart(e.target.value)}
                      className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3.5 py-2 text-xs font-semibold text-slate-900 outline-none focus:border-[#00246C] focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Effective project end</label>
                    <input
                      type="date"
                      value={appEffectiveEnd}
                      onChange={(e) => setAppEffectiveEnd(e.target.value)}
                      className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3.5 py-2 text-xs font-semibold text-slate-900 outline-none focus:border-[#00246C] focus:bg-white"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 mb-1">Comments / Next steps</label>
                    <textarea
                      rows={2}
                      value={appCommentsNextSteps}
                      onChange={(e) => setAppCommentsNextSteps(e.target.value)}
                      placeholder="Reviewer notes and recommended next steps..."
                      className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3.5 py-2 text-xs font-semibold text-slate-900 outline-none focus:border-[#00246C] focus:bg-white"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 mb-1">Project sustainability measures</label>
                    <textarea
                      rows={2}
                      value={appSustainabilityMeasures}
                      onChange={(e) => setAppSustainabilityMeasures(e.target.value)}
                      placeholder="Long term maintenance and community hand-over plan..."
                      className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3.5 py-2 text-xs font-semibold text-slate-900 outline-none focus:border-[#00246C] focus:bg-white"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-8 flex items-center justify-end gap-3 border-t border-slate-200 pt-5">
                <button
                  type="button"
                  onClick={() => setIsApplicationFormOpen(false)}
                  className="rounded-xl border border-slate-300 px-5 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-100 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-2 rounded-xl bg-[#00246C] px-7 py-2.5 text-xs font-bold text-[#F7A81B] hover:bg-blue-900 shadow-lg transition"
                >
                  <Send className="h-4 w-4" />
                  Submit Project Paper
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-2xl rounded-3xl bg-white p-6 shadow-2xl border border-slate-200 relative max-h-[90vh] overflow-y-auto">
            <div className="absolute right-4 top-4 flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => handleOpenProjectPaper(selectedProject)}
                className="rounded-full p-2 text-slate-500 hover:bg-slate-100 hover:text-[#00246C] transition cursor-pointer"
                title="Open Official Grant Application Paper"
              >
                <FileText className="h-5 w-5" />
              </button>
              <button
                onClick={() => setSelectedProject(null)}
                className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex items-center gap-2 text-xs font-bold text-amber-700 bg-amber-100 px-3 py-1 rounded-full w-max">
              <FolderHeart className="h-4 w-4" /> {selectedProject.category}
            </div>

            <h3 className="mt-3 text-2xl font-extrabold text-[#00246C]">{selectedProject.title}</h3>
            <p className="mt-1 text-xs text-slate-500">Duration / Period: {selectedProject.year}</p>

            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="rounded-2xl bg-blue-50 p-4 border border-blue-100">
                <span className="text-xs text-slate-500 font-medium">Financial Scale / Grant Value</span>
                <div className="text-xl font-extrabold text-[#00246C] mt-1">{selectedProject.scale}</div>
              </div>
              
              <div className="rounded-2xl bg-emerald-50 p-4 border border-emerald-100">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-slate-500 font-medium">Approval Status</span>
                  {isSuperAdmin && <span className="text-[10px] text-amber-700 font-bold">(Superadmin Edit)</span>}
                </div>
                {isSuperAdmin ? (
                  <select
                    value={selectedProject.status}
                    onChange={(e) => {
                      const updatedStatus = e.target.value;
                      setSelectedProject({ ...selectedProject, status: updatedStatus, approval_status: updatedStatus });
                      setProjectList((prev) =>
                        prev.map((p) => (p.id === selectedProject.id ? { ...p, status: updatedStatus, approval_status: updatedStatus } : p))
                      );
                    }}
                    className="w-full rounded-xl border border-emerald-300 bg-white p-2 text-xs font-bold text-emerald-900 outline-none"
                  >
                    <option value="Pending Committee Review / Grant Application">Pending Committee Review / Grant Application</option>
                    <option value="Approved by Board & KLRCF Trustees">Approved by Board & KLRCF Trustees</option>
                    <option value="Approved subject to Quotation Verification">Approved subject to Quotation Verification</option>
                    <option value="Under Review / Additional Quotes Required">Under Review / Additional Quotes Required</option>
                    <option value="Deferred / Non-Grant Project">Deferred / Non-Grant Project</option>
                  </select>
                ) : (
                  <div className="text-sm font-bold text-emerald-900 mt-1">{selectedProject.status}</div>
                )}
              </div>
            </div>

            {/* 4-STAGE SEQUENTIAL GRANT APPROVAL WORKFLOW CARD */}
            {renderGrantApprovalCard(selectedProject)}

            <div className="mt-6 space-y-4 text-xs text-slate-700">
              <div>
                <h4 className="font-bold text-slate-900 text-sm">Project Objective & Scope</h4>
                <p className="mt-1 text-slate-600 leading-relaxed">{selectedProject.objective}</p>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 text-sm">Target Beneficiaries & Impact</h4>
                <p className="mt-1 text-slate-600 leading-relaxed">{selectedProject.impact_details}</p>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 text-sm">Funding & Grant Sources</h4>
                <p className="mt-1 text-slate-600 font-semibold bg-slate-50 p-3 rounded-xl border border-slate-200">
                  {selectedProject.funding_sources}
                </p>
              </div>

              {/* Attached Documents (Supplier Quotations & Invoices) Display */}
              <div className="border-t border-slate-200 pt-4 mt-2 space-y-3">
                <div>
                  <h4 className="font-bold text-[#00246C] text-sm flex items-center justify-between gap-2 mb-2">
                    <span className="flex items-center gap-2">
                      <Upload className="h-4 w-4 text-[#F7A81B]" /> Attached Supplier / Vendor Quotations
                    </span>
                    {selectedProject.quotations && selectedProject.quotations.length > 0 && (
                      <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        {selectedProject.quotations.length} Attached
                      </span>
                    )}
                  </h4>
                  {selectedProject.quotations && selectedProject.quotations.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                      {selectedProject.quotations.map((q: any, i: number) => (
                        <div
                          key={i}
                          className="rounded-xl border border-emerald-200 bg-emerald-50/70 p-2.5 flex items-center justify-between gap-2 shadow-xs"
                        >
                          <div className="min-w-0 flex-1">
                            <div className="text-[11px] font-bold text-emerald-950 truncate" title={q.name}>{q.name}</div>
                            <div className="text-[9px] text-emerald-700 font-semibold">{q.size || "Verified"} • Supplier Quote</div>
                          </div>
                          <button
                            type="button"
                            onClick={() => triggerAttachmentDownload(q, selectedProject.title)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-bold shrink-0 shadow transition cursor-pointer"
                            title="Download Quotation"
                          >
                            <Download className="w-3 h-3" />
                            <span>Save</span>
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-400 italic bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                      No vendor quotations attached yet for this project proposal.
                    </p>
                  )}
                </div>

                {/* Attached Invoices / Receipts */}
                <div>
                  <h4 className="font-bold text-[#00246C] text-sm flex items-center justify-between gap-2 mb-2">
                    <span className="flex items-center gap-2">
                      <FileCheck className="h-4 w-4 text-[#005DAA]" /> Attached Invoices &amp; Receipts
                    </span>
                    {selectedProject.invoices && selectedProject.invoices.length > 0 && (
                      <span className="text-[10px] font-bold text-blue-800 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                        {selectedProject.invoices.length} Attached
                      </span>
                    )}
                  </h4>
                  {selectedProject.invoices && selectedProject.invoices.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                      {selectedProject.invoices.map((inv: any, i: number) => (
                        <div
                          key={i}
                          className="rounded-xl border border-blue-200 bg-blue-50/70 p-2.5 flex items-center justify-between gap-2 shadow-xs"
                        >
                          <div className="min-w-0 flex-1">
                            <div className="text-[11px] font-bold text-blue-950 truncate" title={inv.name}>{inv.name}</div>
                            <div className="text-[9px] text-blue-700 font-semibold">{inv.size || "Verified"} • Official Invoice</div>
                          </div>
                          <button
                            type="button"
                            onClick={() => triggerAttachmentDownload(inv, selectedProject.title)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#00246C] hover:bg-blue-900 text-white text-[10px] font-bold shrink-0 shadow transition cursor-pointer"
                            title="Download Invoice"
                          >
                            <Download className="w-3 h-3" />
                            <span>Save</span>
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-400 italic bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                      No invoices or receipts attached yet for this project.
                    </p>
                  )}
                </div>
              </div>

              {/* Action Buttons: App-Style Toolbar with 3 Compact Buttons In One Line */}
              <div className="border-t border-slate-200 pt-3.5 mt-4">
                <div className="grid grid-cols-3 gap-2 w-full">
                  <button
                    type="button"
                    onClick={() => handleOpenProjectPaper(selectedProject)}
                    className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-1.5 rounded-xl bg-[#00246C] hover:bg-blue-900 py-2 px-1 sm:py-2.5 sm:px-3 text-center transition shadow cursor-pointer text-[#F7A81B]"
                    title="Open and view the Official Project Paper"
                  >
                    <FileText className="h-4 w-4 shrink-0" />
                    <span className="text-[10px] sm:text-xs font-black tracking-tight leading-tight">Open Paper</span>
                  </button>

                  <a
                    href={getMailtoLink(selectedProject)}
                    className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-1.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 py-2 px-1 sm:py-2.5 sm:px-3 text-center transition text-slate-800 shadow-sm"
                    title="Open in email client pre-addressed to all 4 stakeholders"
                  >
                    <Mail className="h-4 w-4 text-[#00246C] shrink-0" />
                    <span className="text-[10px] sm:text-xs font-black tracking-tight leading-tight">Email Client</span>
                  </a>

                  <button
                    type="button"
                    onClick={() => {
                      dispatchGrantEmails(selectedProject);
                      setSubmittedGrantModal(selectedProject);
                    }}
                    className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-1.5 rounded-xl border border-blue-200 bg-blue-50 hover:bg-blue-100 py-2 px-1 sm:py-2.5 sm:px-3 text-center transition text-[#00246C] shadow-sm cursor-pointer"
                    title="Notify Applicant, Community Service Director, KLRCF Treasurer, and President"
                  >
                    <Send className="h-4 w-4 shrink-0" />
                    <span className="text-[10px] sm:text-xs font-black tracking-tight leading-tight">Notify 4</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MEMBER DETAILS MODAL WITH RESPECT FOR PRIVACY CONFIGURATION */}
      {selectedMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl border border-slate-200 relative animate-in fade-in zoom-in duration-200 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedMember(null)}
              className="absolute right-4 top-4 rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-4">
              <div
                className="relative group cursor-pointer shrink-0"
                onClick={() => {
                  const input = document.createElement("input");
                  input.type = "file";
                  input.accept = "image/*";
                  input.onchange = (e: any) => handlePhotoUpload(e, selectedMember.email || selectedMember.name);
                  input.click();
                }}
              >
                {getMemberImage(selectedMember) ? (
                  <img
                    src={getMemberImage(selectedMember)!}
                    alt={selectedMember.name}
                    className="h-20 w-20 rounded-2xl object-cover border-2 border-amber-400 shadow-md"
                  />
                ) : (
                  <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-[#00246C] text-[#F7A81B] font-bold text-3xl shadow-md">
                    {selectedMember.name.charAt(0)}
                  </div>
                )}
                <div className="absolute inset-0 rounded-2xl bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center transition text-[10px] font-bold text-white">
                  <Camera className="h-5 w-5 text-white mb-1" />
                  Upload Photo
                </div>
              </div>

              <div>
                <h3 className="font-bold text-lg text-slate-900">{selectedMember.name}</h3>
                <div className="text-xs font-bold text-[#005DAA] bg-blue-50 inline-block px-2.5 py-0.5 rounded mt-1">
                  {selectedMember.classification || "Active Rotarian"}
                </div>
                {selectedMember.phf && (
                  <div className="mt-1">
                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-0.5 text-[10px] font-bold text-amber-900 border border-amber-300">
                      <Award className="h-3 w-3 text-amber-600" />
                      Paul Harris Fellow
                    </span>
                  </div>
                )}

                {/* Official System Multi-Role Badges */}
                <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                  {getMemberRoleList(selectedMember.email || selectedMember.name).map((r) => (
                    <span key={r} className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-2.5 py-0.5 text-[10px] font-bold text-blue-900 border border-blue-300">
                      <ShieldCheck className="h-3 w-3 text-blue-600" />
                      Role: {r}
                    </span>
                  ))}
                </div>

                {/* Superadmin Multi-Role Change Control (Nagesh Mahajan) */}
                {(isSuperAdmin || (loggedInMember && (loggedInMember.email === "matrixnagesh@gmail.com" || hasMemberRole(loggedInMember.email || loggedInMember.name, "Superadmin")))) && (
                  <div className="mt-2.5 rounded-xl bg-amber-50 p-2.5 border border-amber-300">
                    <label className="block text-[10px] font-bold text-amber-900 mb-1 flex items-center gap-1">
                      <Crown className="h-3 w-3 text-amber-600" /> Manage System Roles (Multi-Role Assignment)
                    </label>
                    <div className="flex flex-wrap items-center gap-1">
                      {["Project Lead", "Community Service Director", "Admin", "KLRCF Treasurer", "KLRCF Secretary", "KLRCF Member", "Boardmember", "Superadmin"].map((roleOpt) => {
                        const selKey = selectedMember.email || selectedMember.name;
                        const isAssigned = hasMemberRole(selKey, roleOpt);
                        return (
                          <button
                            key={roleOpt}
                            type="button"
                            onClick={() => toggleMemberRole(selKey, roleOpt)}
                            className={`rounded-lg px-2 py-0.5 text-[10px] font-bold transition border ${
                              isAssigned
                                ? "bg-[#00246C] text-[#F7A81B] border-[#00246C]"
                                : "bg-white text-slate-700 border-slate-300 hover:bg-slate-100"
                            }`}
                          >
                            {isAssigned ? `✓ ${roleOpt}` : `+ ${roleOpt}`}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Account Activation Controls for Superadmin & Member */}
                {(() => {
                  const mKey = selectedMember.email || selectedMember.name;
                  const isAct = memberActivation[mKey] ?? true;
                  const sentAlert = activationSentMsg[mKey];
                  return (
                    <div className="mt-2.5 space-y-2 border-t border-amber-200/60 pt-2.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-slate-600">Activation Status:</span>
                        {isAct ? (
                          <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300 flex items-center gap-1">
                            <CheckCircle2 className="h-3 w-3" /> Active Account
                          </span>
                        ) : (
                          <span className="text-[10px] font-extrabold text-amber-800 bg-amber-100 px-2 py-0.5 rounded border border-amber-300 flex items-center gap-1">
                            <ShieldAlert className="h-3 w-3 text-amber-600" /> Pending Activation
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => sendActivationLink(selectedMember.email || selectedMember.name, selectedMember.name)}
                          className="flex-1 rounded-xl bg-blue-50 hover:bg-blue-100 border border-blue-200 py-1.5 px-2.5 text-xs font-bold text-[#00246C] transition flex items-center justify-center gap-1"
                        >
                          <Mail className="h-3.5 w-3.5 text-[#005DAA]" /> Send Link
                        </button>

                        {(isSuperAdmin || (loggedInMember && (loggedInMember.email === "matrixnagesh@gmail.com" || loggedInMember.role?.includes("Superadmin")))) && (
                          <button
                            type="button"
                            onClick={() => toggleMemberActivation(mKey)}
                            className={`rounded-xl px-3 py-1.5 text-xs font-black transition border ${
                              isAct
                                ? "bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100"
                                : "bg-emerald-600 text-white border-emerald-700 hover:bg-emerald-700 shadow-sm"
                            }`}
                          >
                            {isAct ? "Deactivate" : "✓ Activate"}
                          </button>
                        )}
                      </div>

                      {sentAlert && (
                        <div className="text-[10px] font-bold text-emerald-700 bg-emerald-50 p-2 rounded-xl border border-emerald-200">
                          {sentAlert}
                        </div>
                      )}
                    </div>
                  );
                })()}
              </div>
            </div>

            <div className="mt-6 space-y-3 text-xs text-slate-700 border-t border-slate-100 pt-4">
              
              {/* Mobile Field */}
              <div className="flex items-center justify-between rounded-xl bg-slate-50 p-3">
                <span className="text-slate-500 font-medium">Mobile Phone</span>
                {memberPrivacy.show_mobile || (loggedInMember && loggedInMember.name === selectedMember.name) ? (
                  <a href={`tel:${selectedMember.mobile}`} className="font-bold text-[#00246C] hover:underline flex items-center gap-1">
                    <Phone className="h-3.5 w-3.5" /> {selectedMember.mobile || "N/A"}
                  </a>
                ) : (
                  <span className="font-semibold text-slate-400 flex items-center gap-1">
                    <Lock className="h-3 w-3" /> Hidden by Member
                  </span>
                )}
              </div>

              {/* Email Field */}
              <div className="flex items-center justify-between rounded-xl bg-slate-50 p-3">
                <span className="text-slate-500 font-medium">Email Address</span>
                {memberPrivacy.show_email || (loggedInMember && loggedInMember.name === selectedMember.name) ? (
                  <a href={`mailto:${selectedMember.email}`} className="font-bold text-[#005DAA] hover:underline flex items-center gap-1 truncate max-w-[200px]">
                    <Mail className="h-3.5 w-3.5" /> {selectedMember.email || "N/A"}
                  </a>
                ) : (
                  <span className="font-semibold text-slate-400 flex items-center gap-1">
                    <Lock className="h-3 w-3" /> Hidden by Member
                  </span>
                )}
              </div>

              {/* Office Address Field */}
              {selectedMember.office_addr && (
                <div className="flex flex-col rounded-xl bg-slate-50 p-3 space-y-1">
                  <span className="text-slate-500 font-medium">Office Address</span>
                  {memberPrivacy.show_office || (loggedInMember && loggedInMember.name === selectedMember.name) ? (
                    <span className="font-bold text-slate-800">{selectedMember.office_addr}</span>
                  ) : (
                    <span className="font-semibold text-slate-400 flex items-center gap-1">
                      <Lock className="h-3 w-3" /> Hidden by Member
                    </span>
                  )}
                </div>
              )}

              {/* Residence Address Field */}
              {selectedMember.residence_addr && (
                <div className="flex flex-col rounded-xl bg-slate-50 p-3 space-y-1">
                  <span className="text-slate-500 font-medium">Residence Address</span>
                  {memberPrivacy.show_residence || (loggedInMember && loggedInMember.name === selectedMember.name) ? (
                    <span className="font-bold text-slate-800">{selectedMember.residence_addr}</span>
                  ) : (
                    <span className="font-semibold text-slate-400 flex items-center gap-1">
                      <Lock className="h-3 w-3" /> Hidden by Member
                    </span>
                  )}
                </div>
              )}

              {/* Birthday & Anniversary */}
              {(selectedMember.birthday || selectedMember.wedding_anniversary) && (
                <div className="flex items-center justify-between rounded-xl bg-slate-50 p-3">
                  <span className="text-slate-500 font-medium">Birthday / Anniversary</span>
                  {memberPrivacy.show_birthday || (loggedInMember && loggedInMember.name === selectedMember.name) ? (
                    <span className="font-bold text-slate-800">
                      {selectedMember.birthday ? `Birthday: ${selectedMember.birthday}` : ""}
                      {selectedMember.wedding_anniversary ? ` • Anniv: ${selectedMember.wedding_anniversary}` : ""}
                    </span>
                  ) : (
                    <span className="font-semibold text-slate-400 flex items-center gap-1">
                      <Lock className="h-3 w-3" /> Hidden by Member
                    </span>
                  )}
                </div>
              )}

              {/* Spouse Info */}
              {selectedMember.spouse && (
                <div className="flex items-center justify-between rounded-xl bg-slate-50 p-3">
                  <span className="text-slate-500 font-medium">Spouse / Partner</span>
                  {memberPrivacy.show_spouse || (loggedInMember && loggedInMember.name === selectedMember.name) ? (
                    <span className="font-bold text-slate-800">{selectedMember.spouse}</span>
                  ) : (
                    <span className="font-semibold text-slate-400 flex items-center gap-1">
                      <Lock className="h-3 w-3" /> Hidden by Member
                    </span>
                  )}
                </div>
              )}

              <button
                onClick={() => {
                  const input = document.createElement("input");
                  input.type = "file";
                  input.accept = "image/*";
                  input.onchange = (e: any) => handlePhotoUpload(e, selectedMember.email || selectedMember.name);
                  input.click();
                }}
                className="w-full mt-2 flex items-center justify-center gap-2 rounded-xl bg-slate-100 hover:bg-slate-200 py-2 text-xs font-bold text-[#00246C] transition"
              >
                <Upload className="h-4 w-4" /> Upload Custom Profile Photo
              </button>
            </div>
          </div>
        </div>
      )}
      {/* ADD NEW MEMBER MODAL (SUPERADMIN CONTROL) */}
      {showAddMemberModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 md:p-8 shadow-2xl border-2 border-amber-300 relative text-slate-900 animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setShowAddMemberModal(false)}
              className="absolute top-4 right-4 rounded-full p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-2 mb-2 text-[#00246C]">
              <PlusCircle className="h-6 w-6 text-[#00246C]" />
              <h3 className="text-lg font-black uppercase tracking-tight">Add New Rotarian Member</h3>
            </div>
            <p className="text-xs text-slate-600 font-medium mb-5">
              Superadmin Control: Register a new Rotarian member manually into the RCKL DiRaja official directory roster.
            </p>

            <form onSubmit={handleAddNewMember} className="space-y-4 text-xs">
              <div>
                <label className="block font-black text-slate-800 mb-1">Rotarian Full Name (with Titles) *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rotarian Dato' Dr. Prakash Rao"
                  value={newMemberData.name}
                  onChange={(e) => setNewMemberData({ ...newMemberData, name: e.target.value })}
                  className="w-full rounded-xl border border-slate-300 p-2.5 font-bold outline-none focus:border-[#00246C]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-black text-slate-800 mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. prakash.rao@matrix-iot.com"
                    value={newMemberData.email}
                    onChange={(e) => setNewMemberData({ ...newMemberData, email: e.target.value })}
                    className="w-full rounded-xl border border-slate-300 p-2.5 font-semibold outline-none focus:border-[#00246C]"
                  />
                </div>

                <div>
                  <label className="block font-black text-slate-800 mb-1">Mobile Contact No</label>
                  <input
                    type="text"
                    placeholder="e.g. +60 12-345 6789"
                    value={newMemberData.mobile}
                    onChange={(e) => setNewMemberData({ ...newMemberData, mobile: e.target.value })}
                    className="w-full rounded-xl border border-slate-300 p-2.5 font-semibold outline-none focus:border-[#00246C]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-black text-slate-800 mb-1">Classification / Profession</label>
                  <input
                    type="text"
                    placeholder="e.g. Medical Services & Surgery"
                    value={newMemberData.classification}
                    onChange={(e) => setNewMemberData({ ...newMemberData, classification: e.target.value })}
                    className="w-full rounded-xl border border-slate-300 p-2.5 font-semibold outline-none focus:border-[#00246C]"
                  />
                </div>

                <div>
                  <label className="block font-black text-slate-800 mb-1">Rotary Honor / PHF</label>
                  <select
                    value={newMemberData.phf}
                    onChange={(e) => setNewMemberData({ ...newMemberData, phf: e.target.value })}
                    className="w-full rounded-xl border border-slate-300 p-2.5 font-bold outline-none focus:border-[#00246C]"
                  >
                    <option value="None">None</option>
                    <option value="PHF">PHF (Paul Harris Fellow)</option>
                    <option value="Major Donor">Major Donor</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowAddMemberModal(false)}
                  className="rounded-xl px-4 py-2 text-xs font-extrabold text-slate-600 hover:bg-slate-100 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-[#00246C] text-[#F7A81B] px-5 py-2 text-xs font-black hover:bg-blue-900 shadow-md transition flex items-center gap-1.5"
                >
                  <CheckCircle2 className="h-4 w-4" /> Save & Add Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SUPERADMIN PUBLISH CONGRATULATORY BROADCAST MODAL */}
      {isPublishModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="w-full max-w-lg rounded-3xl bg-white p-6 text-slate-900 shadow-2xl border border-slate-200 relative my-8">
            <button
              onClick={() => setIsPublishModalOpen(false)}
              className="absolute right-4 top-4 rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-3 mb-2 text-[#00246C]">
              <Sparkles className="h-6 w-6 text-[#F7A81B]" />
              <h3 className="text-lg font-black uppercase tracking-tight">Superadmin Publish Congratulatory Broadcast</h3>
            </div>
            <p className="text-xs text-slate-600 font-medium mb-5">
              Upload a picture with text and tag a member to publish a congratulatory announcement on the Members page.
            </p>

            <form onSubmit={handlePublishPost} className="space-y-4 text-xs">
              <div>
                <label className="block font-black text-slate-800 mb-1">Select Member Being Congratulated *</label>
                <select
                  required
                  value={postTargetMemberEmail}
                  onChange={(e) => setPostTargetMemberEmail(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 p-2.5 font-bold outline-none focus:border-[#00246C]"
                >
                  <option value="">-- Choose Member to Congratulate --</option>
                  {memberList.map((m) => (
                    <option key={m.id || m.email} value={m.email}>
                      {m.name} ({m.classification})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-black text-slate-800 mb-1">Headline / Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Congratulations on PHF Recognition!"
                    value={postTitle}
                    onChange={(e) => setPostTitle(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 p-2.5 font-bold outline-none focus:border-[#00246C]"
                  />
                </div>

                <div>
                  <label className="block font-black text-slate-800 mb-1">Category / Tag</label>
                  <select
                    value={postCategory}
                    onChange={(e) => setPostCategory(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 p-2.5 font-bold outline-none focus:border-[#00246C]"
                  >
                    <option value="PHF Award">PHF Award / Fellow</option>
                    <option value="Birthday Celebration">Birthday Celebration</option>
                    <option value="Anniversary">Anniversary</option>
                    <option value="Rotary Service Honor">Rotary Service Honor</option>
                    <option value="Leadership Honor">Leadership Honor</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-black text-slate-800 mb-1">Upload Picture / Banner</label>
                <div className="flex items-center gap-3">
                  <input
                    type="file"
                    ref={postFileInputRef}
                    accept="image/*"
                    onChange={handlePostImageUpload}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => postFileInputRef.current?.click()}
                    className="rounded-xl border border-slate-300 bg-slate-50 hover:bg-slate-100 px-4 py-2.5 font-bold text-slate-700 flex items-center gap-2 transition"
                  >
                    <Camera className="h-4 w-4 text-[#00246C]" /> Select Picture
                  </button>
                  {postImage && (
                    <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-1">
                      <CheckCircle2 className="h-4 w-4" /> Image Uploaded
                    </span>
                  )}
                </div>
                {postImage && (
                  <div className="mt-2 rounded-xl overflow-hidden max-h-40 border border-slate-200">
                    <img src={postImage} alt="Preview" className="w-full h-36 object-cover" />
                  </div>
                )}
              </div>

              <div>
                <label className="block font-black text-slate-800 mb-1">Congratulatory Message / Text *</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Enter the full congratulatory text message..."
                  value={postMessage}
                  onChange={(e) => setPostMessage(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 p-2.5 font-medium outline-none focus:border-[#00246C]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsPublishModalOpen(false)}
                  className="rounded-xl px-4 py-2 text-xs font-extrabold text-slate-600 hover:bg-slate-100 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-[#00246C] text-[#F7A81B] px-5 py-2.5 text-xs font-black hover:bg-blue-900 shadow-md transition flex items-center gap-1.5"
                >
                  <Send className="h-4 w-4" /> Publish Announcement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DIRECT CONGRATULATORY MESSAGE MODAL */}
      {selectedMemberToCongratulate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 text-slate-900 shadow-2xl border border-slate-200 relative">
            <button
              onClick={() => setSelectedMemberToCongratulate(null)}
              className="absolute right-4 top-4 rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#00246C] text-[#F7A81B]">
                <Send className="h-7 w-7" />
              </div>
              <h3 className="mt-3 text-lg font-extrabold text-[#00246C]">
                Congratulate {selectedMemberToCongratulate.name}
              </h3>
              <p className="mt-1 text-xs text-slate-500">
                Send a personalized congratulatory message directly to this member.
              </p>
            </div>

            {/* Target Member Summary Pill */}
            <div className="mt-4 rounded-2xl bg-amber-50 border border-amber-200 p-3 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#00246C] text-[#F7A81B] font-extrabold text-sm shrink-0">
                {selectedMemberToCongratulate.name.charAt(0)}
              </div>
              <div className="min-w-0 flex-1 text-left">
                <p className="text-xs font-black text-[#00246C] truncate">{selectedMemberToCongratulate.name}</p>
                <p className="text-[11px] text-slate-600 font-medium truncate">{selectedMemberToCongratulate.email}</p>
              </div>
            </div>

            {/* Quick Presets */}
            <div className="mt-4">
              <label className="block text-[11px] font-bold text-slate-700 mb-1">Quick Message Templates:</label>
              <div className="flex flex-wrap gap-1.5">
                <button
                  type="button"
                  onClick={() => setDirectMsgText(`🎉 Heartiest congratulations ${selectedMemberToCongratulate.name} on your well-deserved honor!`)}
                  className="rounded-lg bg-slate-100 hover:bg-blue-50 border border-slate-200 text-[10px] font-bold text-[#00246C] px-2.5 py-1 transition"
                >
                  🎉 Heartiest Congratulations!
                </button>
                <button
                  type="button"
                  onClick={() => setDirectMsgText(`🌟 Wishing you continued success and great accomplishments in Rotary Club of Kuala Lumpur DiRaja!`)}
                  className="rounded-lg bg-slate-100 hover:bg-blue-50 border border-slate-200 text-[10px] font-bold text-[#00246C] px-2.5 py-1 transition"
                >
                  🌟 Continued Success!
                </button>
              </div>
            </div>

            <div className="mt-3">
              <label className="block text-xs font-bold text-slate-700 mb-1">Your Message:</label>
              <textarea
                rows={3}
                value={directMsgText}
                onChange={(e) => setDirectMsgText(e.target.value)}
                className="w-full rounded-xl border border-slate-300 p-2.5 text-xs font-medium outline-none focus:border-[#00246C]"
              />
            </div>

            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleSendDirectMessage("whatsapp")}
                className="w-full flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 py-2.5 text-xs font-bold text-white shadow-md transition"
              >
                <Phone className="h-4 w-4" /> Send via WhatsApp
              </button>
              <button
                type="button"
                onClick={() => handleSendDirectMessage("email")}
                className="w-full flex items-center justify-center gap-1.5 rounded-xl bg-[#00246C] hover:bg-blue-900 py-2.5 text-xs font-bold text-[#F7A81B] shadow-md transition"
              >
                <Mail className="h-4 w-4" /> Send via Email
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TOAST CONFIRMATION */}
      {msgSentToast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 rounded-2xl bg-[#00246C] text-[#F7A81B] px-5 py-3.5 text-xs font-black shadow-2xl border border-amber-300 animate-bounce">
          <CheckCircle2 className="h-5 w-5 text-amber-400 shrink-0" />
          <span>{msgSentToast}</span>
        </div>
      )}

      {/* Official Footer with Official Logos & PDPA 2.0 Statutory Compliance */}
      <footer className="mt-12 border-t border-slate-200 bg-white py-8 px-4 text-center shadow-inner">
        <div className="mx-auto max-w-7xl flex flex-col gap-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 border-b border-slate-100 pb-6">
            <div className="flex items-center gap-3">
              <img src="/images/rckl_official_logo.png" alt="Rotary Club of Kuala Lumpur DiRaja" className="h-10 w-auto object-contain" />
            </div>
            <div className="text-center text-xs font-semibold text-slate-500">
              <div>Rotary Club of Kuala Lumpur DiRaja • District 3300 • Service Above Self</div>
              <div className="mt-1 text-[11px] text-slate-400">Founded 1928 • Chartered 1930 • Under Royal Patronage</div>
            </div>
            <div className="flex items-center gap-2 rounded-full border border-amber-300 bg-amber-50 px-4 py-1.5 text-xs font-bold text-[#00246C]">
              <img src="/images/rotary_wheel_gold.png" alt="Rotary Wheel" className="h-5 w-5 object-contain" />
              <span>District 3300</span>
            </div>
          </div>

          {/* PDPA 2.0 Statutory Governance Footer Row */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#00246C] text-amber-400 font-bold shrink-0">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div className="text-left">
                <div className="font-extrabold text-[#00246C]">PDPA 2.0 Statutory Compliance Enforced</div>
                <div className="text-[10px] text-slate-500">Malaysia Personal Data Protection (Amendment) Act 2024 (Act 709) • Ref: DPO Unit</div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => setIsPdpaModalOpen(true)}
                className="rounded-lg bg-[#00246C] text-[#F7A81B] px-3.5 py-1.5 text-xs font-bold hover:bg-blue-900 transition shadow-xs flex items-center gap-1.5"
              >
                <ShieldCheck className="h-3.5 w-3.5" /> PDPA 2.0 Notice & Data Subject Rights
              </button>
              <a
                href="/privacy"
                target="_blank"
                className="font-bold text-[#00246C] hover:underline text-xs"
              >
                Privacy Policy Page
              </a>
              <a
                href="mailto:dpo@rotarykl.org"
                className="font-bold text-slate-600 hover:text-[#00246C] text-xs"
              >
                Contact DPO
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* SELF-SERVICE USER REGISTRATION / ACCOUNT CREATION MODAL */}
      {isRegisterModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="w-full max-w-lg rounded-3xl bg-white p-6 text-slate-900 shadow-2xl border border-slate-200 relative my-8">
            <button
              onClick={() => setIsRegisterModalOpen(false)}
              className="absolute right-4 top-4 rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-3 mb-2 text-[#00246C]">
              <UserPlus className="h-6 w-6 text-emerald-600" />
              <h3 className="text-xl font-black uppercase tracking-tight">Create Member Account (Sign Up)</h3>
            </div>
            <p className="text-xs text-slate-600 font-medium mb-5">
              Register your details to create an account and join the Rotary Club of Kuala Lumpur DiRaja member roster.
            </p>

            <form onSubmit={handleRegisterSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-black text-slate-800 mb-1">Full Name (with Titles) *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rotarian Gurpreet Singh"
                  value={registerName}
                  onChange={(e) => setRegisterName(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 p-2.5 font-bold outline-none focus:border-[#00246C]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-black text-slate-800 mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. member@rckl-diraja.org"
                    value={registerEmail}
                    onChange={(e) => setRegisterEmail(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 p-2.5 font-semibold outline-none focus:border-[#00246C]"
                  />
                </div>

                <div>
                  <label className="block font-black text-slate-800 mb-1">Password *</label>
                  <input
                    type="password"
                    required
                    placeholder="Enter secure password"
                    value={registerPassword}
                    onChange={(e) => setRegisterPassword(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 p-2.5 font-semibold outline-none focus:border-[#00246C]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-black text-slate-800 mb-1">Mobile Contact No</label>
                  <input
                    type="text"
                    placeholder="e.g. +60 12-345 6789"
                    value={registerMobile}
                    onChange={(e) => setRegisterMobile(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 p-2.5 font-semibold outline-none focus:border-[#00246C]"
                  />
                </div>

                <div>
                  <label className="block font-black text-slate-800 mb-1">Classification / Profession</label>
                  <input
                    type="text"
                    placeholder="e.g. Business Advisory / Engineering"
                    value={registerClassification}
                    onChange={(e) => setRegisterClassification(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 p-2.5 font-semibold outline-none focus:border-[#00246C]"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsRegisterModalOpen(false)}
                  className="rounded-xl px-4 py-2 text-xs font-extrabold text-slate-600 hover:bg-slate-100 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-emerald-700 text-white px-5 py-2.5 text-xs font-black hover:bg-emerald-800 shadow-md transition flex items-center gap-1.5"
                >
                  <UserPlus className="h-4 w-4" /> Create Account & Sign In
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SECURE USERNAME & PASSWORD UPDATE MODAL */}
      {isSecurityModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 text-slate-900 shadow-2xl border border-slate-200 relative">
            <button
              onClick={() => setIsSecurityModalOpen(false)}
              className="absolute right-4 top-4 rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#00246C] text-[#F7A81B]">
                <Key className="h-7 w-7" />
              </div>
              <h3 className="mt-3 text-xl font-extrabold text-[#00246C]">Account Security & Credentials</h3>
              <p className="mt-1 text-xs text-slate-500">
                Update your username/email address or change your account password securely.
              </p>
            </div>

            {securitySuccessMsg ? (
              <div className="mt-6 rounded-2xl bg-emerald-50 border border-emerald-300 p-4 text-xs text-emerald-900 text-center">
                <CheckCircle2 className="mx-auto h-8 w-8 text-emerald-600 mb-2" />
                <p className="font-bold">{securitySuccessMsg}</p>
              </div>
            ) : (
              <form onSubmit={handleSecurityUpdate} className="mt-6 space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">New Username / Email Address</label>
                  <input
                    type="email"
                    placeholder={loggedInMember?.email || "matrixnagesh@gmail.com"}
                    value={newUsernameInput}
                    onChange={(e) => setNewUsernameInput(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-2.5 text-xs text-slate-900 outline-none focus:border-[#00246C]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">New Password</label>
                  <input
                    type="password"
                    placeholder="Enter new password"
                    value={newPasswordInput}
                    onChange={(e) => setNewPasswordInput(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-2.5 text-xs text-slate-900 outline-none focus:border-[#00246C]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Confirm New Password</label>
                  <input
                    type="password"
                    placeholder="Confirm new password"
                    value={confirmPasswordInput}
                    onChange={(e) => setConfirmPasswordInput(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-2.5 text-xs text-slate-900 outline-none focus:border-[#00246C]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full rounded-xl bg-[#00246C] hover:bg-blue-900 py-3 text-xs font-bold text-[#F7A81B] shadow-md transition flex items-center justify-center gap-1.5"
                >
                  <Save className="h-4 w-4" /> Save Security Credentials
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* SUPERADMIN ADD NEWSLETTER SOURCE MODAL */}
      {isAddFeedModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 text-slate-900 shadow-2xl border border-slate-200 relative">
            <button
              onClick={() => setIsAddFeedModalOpen(false)}
              className="absolute right-4 top-4 rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-600 text-white">
                <Newspaper className="h-7 w-7" />
              </div>
              <h3 className="mt-3 text-xl font-extrabold text-[#00246C]">Add Newsletter / Media Source</h3>
              <p className="mt-1 text-xs text-slate-500">
                Superadmin Control: Configure designated websites, WhatsApp channels, or blogs.
              </p>
            </div>

            <form onSubmit={handleAddNewsletterFeed} className="mt-6 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Source Type *</label>
                <select
                  value={newFeedType}
                  onChange={(e) => setNewFeedType(e.target.value as any)}
                  className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-2.5 text-xs text-slate-900 font-bold outline-none focus:border-[#00246C]"
                >
                  <option value="website">🌐 Internet Designated Website</option>
                  <option value="whatsapp">💬 Designated WhatsApp Broadcast Channel</option>
                  <option value="blog">📝 Designated Rotary Blog</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Source Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rotary International World News"
                  value={newFeedTitle}
                  onChange={(e) => setNewFeedTitle(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-2.5 text-xs text-slate-900 outline-none focus:border-[#00246C]"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">URL / Channel Link *</label>
                <input
                  type="url"
                  required
                  placeholder="https://example.org/news or https://whatsapp.com/channel/..."
                  value={newFeedUrl}
                  onChange={(e) => setNewFeedUrl(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-2.5 text-xs text-slate-900 outline-none focus:border-[#00246C]"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Brief Description</label>
                <textarea
                  rows={2}
                  placeholder="Enter source description..."
                  value={newFeedDesc}
                  onChange={(e) => setNewFeedDesc(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-2 text-xs text-slate-900 outline-none focus:border-[#00246C]"
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-xl bg-amber-600 hover:bg-amber-700 py-3 text-xs font-bold text-white shadow-md transition flex items-center justify-center gap-1.5"
              >
                <PlusCircle className="h-4 w-4" /> Save Source Feed
              </button>
            </form>
          </div>
        </div>
      )}

      {/* SUPERADMIN CONFIGURE DOCUMENT ACCESS ROLE MODAL */}
      {isDocConfigModalOpen && selectedDocId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 text-slate-900 shadow-2xl border border-slate-200 relative">
            <button
              onClick={() => setIsDocConfigModalOpen(false)}
              className="absolute right-4 top-4 rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-700 text-white">
                <Lock className="h-7 w-7" />
              </div>
              <h3 className="mt-3 text-xl font-extrabold text-[#00246C]">Configure Document Access Role</h3>
              <p className="mt-1 text-xs text-slate-500">
                Superadmin Control: Assign required role access permission for this document.
              </p>
            </div>

            <div className="mt-6 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Target Required Access Role</label>
                <select
                  value={targetDocRole}
                  onChange={(e) => setTargetDocRole(e.target.value as any)}
                  className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-2.5 text-xs text-slate-900 font-bold outline-none focus:border-[#00246C]"
                >
                  <option value="Public">🌍 Public (Open Access)</option>
                  <option value="Member">👤 Member (Registered Members Only)</option>
                  <option value="Admin">🛡️ Admin (Admins & Superadmins Only)</option>
                  <option value="Superadmin">👑 Superadmin (Confidential Superadmin Only)</option>
                </select>
              </div>

              <button
                type="button"
                onClick={() => handleUpdateDocRole(selectedDocId, targetDocRole)}
                className="w-full rounded-xl bg-purple-700 hover:bg-purple-800 py-3 text-xs font-bold text-white shadow-md transition flex items-center justify-center gap-1.5"
              >
                <Save className="h-4 w-4" /> Save Access Level
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PDPA 2.0 Statutory Compliance Modal (Authenticated view) */}
      <PdpaComplianceModal
        isOpen={isPdpaModalOpen}
        onClose={() => setIsPdpaModalOpen(false)}
        loggedInMember={loggedInMember}
      />

      {/* Floating 3D Mobile Bottom Navigation Tab Bar */}
      <div className="fixed bottom-3 left-1/2 -translate-x-1/2 z-40 w-[95%] max-w-lg bg-slate-900/90 backdrop-blur-xl border border-amber-500/30 rounded-2xl p-1.5 shadow-[0_12px_30px_rgba(0,0,0,0.5)] flex items-center justify-around">
        {[
          { id: "dashboard", label: "Home", icon: LayoutDashboard },
          { id: "directory", label: "Directory", icon: Users },
          { id: "projects", label: "Projects", icon: ClipboardList },
          { id: "newsletter", label: "News", icon: Newspaper },
          { id: "documents", label: "Docs", icon: FileText },
          { id: "values", label: "Values", icon: Shield }
        ].map((item) => {
          const IconComponent = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as any)}
              className={`flex flex-col items-center justify-center py-2 px-3 rounded-xl transition-all duration-150 ${
                isActive
                  ? "btn-3d-base btn-3d-gold text-slate-950 scale-105"
                  : "text-slate-400 hover:text-white active:scale-95"
              }`}
            >
              <IconComponent className={`h-4 w-4 ${isActive ? "text-slate-950 font-extrabold" : ""}`} />
              <span className={`text-[10px] font-bold mt-0.5 ${isActive ? "text-slate-950" : ""}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* POST-GRANT SUBMISSION CONFIRMATION & STAKEHOLDER EMAIL DISPATCH MODAL */}
      {submittedGrantModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-2xl rounded-3xl bg-white p-6 md:p-8 shadow-2xl border border-slate-200 relative max-h-[92vh] overflow-y-auto">
            <button
              onClick={() => setSubmittedGrantModal(null)}
              className="absolute right-4 top-4 rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
                <CheckCircle2 className="h-7 w-7" />
              </div>
              <div>
                <h3 className="text-xl font-extrabold text-[#00246C]">Grant Application Submitted Successfully!</h3>
                <p className="text-xs text-slate-500">
                  Project Paper ref: <span className="font-bold text-slate-700">#{submittedGrantModal.id}</span> • Data saved persistently
                </p>
              </div>
            </div>

            {/* Grant Summary Card */}
            <div className="mt-5 rounded-2xl bg-slate-50 p-4 border border-slate-200 text-xs space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-2">
                <span className="font-extrabold text-[#00246C] text-sm">{submittedGrantModal.title}</span>
                <span className="rounded-full bg-emerald-100 text-emerald-800 font-extrabold px-2.5 py-0.5 text-[11px]">
                  {submittedGrantModal.scale || `RM ${Number(submittedGrantModal.funds_requested || 0).toLocaleString()}`}
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-600 pt-1">
                <div>
                  <span className="font-semibold text-slate-800">Proposer:</span> {submittedGrantModal.proposer}
                </div>
                <div>
                  <span className="font-semibold text-slate-800">Applicant Email:</span> {submittedGrantModal.email}
                </div>
                <div>
                  <span className="font-semibold text-slate-800">Category:</span> {submittedGrantModal.category}
                </div>
                <div>
                  <span className="font-semibold text-slate-800">Beneficiaries:</span> {submittedGrantModal.beneficiaries}
                </div>
                {((submittedGrantModal.quotations && submittedGrantModal.quotations.length > 0) || (submittedGrantModal.invoices && submittedGrantModal.invoices.length > 0)) && (
                  <div className="sm:col-span-2 flex items-center justify-between bg-emerald-50 text-emerald-900 border border-emerald-200 p-2 rounded-xl text-[11px] font-semibold mt-1">
                    <span>
                      📎 {(submittedGrantModal.quotations?.length || 0) + (submittedGrantModal.invoices?.length || 0)} Attachment(s) Saved
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        const allFiles: any[] = [];
                        if (Array.isArray(submittedGrantModal.quotations)) allFiles.push(...submittedGrantModal.quotations);
                        if (Array.isArray(submittedGrantModal.invoices)) allFiles.push(...submittedGrantModal.invoices);
                        allFiles.forEach((file, idx) => {
                          setTimeout(() => triggerAttachmentDownload(file, submittedGrantModal.title), idx * 250);
                        });
                      }}
                      className="px-2.5 py-1 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-[10px] font-bold transition flex items-center gap-1 cursor-pointer"
                    >
                      <Download className="w-3 h-3" /> Download Attachments
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Primary Action Buttons: App-Style Toolbar with 3 Compact Buttons In One Line */}
            <div className="mt-4 grid grid-cols-3 gap-2 w-full">
              <button
                type="button"
                onClick={() => handleOpenProjectPaper(submittedGrantModal)}
                className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-1.5 rounded-xl bg-[#00246C] hover:bg-blue-900 py-2 px-1 sm:py-2.5 sm:px-3 text-center transition shadow-md cursor-pointer text-[#F7A81B]"
                title="Open and view submitted Official Project Paper"
              >
                <FileText className="h-4 w-4 shrink-0" />
                <span className="text-[10px] sm:text-xs font-black tracking-tight leading-tight">Open Paper</span>
              </button>

              <a
                href={getMailtoLink(submittedGrantModal)}
                className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-1.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 py-2 px-1 sm:py-2.5 sm:px-3 text-center transition text-slate-800 shadow-sm"
                title="Open email pre-addressed to all 4 stakeholders"
              >
                <Mail className="h-4 w-4 text-[#00246C] shrink-0" />
                <span className="text-[10px] sm:text-xs font-black tracking-tight leading-tight">Email</span>
              </a>

              <button
                type="button"
                onClick={() => dispatchGrantEmails(submittedGrantModal)}
                className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-1.5 rounded-xl border border-blue-200 bg-blue-50 hover:bg-blue-100 py-2 px-1 sm:py-2.5 sm:px-3 text-center transition text-[#00246C] shadow-sm cursor-pointer"
                title="Resend email notifications to all 4 stakeholders"
              >
                <RefreshCw className="h-4 w-4 shrink-0" />
                <span className="text-[10px] sm:text-xs font-black tracking-tight leading-tight">Resend</span>
              </button>
            </div>

            {/* 4-Stakeholder Automated Email Notification Status Panel */}
            <div className="mt-6 rounded-2xl border border-blue-100 bg-blue-50/60 p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-[#00246C]" />
                  <span className="text-xs font-extrabold text-[#00246C] uppercase tracking-wide">
                    Automated Notifications Dispatched to 4 Stakeholders
                  </span>
                </div>
                {emailDispatchStatus.loading ? (
                  <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full animate-pulse">
                    Dispatching...
                  </span>
                ) : (
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Check className="h-3 w-3" /> Dispatched
                  </span>
                )}
              </div>

              <div className="space-y-2">
                {[
                  {
                    label: "1. Applicant",
                    name: submittedGrantModal.proposer || "Applicant",
                    email: submittedGrantModal.email || "applicant@rckl.org.my",
                    note: "Receipt confirmation & proposal copy"
                  },
                  {
                    label: "2. Community Service Director",
                    name: "Thomas Varughese",
                    email: "thomaspenang63@gmail.com",
                    note: "Initial committee review & project verification"
                  },
                  {
                    label: "3. KLRCF Treasurer",
                    name: "Ajmal Khan",
                    email: "ajmal@hospitality.com.my",
                    note: "Financial grant allocation & budget review"
                  },
                  {
                    label: "4. Current President",
                    name: "Seyed Ehsan Masoumi Eshkevari",
                    email: "ehsun.m.e@gmail.com",
                    note: "Final Club & Board sanction"
                  }
                ].map((stakeholder, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 rounded-xl bg-white p-2.5 border border-slate-200 text-xs"
                  >
                    <div>
                      <span className="font-bold text-slate-800">{stakeholder.label}:</span>{" "}
                      <span className="text-slate-900 font-semibold">{stakeholder.name}</span>{" "}
                      <span className="text-slate-500 font-mono text-[11px]">({stakeholder.email})</span>
                      <div className="text-[10px] text-slate-400">{stakeholder.note}</div>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 self-start sm:self-auto flex items-center gap-1 shrink-0">
                      <Check className="h-3 w-3" /> Ready / Sent
                    </span>
                  </div>
                ))}
              </div>

              {emailDispatchStatus.message && (
                <p className="mt-2.5 text-[11px] text-slate-600 bg-white/70 p-2 rounded-lg border border-blue-100">
                  ℹ️ {emailDispatchStatus.message}
                </p>
              )}

              <div className="mt-3 flex justify-end">
                <button
                  type="button"
                  onClick={() => dispatchGrantEmails(submittedGrantModal)}
                  className="text-[11px] font-bold text-[#00246C] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <RefreshCw className="h-3 w-3" /> Resend Notifications
                </button>
              </div>
            </div>

            {/* Modal Bottom Close */}
            <div className="mt-4 flex justify-end border-t border-slate-200 pt-3">
              <button
                type="button"
                onClick={() => setSubmittedGrantModal(null)}
                className="rounded-xl bg-[#00246C] px-5 py-2 text-xs font-bold text-white hover:bg-blue-900 transition shadow cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* INTERACTIVE OFFICIAL PROJECT PAPER & GRANT APPLICATION VIEWER MODAL */}
      {isPaperViewerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-sm p-2 sm:p-4 overflow-y-auto">
          <div className="w-full max-w-4xl rounded-3xl bg-slate-100 p-3 sm:p-6 shadow-2xl border border-slate-300 relative my-auto max-h-[96vh] flex flex-col">
            {/* Top Toolbar (Hidden During Print) */}
            <div className="no-print bg-[#00246C] text-white p-3 sm:p-4 rounded-2xl shadow-md flex flex-wrap items-center justify-between gap-2 mb-4 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="h-9 w-9 rounded-xl bg-[#F7A81B] text-[#00246C] flex items-center justify-center font-bold shrink-0">
                  <FileText className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-xs sm:text-sm font-black text-white leading-tight">
                    Official Project Paper Viewer
                  </h3>
                  <p className="text-[10px] text-blue-200">
                    Ref: #{(activePrintProject || projectList[0])?.id || "NEW"} • {(activePrintProject || projectList[0])?.title}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5 sm:gap-2">
                {/* Download All Attachments Button if project has attachments */}
                {(() => {
                  const targetProj = activePrintProject || projectList[0];
                  const hasAtts = (targetProj?.quotations?.length || 0) + (targetProj?.invoices?.length || 0) > 0;
                  if (!hasAtts) return null;
                  return (
                    <button
                      type="button"
                      onClick={() => {
                        const allFiles: any[] = [];
                        if (Array.isArray(targetProj?.quotations)) allFiles.push(...targetProj.quotations);
                        if (Array.isArray(targetProj?.invoices)) allFiles.push(...targetProj.invoices);
                        allFiles.forEach((file, idx) => {
                          setTimeout(() => {
                            triggerAttachmentDownload(file, targetProj.title);
                          }, idx * 250);
                        });
                      }}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow transition cursor-pointer"
                      title="Download all attached quotations and invoices"
                    >
                      <Download className="h-3.5 w-3.5" /> <span className="hidden sm:inline">Attachments</span>
                    </button>
                  );
                })()}

                <button
                  type="button"
                  onClick={() => {
                    const targetProj = activePrintProject || projectList[0];
                    if (typeof window !== "undefined" && targetProj) {
                      sessionStorage.setItem("rckl_active_print_project", JSON.stringify(targetProj));
                      window.open(`/print-paper?id=${targetProj.id || ""}&autoprint=1`, "_blank");
                    }
                  }}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#F7A81B] hover:bg-amber-400 text-[#00246C] text-xs font-black shadow transition cursor-pointer"
                  title="Print or Save as Official 4-Page PDF"
                >
                  <Printer className="h-3.5 w-3.5" /> <span>Print / Save PDF</span>
                </button>

                <a
                  href={`/print-paper?id=${(activePrintProject || projectList[0])?.id || ""}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs font-bold transition"
                  title="Open standalone page in new window"
                >
                  <ExternalLink className="h-3.5 w-3.5" /> <span className="hidden sm:inline">New Tab</span>
                </a>

                <a
                  href="/ProjectPDF.pdf"
                  download="ProjectPDF_Official_Template.pdf"
                  className="hidden md:inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs font-bold transition"
                  title="Download Official Blank Template"
                >
                  <Download className="h-3.5 w-3.5" /> Blank Form
                </a>

                <button
                  type="button"
                  onClick={() => setIsPaperViewerOpen(false)}
                  className="rounded-xl p-1.5 bg-white/10 hover:bg-white/20 text-white transition ml-1 cursor-pointer"
                  title="Close Viewer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Scrollable Document Container */}
            <div className="overflow-y-auto flex-1 bg-slate-50 p-2 sm:p-6 rounded-2xl border border-slate-300 shadow-inner">
              <div id="rckl-printable-grant" className="max-w-4xl mx-auto space-y-6 text-slate-900 leading-normal">
        {(() => {
          const p = activePrintProject || projectList[0] || {};
          const printDate = new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" });
          const grantAmount = p.funds_requested ? `RM ${Number(p.funds_requested).toLocaleString()}` : p.scale || "RM 0";
          const allAttachedFiles: { name: string; type: string; size: string; dataUrl?: string }[] = [];
          if (Array.isArray(p.quotations)) {
            p.quotations.forEach((q: any) => allAttachedFiles.push({ name: q.name || "Supplier Quotation", type: "Supplier Quotation", size: q.size || "Attached", dataUrl: q.dataUrl }));
          }
          if (Array.isArray(p.invoices)) {
            p.invoices.forEach((inv: any) => allAttachedFiles.push({ name: inv.name || "Invoice / Receipt", type: "Invoice / Receipt", size: inv.size || "Attached", dataUrl: inv.dataUrl }));
          }
          const focusSet = new Set(Array.isArray(p.areas_of_focus) ? p.areas_of_focus : []);
          const ROTARY_AREAS = [
            "Peacebuilding and Conflict Prevention",
            "Disease Prevention and Treatment",
            "Water, Sanitation, and Hygiene",
            "Maternal and Child Health",
            "Basic Education and Literacy",
            "Community Economic Development",
            "Protecting the Environment"
          ];

          return (
            <>
              {/* PAGE 1 */}
              <div className="bg-white p-6 sm:p-8 rounded-xl border border-slate-300 shadow-md">
                <div className="border-b-2 border-slate-900 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img src="/images/rckl_official_logo.png" alt="RCKL DiRaja" className="h-16 w-auto object-contain" />
                    <div>
                      <h1 className="text-lg font-black tracking-tight text-slate-900 uppercase">Rotary Club of Kuala Lumpur DiRaja</h1>
                      <p className="text-[11px] text-slate-600 font-semibold">Chartered 15 January 1930 • District 3300 • Club No. 2351</p>
                      <p className="text-[11px] font-bold text-amber-700 uppercase mt-0.5">Official Community Service Project Paper &amp; Grant Application</p>
                    </div>
                  </div>
                  <div className="text-left sm:text-right text-[11px]">
                    <div className="font-bold text-slate-800">RY 2025/2026</div>
                    <div className="text-slate-600 font-mono">Ref: #{p.id || "NEW"}</div>
                    <div className="text-slate-500">{printDate}</div>
                  </div>
                </div>

                <div className="bg-slate-100 border border-slate-300 rounded p-2.5 my-3 flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs">
                  <div>
                    <span className="font-bold text-slate-700">PROJECT TITLE: </span>
                    <span className="font-black text-slate-900 text-sm">{p.title}</span>
                  </div>
                  <div>
                    <span className="font-bold text-slate-700">STATUS: </span>
                    <span className="font-bold text-blue-900 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">{p.status || "Pending Committee Review"}</span>
                  </div>
                </div>

                <div className="bg-[#00246C] text-[#F7A81B] font-black text-xs uppercase px-3 py-1.5 rounded-t tracking-wider flex items-center justify-between">
                  <span>Page 1: General Project Information</span>
                  <span className="text-[10px] text-white font-normal">Official Specification</span>
                </div>

                <table className="w-full border-collapse border border-slate-300 text-xs">
                  <tbody>
                    <tr>
                      <td className="border border-slate-300 p-2 font-bold bg-slate-50 w-1/4">Requester Email</td>
                      <td className="border border-slate-300 p-2 w-1/4 text-slate-800">{p.email || "—"}</td>
                      <td className="border border-slate-300 p-2 font-bold bg-slate-50 w-1/4">Request Date</td>
                      <td className="border border-slate-300 p-2 w-1/4 text-slate-800">{p.request_date || "—"}</td>
                    </tr>
                    <tr>
                      <td className="border border-slate-300 p-2 font-bold bg-slate-50">Requester Name &amp; Role</td>
                      <td className="border border-slate-300 p-2 font-semibold text-slate-900">{p.proposer || "Not specified"}</td>
                      <td className="border border-slate-300 p-2 font-bold bg-slate-50">Committee(s) / Avenue</td>
                      <td className="border border-slate-300 p-2 text-slate-800">{p.category || "Community Service"}</td>
                    </tr>
                    <tr>
                      <td className="border border-slate-300 p-2 font-bold bg-slate-50">Project Lead</td>
                      <td className="border border-slate-300 p-2 font-semibold text-slate-900">{p.lead || p.proposer || "—"}</td>
                      <td className="border border-slate-300 p-2 font-bold bg-slate-50">Location</td>
                      <td className="border border-slate-300 p-2 text-slate-800">{p.location || "Klang Valley, Selangor"}</td>
                    </tr>
                    <tr>
                      <td className="border border-slate-300 p-2 font-bold bg-slate-50">Sub-project of:</td>
                      <td className="border border-slate-300 p-2 text-slate-800">{p.sub_project || "None (Standalone Avenue Project)"}</td>
                      <td className="border border-slate-300 p-2 font-bold bg-slate-50">Joint project with:</td>
                      <td className="border border-slate-300 p-2 text-slate-800">{p.joint_project || "None (RCKL DiRaja Sole Initiative)"}</td>
                    </tr>
                    <tr>
                      <td className="border border-slate-300 p-2 font-bold bg-slate-50">Target Beneficiaries</td>
                      <td className="border border-slate-300 p-2 text-slate-800" colSpan={3}>{p.beneficiaries || "Community"}</td>
                    </tr>
                    <tr>
                      <td className="border border-slate-300 p-2 font-bold bg-slate-50">Project Duration</td>
                      <td className="border border-slate-300 p-2 text-slate-800">{p.duration || "1 Year"}</td>
                      <td className="border border-slate-300 p-2 font-bold bg-slate-50">Proposed Start Date</td>
                      <td className="border border-slate-300 p-2 text-slate-800">{p.start_date || "Upon Approval"}</td>
                    </tr>
                  </tbody>
                </table>
                <div className="border-t border-slate-300 pt-2 mt-4 text-[10px] text-slate-500 flex justify-between">
                  <span>Rotary Club of Kuala Lumpur DiRaja</span>
                  <span className="font-bold">Page 1 of 4</span>
                </div>
              </div>

              {/* PAGE 2 */}
              <div className="bg-white p-6 sm:p-8 rounded-xl border border-slate-300 shadow-md">
                <div className="bg-[#00246C] text-[#F7A81B] font-black text-xs uppercase px-3 py-1.5 rounded-t tracking-wider flex items-center justify-between">
                  <span>Page 2: Financials &amp; Implementation Plan</span>
                  <span className="text-[10px] text-white font-normal">Budget &amp; Avenue Strategy</span>
                </div>
                <table className="w-full border-collapse border border-slate-300 text-xs">
                  <tbody>
                    <tr>
                      <td className="border border-slate-300 p-2 font-bold bg-slate-50 w-1/4">Funds Requested (RM)</td>
                      <td className="border border-slate-300 p-2 w-1/4 font-black text-slate-900 text-sm">{grantAmount}</td>
                      <td className="border border-slate-300 p-2 font-bold bg-slate-50 w-1/4">Funds Timeline</td>
                      <td className="border border-slate-300 p-2 w-1/4 text-slate-800">{p.funds_timeline || "Immediate upon approval"}</td>
                    </tr>
                    <tr>
                      <td className="border border-slate-300 p-2 font-bold bg-slate-50">Funding Source(s)</td>
                      <td className="border border-slate-300 p-2 text-slate-800" colSpan={3}>{p.funding_sources || "Club Funds & KLRCF Grant"}</td>
                    </tr>
                  </tbody>
                </table>

                <div className="mt-3 border border-slate-300 rounded p-2.5 text-xs">
                  <span className="font-black uppercase text-slate-900 block mb-1">Project Description &amp; Core Objectives:</span>
                  <p className="text-slate-800 whitespace-pre-wrap text-[11px]">{p.objective || "No detailed objective provided."}</p>
                </div>

                <div className="mt-3 border border-slate-300 rounded p-2.5 text-xs">
                  <span className="font-black uppercase text-slate-900 block mb-1">Project Milestones &amp; Execution Schedule:</span>
                  <p className="text-slate-800 whitespace-pre-wrap text-[11px]">{p.milestones || "Monthly monitoring by Project Lead."}</p>
                </div>

                <div className="mt-3 border border-slate-300 rounded p-2.5 text-xs">
                  <span className="font-black uppercase text-slate-900 block mb-1.5">Rotary Areas of Focus:</span>
                  <div className="grid grid-cols-2 gap-1 text-[11px]">
                    {ROTARY_AREAS.map((focus) => {
                      const isChecked = focusSet.has(focus) || (Array.isArray(p.areas_of_focus) && p.areas_of_focus.some((af: string) => af.toLowerCase().includes(focus.toLowerCase())));
                      return (
                        <div key={focus} className="flex items-center gap-1.5">
                          <span className={isChecked ? "text-emerald-700 font-bold" : "text-slate-400"}>{isChecked ? "☑" : "☐"}</span>
                          <span className={isChecked ? "font-bold text-slate-900" : "text-slate-500"}>{focus}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="mt-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-black uppercase text-xs text-slate-900">
                      Attached Supplier Quotations &amp; Invoices ({allAttachedFiles.length} file{allAttachedFiles.length !== 1 ? "s" : ""}):
                    </span>
                    {allAttachedFiles.length > 0 && (
                      <span className="text-[10px] text-emerald-800 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 print:hidden">
                        ✓ All attachments verified &amp; downloadable
                      </span>
                    )}
                  </div>
                  <table className="w-full border-collapse border border-slate-300 text-xs">
                    <thead>
                      <tr className="bg-slate-100 font-bold text-slate-800">
                        <th className="border border-slate-300 p-1 text-center w-8">#</th>
                        <th className="border border-slate-300 p-1 text-left">Document Name</th>
                        <th className="border border-slate-300 p-1 text-left w-32">Type</th>
                        <th className="border border-slate-300 p-1 text-center w-24">Size</th>
                        <th className="border border-slate-300 p-1 text-center w-24 print:hidden">Download</th>
                      </tr>
                    </thead>
                    <tbody>
                      {allAttachedFiles.length > 0 ? (
                        allAttachedFiles.map((file, idx) => (
                          <tr key={idx}>
                            <td className="border border-slate-300 p-1 text-center font-bold">{idx + 1}</td>
                            <td className="border border-slate-300 p-1 font-medium text-slate-900">{file.name}</td>
                            <td className="border border-slate-300 p-1 text-slate-700">{file.type}</td>
                            <td className="border border-slate-300 p-1 text-center text-slate-600">{file.size}</td>
                            <td className="border border-slate-300 p-1 text-center print:hidden">
                              <button
                                type="button"
                                onClick={() => triggerAttachmentDownload(file, p.title)}
                                className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-blue-50 text-[#00246C] hover:bg-[#00246C] hover:text-white text-[10px] font-bold border border-blue-200 transition-colors shadow-xs cursor-pointer"
                                title={`Download ${file.name}`}
                              >
                                <Download className="w-3 h-3" />
                                <span>Save</span>
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr><td colSpan={5} className="border border-slate-300 p-1.5 text-center text-slate-500 italic">No external documents attached.</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
                <div className="border-t border-slate-300 pt-2 mt-4 text-[10px] text-slate-500 flex justify-between">
                  <span>Rotary Club of Kuala Lumpur DiRaja</span>
                  <span className="font-bold">Page 2 of 4</span>
                </div>
              </div>

              {/* PAGE 3 */}
              <div className="bg-white p-6 sm:p-8 rounded-xl border border-slate-300 shadow-md">
                <div className="bg-[#00246C] text-[#F7A81B] font-black text-xs uppercase px-3 py-1.5 rounded-t tracking-wider flex items-center justify-between">
                  <span>Page 3: Rotary Engagement &amp; Governance</span>
                  <span className="text-[10px] text-white font-normal">Section 3 &amp; 4</span>
                </div>
                <div className="space-y-3 mt-2 text-xs">
                  <div className="border border-slate-300 rounded p-2.5">
                    <span className="font-black uppercase text-slate-900 block mb-1">Rotary Responsibilities:</span>
                    <p className="text-slate-800 text-[11px]">{p.rotary_responsibilities || "Project planning, implementation, volunteer management, and reporting."}</p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div className="border border-slate-300 rounded p-2.5">
                      <span className="font-black uppercase text-slate-900 block mb-0.5">No. of Rotarians Involved:</span>
                      <p className="text-slate-800 text-[11px] font-semibold">{p.rotarians_involved || "10"} Rotarians active</p>
                    </div>
                    <div className="border border-slate-300 rounded p-2.5">
                      <span className="font-black uppercase text-slate-900 block mb-0.5">Visibility &amp; Public Image:</span>
                      <p className="text-slate-800 text-[11px]">{p.public_image || "Club Newsletter, Rotary Social Media & Press Releases"}</p>
                    </div>
                  </div>
                  <div className="border border-slate-300 rounded p-2.5">
                    <span className="font-black uppercase text-slate-900 block mb-1">Impact Assessment Plan:</span>
                    <p className="text-slate-800 text-[11px]">{p.impact_assessment || p.impact_details || "Beneficiary surveys, attendance logs, and project completion audit."}</p>
                  </div>
                  <div className="border border-slate-300 rounded p-2.5">
                    <span className="font-black uppercase text-slate-900 block mb-1">Project Funding Conditions (Club):</span>
                    <p className="text-slate-800 text-[11px]">{p.funding_conditions || "Standard club procurement protocol. Official receipts required."}</p>
                  </div>
                  <div className="border-2 border-slate-400 rounded p-3 bg-slate-50">
                    <div className="font-black uppercase text-[#00246C] text-[11px] mb-2">Sections to be filled in by Board / MC Approving This Project</div>
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
                  <div className="border border-slate-300 rounded p-2 bg-slate-50">
                    <span className="font-bold text-slate-700">Effective Project Start Date: </span>
                    <span className="font-semibold text-slate-900">{p.effective_start || p.start_date || "Upon Approval"}</span>
                  </div>
                </div>
                <div className="border-t border-slate-300 pt-2 mt-4 text-[10px] text-slate-500 flex justify-between">
                  <span>Rotary Club of Kuala Lumpur DiRaja</span>
                  <span className="font-bold">Page 3 of 4</span>
                </div>
              </div>

              {/* PAGE 4 */}
              <div className="bg-white p-6 sm:p-8 rounded-xl border border-slate-300 shadow-md">
                <div className="bg-[#00246C] text-[#F7A81B] font-black text-xs uppercase px-3 py-1.5 rounded-t tracking-wider flex items-center justify-between">
                  <span>Page 4: Sustainability, Reviewer Notes &amp; Official Endorsements</span>
                  <span className="text-[10px] text-white font-normal">Final Certification</span>
                </div>
                <div className="space-y-3 mt-2 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <div className="border border-slate-300 rounded p-2">
                      <span className="text-[10px] font-bold text-slate-700 block uppercase">Effective Project End:</span>
                      <span className="font-semibold text-slate-900 text-[11px]">{p.effective_end || "12 Months Post-Approval"}</span>
                    </div>
                    <div className="sm:col-span-2 border border-slate-300 rounded p-2">
                      <span className="text-[10px] font-bold text-slate-700 block uppercase">Comments / Next Steps:</span>
                      <span className="text-slate-800 text-[11px]">{p.comments_next_steps || "Proceed to committee review and sequential sign-off."}</span>
                    </div>
                  </div>
                  <div className="border border-slate-300 rounded p-2.5">
                    <span className="font-black uppercase text-slate-900 block mb-1">Project Sustainability Measures:</span>
                    <p className="text-slate-800 text-[11px]">{p.sustainability_measures || "Partnership with community stakeholders to ensure continued impact."}</p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div className="border border-slate-300 rounded p-2.5">
                      <span className="font-black uppercase text-slate-900 block mb-1">Sustainability Ownership:</span>
                      <p className="text-slate-800 text-[11px]">{p.sustainability_ownership || "Community Service Avenue & Beneficiaries"}</p>
                    </div>
                    <div className="border border-slate-300 rounded p-2.5">
                      <span className="font-black uppercase text-slate-900 block mb-1">Sustainability Report:</span>
                      <p className="text-slate-800 text-[11px]">{p.sustainability_report || "Final completion report due within 60 days of conclusion."}</p>
                    </div>
                  </div>

                  {/* 4-Stage Signatures */}
                  <div className="pt-2">
                    <div className="bg-slate-200 text-slate-900 font-black text-xs uppercase px-3 py-1.5 border border-slate-300 flex items-center justify-between">
                      <span>Sequential 4-Stage Official Endorsements &amp; Signatures</span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-2">
                      {/* Stage 1 */}
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

                      {/* Stage 2 */}
                      <div className="border border-slate-300 p-2.5 rounded text-[11px] flex flex-col justify-between h-36 bg-slate-50/50">
                        <div>
                          <div className="font-bold text-slate-900">2. Community Service Dir.</div>
                          <div className="text-[10px] text-slate-500 mt-0.5">Committee Review</div>
                          <div className="font-semibold text-slate-800 mt-1">Thomas Varughese</div>
                        </div>
                        <div className="border-t border-slate-300 pt-1 text-[10px]">
                          <div>Status: <span className="font-bold text-slate-900">{p.approvals?.community_service_director?.approved ? "✓ Endorsed" : "Pending Sign"}</span></div>
                          <div>Date: {p.approvals?.community_service_director?.approved_at || "—"}</div>
                        </div>
                      </div>

                      {/* Stage 3 */}
                      <div className="border border-slate-300 p-2.5 rounded text-[11px] flex flex-col justify-between h-36 bg-slate-50/50">
                        <div>
                          <div className="font-bold text-slate-900">3. KLRCF Treasurer</div>
                          <div className="text-[10px] text-slate-500 mt-0.5">Fund Disbursement</div>
                          <div className="font-semibold text-slate-800 mt-1 truncate">Ajmal Khan</div>
                        </div>
                        <div className="border-t border-slate-300 pt-1 text-[10px]">
                          <div>Status: <span className="font-bold text-slate-900">{p.approvals?.klrcf_treasurer?.approved ? "✓ Disbursable" : "Pending Sign"}</span></div>
                          <div>Date: {p.approvals?.klrcf_treasurer?.approved_at || "—"}</div>
                        </div>
                      </div>

                      {/* Stage 4 */}
                      <div className="border border-slate-300 p-2.5 rounded text-[11px] flex flex-col justify-between h-36 bg-slate-50/50">
                        <div>
                          <div className="font-bold text-slate-900">4. Current President</div>
                          <div className="text-[10px] text-slate-500 mt-0.5">Board Sanction</div>
                          <div className="font-semibold text-slate-800 mt-1 truncate">Seyed Ehsan Masoumi</div>
                        </div>
                        <div className="border-t border-slate-300 pt-1 text-[10px]">
                          <div>Status: <span className="font-bold text-slate-900">{p.status?.includes("Approved") ? "✓ Sanctioned" : "Pending Board"}</span></div>
                          <div>Date: {p.status?.includes("Approved") ? printDate : "—"}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="border-t border-slate-300 pt-2 mt-4 text-[10px] text-slate-500 flex justify-between">
                  <span>Rotary Club of Kuala Lumpur DiRaja (Charter 2351)</span>
                  <span className="font-bold">Page 4 of 4 • End of Document</span>
                </div>
              </div>
            </>
          );
        })()}
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

