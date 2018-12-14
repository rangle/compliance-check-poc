export interface ComplianceDocument {
  [key: string]: any;
}

export interface Validator {
  (input: any, document?: ComplianceDocument): boolean;
}

export interface ComplianceRule {
  path: string[];
  predicate: Validator | Validator[];
}

export interface ComplianceOutput {
  compliant: boolean;
  requirements: string[];
  past_due?: string[];
}

export interface ComplianceDb {
  [key: string]: ComplianceRecord[];
}

export interface ComplianceRecord {
  id: string;
  timestamp: number;
  requirements: string[];
}
