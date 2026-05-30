// migrate.js
// Run this with: node migrate.js
// Requirements: npm install @supabase/supabase-js dotenv

require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

async function migrate() {
  const { data: oldData, error } = await supabase.from('group_data').select('*');
  if (error) throw error;

  for (const row of oldData) {
    const { group_id, data } = row;
    console.log(`Migrating ${group_id}...`);

    // 1. Migrate PESTEL
    if (data.pestel) {
      for (const item of data.pestel) {
        await supabase.from('pestel_rows').insert({
          group_id,
          row_key: item.id,
          content: item,
        });
      }
    }

    // 2. Migrate VRIO
    if (data.vrio) {
      for (const item of data.vrio) {
        await supabase.from('vrio_rows').insert({
          group_id,
          row_key: item.id,
          content: item,
        });
      }
    }

    // 3. Migrate Meta
    if (data.meta) {
      await supabase.from('meta_data').insert({
        group_id,
        content: data.meta,
      });
    }

    // ... handle others similarly ...
  }
  console.log('Migration complete.');
}

migrate();
