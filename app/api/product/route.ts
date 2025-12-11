import { NextResponse } from "next/server";
import getCurrentUser from "@/actions/get-current-user";
import { MongoClient, ObjectId } from "mongodb";

export async function POST(request: Request) {
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
    isVisible,
  } = body;

  const stockNum = stock ? parseInt(stock as any, 10) : 0;
  const remaining = stockNum;
  const inStockFlag = remaining > 0;
  const dmcValue = dmc ? parseFloat(dmc) : 0;

  const mongoClient = new MongoClient(process.env.DATABASE_URL!);
  await mongoClient.connect();

  try {
    const db = mongoClient.db("ecommerce-nextjs-app");
    const now = new Date();
    
    const productDoc = {
      _id: new ObjectId(),
      name,
      description,
      brand,
      category,
      inStock: inStockFlag,
      stock: stockNum,
      remainingStock: remaining,
      isVisible: isVisible !== undefined ? isVisible : true,
      images,
      price: parseFloat(price),
      dmc: dmcValue,
      list: parseFloat(list),
      reviews: [],
      createdAt: now,
      updatedAt: now,
    };

    await db.collection("Product").insertOne(productDoc);

    return NextResponse.json({
      ...productDoc,
      id: productDoc._id.toString(),
    });
  } finally {
    await mongoClient.close();
  }
}

export async function PUT(request: Request) {
  const currentUser = await getCurrentUser();

  if (!currentUser) return NextResponse.error();

  if (currentUser.role !== "ADMIN") {
    return NextResponse.error();
  }
  
  const body = await request.json();
  const { id, inStock, isVisible } = body;

  const updateData: any = {};
  if (inStock !== undefined) updateData.inStock = inStock;
  if (isVisible !== undefined) updateData.isVisible = isVisible;

  // Use native MongoDB driver
  const { MongoClient, ObjectId } = await import("mongodb");
  const mongoClient = new MongoClient(process.env.DATABASE_URL!);
  await mongoClient.connect();

  try {
    const db = mongoClient.db("ecommerce-nextjs-app");
    
    const result = await db.collection("Product").findOneAndUpdate(
      { _id: new ObjectId(id) },
      {
        $set: {
          ...updateData,
          updatedAt: new Date(),
        },
      },
      { returnDocument: "after" }
    );

    if (!result) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(result);
  } finally {
    await mongoClient.close();
  }
}
