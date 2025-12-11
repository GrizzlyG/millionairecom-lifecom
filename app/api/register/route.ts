import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { createDocument } from "@/libs/mongodb-helpers";

export async function POST(request: Request) {
  const body = await request.json();
  const { name, email, password } = body;

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await createDocument("User", {
    name,
    email,
    hashedPassword,
    role: "USER",
  });

  return NextResponse.json(user);
}
