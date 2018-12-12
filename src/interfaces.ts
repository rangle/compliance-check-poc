export interface ComplianceDocument {
  [key: string]: any;
}

export interface ComplianceOutput {
  compliant: boolean;
  requirements: string[];
}
