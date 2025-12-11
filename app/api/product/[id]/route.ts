import getCurrentUser from "@/actions/get-current-user";
import prisma from "@/libs/prismadb";
import { NextResponse } from "next/server";
import { MongoClient, ObjectId } from "mongodb";

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const currentUser = await getCurrentUser();

  if (!currentUser || currentUser.role !== "ADMIN") {
    return NextResponse.error();
  }

  const mongoClient = new MongoClient(process.env.DATABASE_URL!);
  await mongoClient.connect();
  
  try {
    const db = mongoClient.db("ecommerce-nextjs-app");
    const product = await db.collection("Product").findOneAndDelete({
      _id: new ObjectId(params.id)
    });
    return NextResponse.json(product);
  } finally {
    await mongoClient.close();
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const currentUser = await getCurrentUser();

  if (!currentUser || currentUser.role !== "ADMIN") {
    return NextResponse.error();
  }

  const body = await request.json();
  const {
    name,
    description,
    price,
    dmc,
    brand,
    category,
    inStock,
    images,
    list,
    stock,
    remainingStock,
    isVisible,
  } = body;

  // Determine remaining and inStock flag
  const stockNum = stock !== undefined ? parseInt(stock as any, 10) : undefined;
  const remainingNum =
    remainingStock !== undefined
      ? parseInt(remainingStock as any, 10)
      : stockNum !== undefined
      ? stockNum
      : undefined;

  const inStockFlag = remainingNum !== undefined ? remainingNum > 0 : inStock;
  const dmcValue = dmc !== undefined ? parseFloat(dmc) : undefined;

  const updateData: any = {
    name,
    description,
    brand,
    category,
    images,
    price: parseFloat(price),
    list: parseFloat(list),
  };

  if (dmcValue !== undefined) updateData.dmc = dmcValue;
  if (inStockFlag !== undefined) updateData.inStock = inStockFlag;
  if (stockNum !== undefined) updateData.stock = stockNum;
  if (remainingNum !== undefined) updateData.remainingStock = remainingNum;
  if (isVisible !== undefined) updateData.isVisible = isVisible;
  updateData.updatedAt = new Date();

  const mongoClient = new MongoClient(process.env.DATABASE_URL!);
  await mongoClient.connect();
  
  try {
    const db = mongoClient.db("ecommerce-nextjs-app");
    const result = await db.collection("Product").findOneAndUpdate(
      { _id: new ObjectId(params.id) },
      { $set: updateData },
      { returnDocument: "after" }
    );
    return NextResponse.json(result);
  } finally {
    await mongoClient.close();
  }
}
