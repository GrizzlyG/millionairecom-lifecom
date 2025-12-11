import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";
import { MongoClient, ObjectId } from "mongodb";

const prisma = new PrismaClient();

// Use the same connection as the app but without replica set for seeding
const SEED_DB_URL = process.env.DATABASE_URL?.replace("?replicaSet=rs0", "") || "mongodb://mongo:27017/ecommerce-nextjs-app";

async function seedAdmin() {
  try {
    // Hash the password using bcryptjs
    const hashedPassword = await bcrypt.hash("adminpass", 10);

    // Use native MongoDB driver to insert without transaction
    const mongoClient = new MongoClient(SEED_DB_URL);
    await mongoClient.connect();
    
    const db = mongoClient.db("ecommerce-nextjs-app");
    
    // Check if admin already exists using native driver
    const existingAdmin = await db.collection("User").findOne({ email: "admin@example.com" });
    
    if (existingAdmin) {
      // Check if dates are strings (need fixing)
      if (typeof existingAdmin.createdAt === 'string') {
        await db.collection("User").updateOne(
          { email: "admin@example.com" },
          { 
            $set: { 
              createdAt: new Date(existingAdmin.createdAt),
              updatedAt: new Date(existingAdmin.updatedAt)
            }
          }
        );
        console.log("✓ Admin user dates fixed!");
      } else {
        console.log("Admin user already exists. Skipping.");
      }
      await mongoClient.close();
      return;
    }
    
    const now = new Date();
    
    await db.collection("User").insertOne({
      _id: new ObjectId(),
      name: "Admin User",
      email: "admin@example.com",
      hashedPassword,
      role: "ADMIN",
      createdAt: now,
      updatedAt: now,
    });
    
    await mongoClient.close();

    console.log("✓ Admin user created successfully!");
    console.log(`  Email: admin@example.com`);
    console.log(`  Password: adminpass`);
    console.log(`  Role: ADMIN`);
  } catch (error) {
    console.error("Error seeding admin user:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

async function seedProducts() {
  try {
    const mongoClient = new MongoClient(SEED_DB_URL);
    await mongoClient.connect();
    
    const db = mongoClient.db("ecommerce-nextjs-app");
    
    // Delete all existing products and orders
    await db.collection("Product").deleteMany({});
    await db.collection("Order").deleteMany({});
    console.log("Cleared existing products and orders...");
    
    const now = new Date();
    
    const products = [
      {
        _id: new ObjectId(),
        name: "iPhone 15 Pro",
        description: "The latest iPhone with A17 Pro chip, titanium design, and advanced camera system. Features a 6.1-inch Super Retina XDR display.",
        brand: "Apple",
        category: "Phone",
        inStock: true,
        stock: 50,
        remainingStock: 50,
        price: 999,
        dmc: 50,
        list: 1099,
        isVisible: true,
        images: [
          {
            color: "Blue",
            colorCode: "#0071E3",
            image: "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=500"
          }
        ],
        reviews: [],
        createdAt: now,
        updatedAt: now,
      },
      {
        _id: new ObjectId(),
        name: "MacBook Air M3",
        description: "Supercharged by the M3 chip. Up to 18 hours of battery life. 13.6-inch Liquid Retina display. Strikingly thin and light design.",
        brand: "Apple",
        category: "Laptop",
        inStock: true,
        stock: 30,
        remainingStock: 30,
        price: 1199,
        dmc: 100,
        list: 1299,
        isVisible: true,
        images: [
          {
            color: "Silver",
            colorCode: "#E3E4E5",
            image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500"
          }
        ],
        reviews: [],
        createdAt: now,
        updatedAt: now,
      },
      {
        _id: new ObjectId(),
        name: "AirPods Pro (2nd Gen)",
        description: "Active Noise Cancellation, Adaptive Audio, and Personalized Spatial Audio. Up to 6 hours of listening time with a single charge.",
        brand: "Apple",
        category: "Accesories",
        inStock: true,
        stock: 100,
        remainingStock: 100,
        price: 249,
        dmc: 25,
        list: 279,
        isVisible: true,
        images: [
          {
            color: "White",
            colorCode: "#FFFFFF",
            image: "https://images.unsplash.com/photo-1606841837239-c5a1a4a07af7?w=500"
          }
        ],
        reviews: [],
        createdAt: now,
        updatedAt: now,
      }
    ];
    
    await db.collection("Product").insertMany(products);
    await mongoClient.close();
    
    console.log("✓ 3 products seeded successfully!");
    products.forEach(p => {
      console.log(`  - ${p.name} ($${p.price})`);
    });
  } catch (error) {
    console.error("Error seeding products:", error);
    process.exit(1);
  }
}

async function seedBankDetails() {
  try {
    const mongoClient = new MongoClient(SEED_DB_URL);
    await mongoClient.connect();
    
    const db = mongoClient.db("ecommerce-nextjs-app");
    
    // Check if bank details already exist
    const existingSettings = await db.collection("Settings").findOne({ _id: "settings" } as any);
    
    console.log("Existing settings:", existingSettings);
    
    if (existingSettings) {
      // Update to add hostels if they don't exist
      if (!existingSettings.hostels) {
        await db.collection("Settings").updateOne(
          { _id: "settings" as any },
          { 
            $set: { 
              hostels: [
                "Moremi Hall",
                "Tedder Hall",
                "Queen Elizabeth II Hall",
                "Obafemi Awolowo Hall",
                "Makama Bida Hall",
                "Ife Central Hostel",
                "Angola Hall",
                "Fajuyi Hall",
              ],
              updatedAt: new Date()
            }
          }
        );
        console.log("✓ Hostels added to existing settings!");
      } else {
        console.log("Bank details and hostels already configured. Skipping.");
      }
      await mongoClient.close();
      return;
    }
    
    const now = new Date();
    
    const result = await db.collection("Settings").insertOne({
      _id: "settings" as any,
      bankName: "First Bank of Nigeria",
      accountHolderName: "Window Shop Ltd",
      bankAccountNumber: "0123456789",
      hostels: [
        "Moremi Hall",
        "Tedder Hall",
        "Queen Elizabeth II Hall",
        "Obafemi Awolowo Hall",
        "Makama Bida Hall",
        "Ife Central Hostel",
        "Angola Hall",
        "Fajuyi Hall",
      ],
      createdAt: now,
      updatedAt: now,
    });
    
    console.log("Insert result:", result);
    
    await mongoClient.close();
    console.log("✓ Bank details configured successfully!");
  } catch (error) {
    console.error("Error seeding bank details:", error);
    process.exit(1);
  }
}

async function seedOrders() {
  try {
    const mongoClient = new MongoClient(SEED_DB_URL);
    await mongoClient.connect();
    
    const db = mongoClient.db("ecommerce-nextjs-app");
    
    // Get admin user (we'll use this as the customer for sample orders)
    const adminUser = await db.collection("User").findOne({ email: "admin@example.com" });
    
    if (!adminUser) {
      console.log("Admin user not found. Skipping order seeding.");
      await mongoClient.close();
      return;
    }
    
    // Get the seeded products
    const products = await db.collection("Product").find({}).toArray();
    
    if (products.length === 0) {
      console.log("No products found. Skipping order seeding.");
      await mongoClient.close();
      return;
    }
    
    const now = new Date();
    const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const twoDaysAgo = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000);
    
    const orders = [
      {
        _id: new ObjectId(),
        userId: adminUser._id.toString(),
        amount: (products[0].price + products[0].dmc) * 2, // iPhone x2
        totalDmc: products[0].dmc * 2,
        currency: "NGN",
        status: "complete",
        deliveryStatus: "delivered",
        paymentConfirmed: true,
        paymentClaimed: false,
        createDate: twoDaysAgo,
        paymentIntentId: `seed_pi_${Date.now()}_1`,
        products: [
          {
            id: products[0]._id.toString(),
            name: products[0].name,
            description: products[0].description,
            category: products[0].category,
            brand: products[0].brand,
            selectedImg: products[0].images[0],
            quantity: 2,
            price: products[0].price,
            dmc: products[0].dmc,
          }
        ],
        address: {
          name: adminUser.name,
          phone: "08012345678",
          hostel: "Moremi Hall",
        },
        createdAt: twoDaysAgo,
        updatedAt: twoDaysAgo,
      },
      {
        _id: new ObjectId(),
        userId: adminUser._id.toString(),
        amount: (products[1].price + products[1].dmc) * 1 + (products[2].price + products[2].dmc) * 3, // MacBook x1 + AirPods x3
        totalDmc: products[1].dmc * 1 + products[2].dmc * 3,
        currency: "NGN",
        status: "complete",
        deliveryStatus: "pending",
        paymentConfirmed: true,
        paymentClaimed: false,
        createDate: yesterday,
        paymentIntentId: `seed_pi_${Date.now()}_2`,
        products: [
          {
            id: products[1]._id.toString(),
            name: products[1].name,
            description: products[1].description,
            category: products[1].category,
            brand: products[1].brand,
            selectedImg: products[1].images[0],
            quantity: 1,
            price: products[1].price,
            dmc: products[1].dmc,
          },
          {
            id: products[2]._id.toString(),
            name: products[2].name,
            description: products[2].description,
            category: products[2].category,
            brand: products[2].brand,
            selectedImg: products[2].images[0],
            quantity: 3,
            price: products[2].price,
            dmc: products[2].dmc,
          }
        ],
        address: {
          name: adminUser.name,
          phone: "08012345678",
          hostel: "Tedder Hall",
        },
        createdAt: yesterday,
        updatedAt: yesterday,
      },
      {
        _id: new ObjectId(),
        userId: adminUser._id.toString(),
        amount: (products[2].price + products[2].dmc) * 5, // AirPods x5
        totalDmc: products[2].dmc * 5,
        currency: "NGN",
        status: "pending",
        deliveryStatus: "pending",
        paymentConfirmed: false,
        paymentClaimed: false,
        createDate: now,
        paymentIntentId: `seed_pi_${Date.now()}_3`,
        products: [
          {
            id: products[2]._id.toString(),
            name: products[2].name,
            description: products[2].description,
            category: products[2].category,
            brand: products[2].brand,
            selectedImg: products[2].images[0],
            quantity: 5,
            price: products[2].price,
            dmc: products[2].dmc,
          }
        ],
        address: {
          name: adminUser.name,
          phone: "08012345678",
          hostel: "Angola Hall",
        },
        createdAt: now,
        updatedAt: now,
      }
    ];
    
    await db.collection("Order").insertMany(orders);
    await mongoClient.close();
    
    console.log("✓ 3 sample orders seeded successfully!");
    console.log(`  - Order 1: 2x iPhone (complete, delivered) - ₦${orders[0].amount}`);
    console.log(`  - Order 2: 1x MacBook + 3x AirPods (complete, pending delivery) - ₦${orders[1].amount}`);
    console.log(`  - Order 3: 5x AirPods (pending payment) - ₦${orders[2].amount}`);
  } catch (error) {
    console.error("Error seeding orders:", error);
    process.exit(1);
  }
}

async function main() {
  await seedAdmin();
  await seedProducts();
  await seedBankDetails();
  await seedOrders();
  await prisma.$disconnect();
}

main();
