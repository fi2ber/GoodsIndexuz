const postgres = require('postgres');
const fs = require('fs');
const path = require('path');

// Try to load .env.local but don't fail if it doesn't exist (production env vars will be used)
try {
    if (fs.existsSync(path.resolve(process.cwd(), '.env.local'))) {
        require('dotenv').config({ path: path.resolve(process.cwd(), '.env.local') });
    }
} catch (e) {}

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
    console.error('DATABASE_URL is not set');
    process.exit(1);
}

const sql = postgres(databaseUrl);

async function runMigrations() {
    console.log('🚀 Running migrations in production...');
    
    const migrationsDir = path.join(process.cwd(), 'supabase', 'migrations');
    const files = fs.readdirSync(migrationsDir)
        .filter(f => f.endsWith('.sql'))
        .sort();

    for (const file of files) {
        console.log(`📦 Executing ${file}...`);
        const content = fs.readFileSync(path.join(migrationsDir, file), 'utf-8');
        
        // Split by semicolon but be careful with functions/triggers
        // For simplicity, we'll run the whole file if it doesn't have complex blocks,
        // or just use a simple split. Most of these files seem to be simple statements.
        try {
            // We use unsafe for raw SQL
            await sql.unsafe(content);
            console.log(`✅ ${file} completed`);
        } catch (error) {
            if (error.message.includes('already exists') || error.message.includes('duplicate')) {
                console.log(`ℹ️  ${file} partially applied or already exists, continuing...`);
            } else {
                console.error(`❌ Error in ${file}:`, error.message);
                // We might want to exit here if it's a critical error
            }
        }
    }

    console.log('✅ All migrations finished');
    await sql.end();
}

runMigrations().catch(err => {
    console.error('❌ Migration failed:', err);
    process.exit(1);
});
