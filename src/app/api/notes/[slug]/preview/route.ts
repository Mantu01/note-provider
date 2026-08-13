import { NextRequest, NextResponse } from "next/server";
import { connectDb } from "@/server/db/connect";
import { Note } from "@/server/db/models/note.model";

export const runtime = "nodejs";

export async function GET(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    await connectDb();
    const resolvedParams = await params;
    const slug = resolvedParams?.slug;
    const { searchParams } = new URL(req.url);
    const mode = searchParams.get("mode");

    if (!slug) {
      return NextResponse.json({ success: false, error: { code: "VALIDATION_ERROR", message: "Missing slug parameter" } }, { status: 400 });
    }

    const note = await Note.findOne({ slug, visibility: "public" }).lean().exec();
    if (!note) {
      return NextResponse.json({ success: false, error: { code: "NOT_FOUND", message: "Note not found" } }, { status: 404 });
    }

    const pdfUrl = note.previewFileUrl || note.fullFileUrl;
    if (!pdfUrl) {
      return NextResponse.json({ success: false, error: { code: "NOT_FOUND", message: "Preview not available for this note" } }, { status: 404 });
    }

    const pdfResponse = await fetch(pdfUrl);
    if (!pdfResponse.ok) {
      return NextResponse.redirect(pdfUrl);
    }

    const buffer = await pdfResponse.arrayBuffer();

    return new Response(buffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": mode === "view" ? "inline" : "inline; filename=\"preview.pdf\"",
        "Content-Length": buffer.byteLength.toString(),
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch (err: any) {
    console.error("[PREVIEW ROUTE ERROR]:", err);
    return NextResponse.json({ success: false, error: { code: "INTERNAL_ERROR", message: "Failed to render preview" } }, { status: 500 });
  }
}
