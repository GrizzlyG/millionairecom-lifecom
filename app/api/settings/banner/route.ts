import { MongoClient } from "mongodb";
import { NextResponse } from "next/server";
import getCurrentUser from "@/actions/get-current-user";

const MONGO_URI = process.env.DATABASE_URL?.replace("?replicaSet=rs0", "") || "mongodb://localhost:27017/ecommerce-nextjs-app";

export async function PUT(request: Request) {
  const currentUser = await getCurrentUser();

  if (!currentUser || currentUser.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { bannerTitle, bannerSubtitle, bannerDiscount, bannerImage, bannerColors } = body;

  if (!bannerTitle || !bannerSubtitle || !bannerDiscount) {
    return NextResponse.json({ error: "All banner fields are required" }, { status: 400 });
  }

  const mongoClient = new MongoClient(MONGO_URI);
  await mongoClient.connect();
  const db = mongoClient.db("ecommerce-nextjs-app");

  try {
    const updateData: any = {
      bannerTitle,
      bannerSubtitle,
      bannerDiscount,
      updatedAt: new Date()
    };

    if (bannerImage) {
      updateData.bannerImage = bannerImage;
    }

    if (bannerColors && Array.isArray(bannerColors)) {
      updateData.bannerColors = bannerColors;
    }

    await db.collection("Settings").updateOne(
      { _id: "settings" } as any,
      { $set: updateData },
      { upsert: true }
    );

    await mongoClient.close();

    return NextResponse.json({ success: true });
  } catch (error) {
    await mongoClient.close();
    console.error("Update banner error:", error);
    return NextResponse.json({ error: "Failed to update banner" }, { status: 500 });
  }
}
