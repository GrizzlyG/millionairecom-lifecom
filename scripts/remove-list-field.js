// Script to remove the 'list' field from all products in MongoDB
const { MongoClient } = require('mongodb');
require('dotenv').config();

async function removeListField() {
  const client = new MongoClient(process.env.DATABASE_URL);
  try {
    await client.connect();
    const db = client.db(); // Uses DB from connection string
    // Remove from 'Product' collection
    const resultProduct = await db.collection('Product').updateMany(
      { list: { $exists: true } },
      { $unset: { list: "" } }
    );
    const resultProductNull = await db.collection('Product').updateMany(
      { list: { $in: [null, undefined] } },
      { $unset: { list: "" } }
    );
    // Remove from 'products' collection (just in case)
    const resultProducts = await db.collection('products').updateMany(
      { list: { $exists: true } },
      { $unset: { list: "" } }
    );
    const resultProductsNull = await db.collection('products').updateMany(
      { list: { $in: [null, undefined] } },
      { $unset: { list: "" } }
    );
    const total = resultProduct.modifiedCount + resultProductNull.modifiedCount + resultProducts.modifiedCount + resultProductsNull.modifiedCount;
    console.log(`Removed 'list' field from ${total} products (Product & products collections).`);
  } catch (error) {
    console.error('Error updating products:', error);
  } finally {
    await client.close();
  }
}

removeListField();
