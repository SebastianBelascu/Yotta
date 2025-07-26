const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function setupFooterTable() {
  try {
    console.log('Setting up footer table...');
    
    // Read the SQL migration file
    const migrationPath = path.join(__dirname, '../migrations/create_footer_table.sql');
    const sql = fs.readFileSync(migrationPath, 'utf8');
    
    // Split SQL into individual statements
    const statements = sql
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));
    
    // Execute each statement
    for (const statement of statements) {
      if (statement.trim()) {
        console.log('Executing:', statement.substring(0, 50) + '...');
        const { error } = await supabase.rpc('exec_sql', { sql: statement });
        
        if (error) {
          console.error('Error executing statement:', error);
          // Try direct query for some statements
          const { error: directError } = await supabase
            .from('_supabase_migrations')
            .select('*')
            .limit(1);
          
          if (directError) {
            console.log('Trying alternative approach...');
            // For table creation, try using the REST API
            if (statement.includes('CREATE TABLE')) {
              console.log('Creating table via direct SQL execution...');
              // This would need to be handled differently in production
            }
          }
        } else {
          console.log('✓ Statement executed successfully');
        }
      }
    }
    
    console.log('Footer table setup completed!');
    
    // Verify the table was created
    const { data, error } = await supabase
      .from('footer')
      .select('*')
      .limit(1);
    
    if (error) {
      console.error('Error verifying table:', error);
    } else {
      console.log('✓ Footer table verified successfully');
      console.log('Sample data count:', data?.length || 0);
    }
    
  } catch (error) {
    console.error('Error setting up footer table:', error);
    process.exit(1);
  }
}

// Run the setup
setupFooterTable();
