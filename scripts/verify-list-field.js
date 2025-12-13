// Script to verify if any 'list' field remains in Product or products collections
const { MongoClient } = require('mongodb');
require('dotenv').config();

async function verifyListField() {
  const client = new MongoClient(process.env.DATABASE_URL);
  try {
    await client.connect();
    const db = client.db();
    const productWithList = await db.collection('Product').find({ list: { $exists: true } }).toArray();
    const productsWithList = await db.collection('products').find({ list: { $exists: true } }).toArray();
    console.log(`Product collection: ${productWithList.length} documents with 'list' field.`);
    console.log(`products collection: ${productsWithList.length} documents with 'list' field.`);
    if (productWithList.length > 0) {
      console.log('Sample from Product:', productWithList[0]);
    }
    if (productsWithList.length > 0) {
      console.log('Sample from products:', productsWithList[0]);
    }
  } catch (error) {
    console.error('Error verifying products:', error);
  } finally {
    await client.close();
  }
}

verifyListField();
