import { MongoClient } from "mongodb";
import { NextResponse } from "next/server";
import getCurrentUser from "@/actions/get-current-user";

const MONGO_URI = process.env.DATABASE_URL?.replace("?replicaSet=rs0", "") || "mongodb://localhost:27017/ecommerce-nextjs-app";

export async function GET(request: Request) {
  const currentUser = await getCurrentUser();

  if (!currentUser || currentUser.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const mongoClient = new MongoClient(MONGO_URI);
  await mongoClient.connect();
  const db = mongoClient.db("ecommerce-nextjs-app");

  try {
    const reimbursements = await db.collection("Reimbursement").find({}).toArray();
    const totalReimbursed = reimbursements.reduce((acc, r) => acc + r.amount, 0);

    await mongoClient.close();

    return NextResponse.json({ total: totalReimbursed });
  } catch (error) {
    await mongoClient.close();
    console.error("Get total reimbursed error:", error);
    return NextResponse.json({ error: "Failed to get total reimbursed" }, { status: 500 });
  }
}
