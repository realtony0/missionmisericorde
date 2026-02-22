import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { v2 as cloudinary, type UploadApiResponse } from "cloudinary";
import { authOptions } from "@/lib/auth";

export const runtime = "nodejs";

function cloudinaryConfigured() {
  return Boolean(
    process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET
  );
}

function configureCloudinary() {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });
}

async function uploadBuffer(
  buffer: Buffer,
  options: { folder: string; resourceType: "image" | "video" | "raw" }
) {
  return new Promise<UploadApiResponse>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: options.folder,
        resource_type: options.resourceType,
      },
      (error, result) => {
        if (error || !result) {
          reject(error ?? new Error("Upload Cloudinary échoué."));
          return;
        }
        resolve(result);
      }
    );

    stream.end(buffer);
  });
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  if (!cloudinaryConfigured()) {
    return NextResponse.json(
      {
        error:
          "Cloudinary non configuré. Renseignez CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY et CLOUDINARY_API_SECRET.",
      },
      { status: 500 }
    );
  }

  configureCloudinary();

  const formData = await req.formData();
  const file = formData.get("file");
  const folderRaw = formData.get("folder");
  const requestedType = formData.get("resourceType");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Aucun fichier reçu." }, { status: 400 });
  }

  const folder =
    typeof folderRaw === "string" && folderRaw.trim()
      ? folderRaw.trim()
      : "mission-misericorde";
  const resourceType: "image" | "video" | "raw" =
    requestedType === "video" ? "video" : requestedType === "raw" ? "raw" : "image";

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  try {
    const uploaded = await uploadBuffer(buffer, { folder, resourceType });
    return NextResponse.json({
      url: uploaded.secure_url,
      publicId: uploaded.public_id,
      resourceType: uploaded.resource_type,
      bytes: uploaded.bytes,
    });
  } catch (error) {
    console.error("Cloudinary upload error", error);
    return NextResponse.json(
      { error: "Impossible d’envoyer le fichier vers Cloudinary." },
      { status: 500 }
    );
  }
}
