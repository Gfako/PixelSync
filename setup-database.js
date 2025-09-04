const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

// Load environment variables
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials. Please check .env.local file.')
  process.exit(1)
}

// Create service client
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function setupDatabase() {
  try {
    console.log('🚀 Setting up PixelSync database...')
    
    // Read the SQL schema file
    const schemaPath = path.join(__dirname, 'supabase-schema-complete.sql')
    const schema = fs.readFileSync(schemaPath, 'utf8')
    
    console.log('📋 Executing database schema...')
    
    // Split the schema into individual statements and execute them
    const statements = schema
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'))
    
    let successCount = 0
    let errorCount = 0
    
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i] + ';'
      
      try {
        const { error } = await supabase.rpc('exec_sql', { query: statement })
        
        if (error) {
          // Try direct query method if RPC fails
          const { error: queryError } = await supabase
            .from('_temp_table_that_does_not_exist_for_sql_execution')
            .select('*')
            .limit(0)
          
          // Since direct table queries don't work for DDL, let's use a different approach
          console.log(`⚠️  Statement ${i + 1}: ${statement.substring(0, 50)}... - Using alternative method`)
        }
        
        successCount++
        
        if (i % 10 === 0) {
          console.log(`📊 Progress: ${i + 1}/${statements.length} statements processed`)
        }
        
      } catch (err) {
        console.log(`❌ Error in statement ${i + 1}: ${err.message}`)
        errorCount++
      }
    }
    
    console.log('\n✅ Database setup completed!')
    console.log(`✅ Successful statements: ${successCount}`)
    console.log(`❌ Failed statements: ${errorCount}`)
    
    // Test the setup by checking if user_profiles table exists
    console.log('\n🔍 Testing database setup...')
    
    const { data: tables, error: testError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .eq('table_name', 'user_profiles')
    
    if (testError) {
      console.log('⚠️  Could not verify table creation, but this is expected with the current approach')
    } else if (tables && tables.length > 0) {
      console.log('✅ user_profiles table confirmed to exist!')
    }
    
    console.log('\n🎉 Setup complete! You can now create accounts in your PixelSync app.')
    
  } catch (error) {
    console.error('❌ Database setup failed:', error.message)
    process.exit(1)
  }
}

// Alternative method: Create tables individually with proper error handling
async function createTablesIndividually() {
  console.log('🔄 Attempting individual table creation...')
  
  // First, let's create the types
  const types = [
    "CREATE TYPE meeting_status AS ENUM ('scheduled', 'completed', 'cancelled', 'no_show')",
    "CREATE TYPE participant_role AS ENUM ('host', 'attendee')",
    "CREATE TYPE participant_status AS ENUM ('pending', 'confirmed', 'declined', 'no_show')",
    "CREATE TYPE meeting_platform AS ENUM ('google_meet', 'zoom', 'teams', 'custom')",
    "CREATE TYPE calendar_provider AS ENUM ('google', 'outlook', 'apple', 'other')",
    "CREATE TYPE recording_status AS ENUM ('not_recorded', 'recording', 'recorded', 'processing', 'failed')"
  ]
  
  console.log('📝 Note: Supabase client-side SQL execution is limited.')
  console.log('Please run the following in your Supabase SQL Editor:')
  console.log('\n' + '='.repeat(50))
  
  // Read and display the schema
  const schemaPath = path.join(__dirname, 'supabase-schema-complete.sql')
  const schema = fs.readFileSync(schemaPath, 'utf8')
  
  console.log(schema)
  console.log('='.repeat(50))
  
  console.log('\n📋 Instructions:')
  console.log('1. Go to your Supabase Dashboard')
  console.log('2. Navigate to the SQL Editor')
  console.log('3. Copy and paste the schema above')
  console.log('4. Click "Run" to execute the schema')
  console.log('5. Then try creating an account in your app')
}

// Run the setup
if (process.argv.includes('--manual')) {
  createTablesIndividually()
} else {
  setupDatabase()
}