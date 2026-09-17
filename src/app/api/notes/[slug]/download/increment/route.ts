import { handler } from "@/helpers/api-handler";
import { NextResponse } from "next/server";
import { AppError } from "@/helpers/errors";
import { prisma } from "@/helpers/db";

export const POST = handler<{ slug: string }>(async (ctx) => {
  const { slug } = ctx.params;
  const note = await prisma.note.findFirst({ where: { slug } });
  if (!note) throw AppError.notFound("Note");
  await prisma.note.update({ where: { id: note.id }, data: { downloadCount: { increment: 1 } } });
  return NextResponse.json({ ok: true });
});
