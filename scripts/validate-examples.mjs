import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import Ajv2020 from 'ajv/dist/2020.js';
import addFormats from 'ajv-formats';

const schema = JSON.parse(readFileSync(new URL('../tutor-card.schema.json', import.meta.url), 'utf8'));
const ajv = new Ajv2020({ allErrors: true, strict: true });
addFormats(ajv);
const validate = ajv.compile(schema);
const examplesDirectory = new URL('../examples/', import.meta.url);
const files = readdirSync(examplesDirectory).filter((name) => name.endsWith('.json')).sort();
if (files.length === 0) throw new Error('No Tutor Card examples found.');

for (const file of files) {
  const card = JSON.parse(readFileSync(new URL(file, examplesDirectory), 'utf8'));
  if (!validate(card)) throw new Error(`${file}: ${ajv.errorsText(validate.errors)}`);
  if (card.audience.age_range_min > card.audience.age_range_max) {
    throw new Error(`${file}: minimum age exceeds maximum age`);
  }
  process.stdout.write(`VALID ${join('examples', file)}\n`);
}

const under13 = JSON.parse(readFileSync(new URL('k12-math-tutor.json', examplesDirectory), 'utf8'));
under13.data_privacy.coppa_compliant = false;
if (validate(under13)) throw new Error('Known-invalid under-13/COPPA control was accepted.');
process.stdout.write('REJECTED known-invalid under-13/COPPA control\n');
