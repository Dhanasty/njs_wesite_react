const Database = require('./database');
const { products } = require('./import-products');

async function migrateToSQLite() {
  console.log('🚀 Starting migration to SQLite...');
  
  const db = new Database();
  
  // Wait a bit for database to initialize
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  try {
    console.log(`📦 Migrating ${products.length} products...`);
    
    for (const product of products) {
      try {
        await db.createProduct(product);
        console.log(`✅ Migrated: ${product.name}`);
      } catch (error) {
        if (error.message.includes('UNIQUE constraint failed')) {
          console.log(`⚠️  Product already exists: ${product.name}`);
        } else {
          console.error(`❌ Error migrating ${product.name}:`, error.message);
        }
      }
    }
    
    // Verify migration
    const allProducts = await db.getAllProducts();
    console.log(`\n✅ Migration completed!`);
    console.log(`📊 Total products in database: ${allProducts.length}`);
    
    console.log('\n📋 Products in database:');
    allProducts.forEach((product, index) => {
      console.log(`${index + 1}. ${product.name} (${product.category}) - ₹${product.price}`);
    });
    
    // Close database
    await db.close();
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    await db.close();
    process.exit(1);
  }
}

// Run migration if called directly
if (require.main === module) {
  migrateToSQLite();
}

module.exports = { migrateToSQLite };