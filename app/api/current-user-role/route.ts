import { NextResponse } from "next/server";
import getCurrentUser from "@/actions/get-current-user";

export async function GET() {
  try {
    const currentUser = await getCurrentUser();
    
    if (!currentUser) {
      return NextResponse.json({ role: null }, { status: 401 });
    }

    return NextResponse.json({ role: currentUser.role });
  } catch (error) {
    console.error("Error fetching user role:", error);
    return NextResponse.json({ role: null }, { status: 500 });
  }
}
