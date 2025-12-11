import { MongoClient } from "mongodb";
import { NextResponse } from "next/server";
import getCurrentUser from "@/actions/get-current-user";

const MONGO_URI = process.env.DATABASE_URL?.replace("?replicaSet=rs0", "") || "mongodb://localhost:27017/ecommerce-nextjs-app";

export async function POST(request: Request) {
  const currentUser = await getCurrentUser();

  if (!currentUser || currentUser.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { amount } = body;

  if (!amount || amount <= 0) {
    return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
  }

  const mongoClient = new MongoClient(MONGO_URI);
  await mongoClient.connect();
  const db = mongoClient.db("ecommerce-nextjs-app");

  try {
    // Insert reimbursement record
    await db.collection("Reimbursement").insertOne({
      amount: amount,
      createdAt: new Date(),
    });

    // Mark all non-reimbursed paid orders as reimbursed
    await db.collection("Order").updateMany(
      { 
        paymentConfirmed: true,
        reimbursed: { $ne: true }
      },
      { 
        $set: { 
          reimbursed: true,
          reimbursedAt: new Date()
        } 
      }
    );

    // Calculate total reimbursed
    const reimbursements = await db.collection("Reimbursement").find({}).toArray();
    const totalReimbursed = reimbursements.reduce((acc, r) => acc + r.amount, 0);

    await mongoClient.close();

    return NextResponse.json({ 
      success: true,
      totalReimbursed: totalReimbursed
    });
  } catch (error) {
    await mongoClient.close();
    console.error("Confirm reimbursement error:", error);
    return NextResponse.json({ error: "Failed to confirm reimbursement" }, { status: 500 });
  }
}
