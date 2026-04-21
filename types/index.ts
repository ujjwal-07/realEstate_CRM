export interface LeadHistory {
  _id?: string;
  action: string;
  details: string;
  date: string;
}

export interface Lead {
  _id: string;
  name: string;
  phone: string;
  email?: string;
  budget: number;
  location: string;
  propertyType: string;
  source: string;
  status: string;
  notes?: string[];
  history?: LeadHistory[]; // Added this
  createdAt: string;
  updatedAt: string;
}