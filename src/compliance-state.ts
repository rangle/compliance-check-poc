import { ComplianceDocument, ComplianceDb, ComplianceOutput, ComplianceRecord } from './interfaces';
import { checkCompliance } from './policy-check';
import { join } from 'path';

const DB_FILE = join(__dirname, '..', '.compliance-db.json');
const MINUTE = 60000;

export const createRecord = (id: string, requirements: string[]) => {
  return {
    id,
    requirements,
    timestamp: Date.now(),
  };
}

export const storeRequirements = (db: ComplianceDb, doc: ComplianceDocument, output: ComplianceOutput) => {
  if (Array.isArray(db[doc.id])) {
    db[doc.id].push(createRecord(doc.id, output.requirements));
  } else {
    db[doc.id] = [createRecord(doc.id, output.requirements)];
  }

  return db;
};

export const checkRequirements = (records: ComplianceRecord[], output: ComplianceOutput) => {
  output.past_due = [];

  if (records.length <= 1) {
    return output;
  }

  const current = records[records.length - 1];

  return records.reduce((
    pastDueOutput, record
  ) => {
    const deltaT = current.timestamp - record.timestamp;
    // prune now valid elements from past_due
    output.past_due = (output.past_due as any).filter((req: string) => {
      return record.requirements.indexOf(req) > -1;
    });

    // update new past_due entries
    if (deltaT >= MINUTE) {
      const pastDue = record.requirements.filter((req) => {
        // to be past due the requirement must currently exist
        return current.requirements.indexOf(req) > -1 && 
        // to be past due the requirement must have existed before
          (record.requirements.indexOf(req) > -1) &&
        // to be past due the requirement must not already be marked 
          (output.past_due as any).indexOf(req) === -1;
      });
      output.past_due = (output.past_due as any).concat(pastDue);
    }
    return pastDueOutput;
  }, output)
}

export const writeDb = (writeFile: (fileName: string, data: any, options: any) => any) => (data: ComplianceDb) => {
  writeFile(DB_FILE, JSON.stringify(data), { encoding: 'utf8' });
}

/**
 *  This is not a real world safe database for *many* reasons
 */
export const openOrCreateDb = (
  readFile: (fileName: string, options: any) => string
): ComplianceDb => {
  try {
    return JSON.parse(readFile(DB_FILE, { encoding: 'utf8' }));
  } catch (err) {
    return {}; 
  }
}

export const submitDocument = (
  readFile: (fileName: string, options: any) => string,
  writeFile: (fileName: string, data: any, options: any) => any
) => (doc: ComplianceDocument) => {
  const compliance = checkCompliance(doc);

  if (compliance.requirements.indexOf('id') > -1) {
    console.log('');
    console.log(compliance);
    console.log('');
    console.log('Invalid ID, processing skipped');

    return compliance;
  }

  const db = openOrCreateDb(readFile);
  const updatedDb = storeRequirements(db, doc, compliance)
  writeDb(writeFile)(updatedDb);

  return checkRequirements(db[doc.id], compliance);
};