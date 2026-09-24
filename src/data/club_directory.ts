import clubDirectoryJson from "./club_directory.json";

export interface RotarianMember {
  id: number;
  name: string;
  classification: string;
  office_addr?: string;
  office_tel?: string;
  residence_addr?: string;
  residence_tel?: string;
  mobile?: string;
  email?: string;
  birthday?: string;
  wedding_anniversary?: string;
  spouse?: string;
  spouse_birthday?: string;
  main_festivals?: string;
  joined_rotary?: string;
  joined_rckl?: string;
  rotary_offices?: string;
  hobbies?: string;
  proposer?: string;
  correspondence?: string;
  phf?: boolean;
  role?: string;
  image?: string;
}

export interface PastPresident {
  year: string;
  name: string;
}

export interface ProjectGrant {
  id: number;
  title: string;
  category: string;
  year: string;
  scale: string;
  status: string;
  objective: string;
  location: string;
  beneficiaries: string;
  funding_sources: string;
}

export interface ClubDirectoryData {
  club_info: {
    name: string;
    founded: string;
    chartered: string;
    charter_no: string;
    club_no: string;
    district: string;
    address: string;
    email: string;
    website: string;
    meeting_day: string;
    meeting_venue: string;
  };
  board: Array<{ position: string; name: string }>;
  members: RotarianMember[];
  four_way_test: string[];
  past_presidents: PastPresident[];
  projects: ProjectGrant[];
}

export const clubData: ClubDirectoryData = clubDirectoryJson as unknown as ClubDirectoryData;
