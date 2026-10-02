import type {
  Centre,
  Course,
  District,
  Employer,
  Programme,
  Provider,
} from "@/types/domain";

// Synthetic reference data. Every name and code here is invented for the prototype.
// District names are real Maharashtra districts; nothing else refers to a real organisation.

export const DISTRICTS: readonly District[] = [
  { code: "pune", name: "Pune" },
  { code: "mumbai-suburban", name: "Mumbai Suburban" },
  { code: "nagpur", name: "Nagpur" },
  { code: "nashik", name: "Nashik" },
  { code: "chhatrapati-sambhajinagar", name: "Chhatrapati Sambhajinagar" },
  { code: "kolhapur", name: "Kolhapur" },
  { code: "solapur", name: "Solapur" },
  { code: "amravati", name: "Amravati" },
];

export const PROGRAMMES: readonly Programme[] = [
  {
    id: "prog-central-stt",
    code: "CENTRAL-STT",
    name: "Central short-term training (sample)",
    followUpWindows: ["W0", "W3", "W6", "W12"],
  },
  {
    id: "prog-state-stt",
    code: "STATE-STT",
    name: "State short-term training (sample)",
    followUpWindows: ["W0", "W3", "W6", "W12"],
  },
];

export const COURSES: readonly Course[] = [
  {
    id: "c-electrician",
    qpCode: "SMP-PWR-01",
    name: "Assistant Electrician",
    sector: "Power",
    nsqfLevel: 3,
    programmeId: "prog-central-stt",
  },
  {
    id: "c-auto-service",
    qpCode: "SMP-AUT-02",
    name: "Automotive Service Technician",
    sector: "Automotive",
    nsqfLevel: 4,
    programmeId: "prog-central-stt",
  },
  {
    id: "c-gda",
    qpCode: "SMP-HLT-03",
    name: "General Duty Assistant",
    sector: "Healthcare",
    nsqfLevel: 4,
    programmeId: "prog-state-stt",
  },
  {
    id: "c-retail",
    qpCode: "SMP-RET-04",
    name: "Retail Sales Associate",
    sector: "Retail",
    nsqfLevel: 3,
    programmeId: "prog-state-stt",
  },
  {
    id: "c-sewing",
    qpCode: "SMP-APP-05",
    name: "Sewing Machine Operator",
    sector: "Apparel",
    nsqfLevel: 3,
    programmeId: "prog-central-stt",
  },
  {
    id: "c-warehouse",
    qpCode: "SMP-LOG-06",
    name: "Warehouse Associate",
    sector: "Logistics",
    nsqfLevel: 3,
    programmeId: "prog-state-stt",
  },
  {
    id: "c-data-entry",
    qpCode: "SMP-ITS-07",
    name: "Data Entry Operator",
    sector: "IT-ITeS",
    nsqfLevel: 4,
    programmeId: "prog-state-stt",
  },
];

export const PROVIDERS: readonly Provider[] = [
  {
    id: "p-godavari",
    name: "Godavari Skill Centre",
    registrationRef: "TP-SMP-001",
  },
  {
    id: "p-konkan",
    name: "Konkan Technical Training",
    registrationRef: "TP-SMP-002",
  },
  {
    id: "p-vidarbha",
    name: "Vidarbha Workforce Academy",
    registrationRef: "TP-SMP-003",
  },
  {
    id: "p-sahyadri",
    name: "Sahyadri Trades Institute",
    registrationRef: "TP-SMP-004",
  },
  {
    id: "p-deccan",
    name: "Deccan Vocational Institute",
    registrationRef: "TP-SMP-005",
  },
  {
    id: "p-panchganga",
    name: "Panchganga Skills Hub",
    registrationRef: "TP-SMP-006",
  },
  {
    id: "p-bhima",
    name: "Bhima Valley Training Services",
    registrationRef: "TP-SMP-007",
  },
  {
    id: "p-purna",
    name: "Purna Career Institute",
    registrationRef: "TP-SMP-008",
  },
];

export const CENTRES: readonly Centre[] = [
  {
    id: "ctr-godavari-1",
    providerId: "p-godavari",
    districtCode: "nashik",
    name: "Nashik Road centre",
  },
  {
    id: "ctr-konkan-1",
    providerId: "p-konkan",
    districtCode: "mumbai-suburban",
    name: "Kurla centre",
  },
  {
    id: "ctr-vidarbha-1",
    providerId: "p-vidarbha",
    districtCode: "nagpur",
    name: "Hingna centre",
  },
  {
    id: "ctr-sahyadri-1",
    providerId: "p-sahyadri",
    districtCode: "pune",
    name: "Pimpri centre",
  },
  {
    id: "ctr-deccan-1",
    providerId: "p-deccan",
    districtCode: "chhatrapati-sambhajinagar",
    name: "Waluj centre",
  },
  {
    id: "ctr-panchganga-1",
    providerId: "p-panchganga",
    districtCode: "kolhapur",
    name: "Shiroli centre",
  },
  {
    id: "ctr-bhima-1",
    providerId: "p-bhima",
    districtCode: "solapur",
    name: "Akkalkot Road centre",
  },
  {
    id: "ctr-purna-1",
    providerId: "p-purna",
    districtCode: "amravati",
    name: "Badnera centre",
  },
];

export const EMPLOYERS: readonly Employer[] = [
  {
    id: "e-precision-auto",
    legalName: "Precision Auto Parts Pvt Ltd (sample)",
    gstin: null,
    udyamNumber: null,
    districtCode: "pune",
  },
  {
    id: "e-city-care",
    legalName: "City Care Hospital (sample)",
    gstin: null,
    udyamNumber: null,
    districtCode: "nagpur",
  },
  {
    id: "e-metro-retail",
    legalName: "Metro Retail Stores (sample)",
    gstin: null,
    udyamNumber: null,
    districtCode: "mumbai-suburban",
  },
  {
    id: "e-swift-logistics",
    legalName: "Swift Logistics Park (sample)",
    gstin: null,
    udyamNumber: null,
    districtCode: "nashik",
  },
  {
    id: "e-weave-garments",
    legalName: "Weave Garments (sample)",
    gstin: null,
    udyamNumber: null,
    districtCode: "solapur",
  },
  {
    id: "e-brightline-electric",
    legalName: "Brightline Electricals (sample)",
    gstin: null,
    udyamNumber: null,
    districtCode: "kolhapur",
  },
];

/** Certification months of the sample cohorts, oldest first. */
export const COHORT_MONTHS = [
  "2025-07-01",
  "2025-08-01",
  "2025-09-01",
  "2025-10-01",
  "2025-11-01",
  "2025-12-01",
  "2026-01-01",
  "2026-02-01",
] as const;

/** Cohorts whose W12 window has closed by the sample "today" (Oct 2026). */
export const COHORTS_WITH_W12: readonly string[] = ["2025-07-01", "2025-08-01"];

export const AGE_BANDS = [
  "18 to 24",
  "25 to 29",
  "30 to 35",
  "36 and above",
] as const;
export type AgeBand = (typeof AGE_BANDS)[number];

export function findById<T extends { id: string }>(
  items: readonly T[],
  id: string,
): T | undefined {
  return items.find((item) => item.id === id);
}

export function getDistrictName(code: string): string {
  return DISTRICTS.find((district) => district.code === code)?.name ?? code;
}

export function getProviderDistrictCode(providerId: string): string {
  return (
    CENTRES.find((centre) => centre.providerId === providerId)?.districtCode ??
    ""
  );
}
