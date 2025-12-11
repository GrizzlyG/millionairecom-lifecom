import { NextRequest, NextResponse } from "next/server";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import firebaseApp from "@/libs/firebase";

// POST - Upload image to Firebase Storage
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const color = formData.get("color") as string;

    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      );
    }

    // Convert File to Buffer
    const bytes = await file.arrayBuffer();
    const uint8Array = new Uint8Array(bytes);

    // Upload to Firebase Storage
    const fileName = `${Date.now()}-${file.name}`;
    const storage = getStorage(firebaseApp);
    const storageRef = ref(storage, `products/${fileName}`);
    
    // Upload file
    await uploadBytesResumable(storageRef, uint8Array, {
      contentType: file.type,
    });

    // Get download URL
    const downloadURL = await getDownloadURL(storageRef);

    return NextResponse.json({
      url: downloadURL,
      color: color || "",
    });
  } catch (error: any) {
    console.error("Error uploading file:", error);
    return NextResponse.json(
      { error: error.message || "Upload failed" },
      { status: 500 }
    );
  }
}

// DELETE - Delete image from Firebase Storage
export async function DELETE(request: NextRequest) {
  try {
    const { url } = await request.json();

    if (!url) {
      return NextResponse.json(
        { error: "No URL provided" },
        { status: 400 }
      );
    }

    const storage = getStorage(firebaseApp);
    const imageRef = ref(storage, url);
    await deleteObject(imageRef);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error deleting file:", error);
    return NextResponse.json(
      { error: error.message || "Delete failed" },
      { status: 500 }
    );
  }
}
