import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { getClient } from '../utils/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function initDb() {
  const schemaPath = path.join(__dirname, '..', '..', 'sql_schema.sql');
  const schemaSql = fs.readFileSync(schemaPath, 'utf8');

  const client = await getClient();
  try {
    console.log('🛠️  Running schema...');
    await client.query(schemaSql);
    console.log('✅ Schema applied');
  } finally {
    client.release();
  }
}

initDb().catch((e) => {
  console.error(e);
  process.exit(1);
});
