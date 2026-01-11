import { NextResponse } from "next/server";
import { z } from "zod";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

const resetPasswordSchema = z.object({
  token: z.string().min(20),
  password: z.string().min(6)
});

function hashToken(token: string) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

export async function POST(request: Request) {
  const body = await request.json();
  const result = resetPasswordSchema.safeParse(body);

  if (!result.success) {
    return NextResponse.json({ error: "Gecersiz alanlar." }, { status: 400 });
  }

  const tokenHash = hashToken(result.data.token);
  const token = await prisma.passwordResetToken.findUnique({
    where: { tokenHash }
  });

  if (!token || token.usedAt || token.expiresAt < new Date()) {
    return NextResponse.json({ error: "Baglanti gecersiz veya suresi dolmus." }, { status: 400 });
  }

  const passwordHash = await bcrypt.hash(result.data.password, 10);

  await prisma.user.update({
    where: { id: token.userId },
    data: { passwordHash }
  });

  await prisma.passwordResetToken.update({
    where: { id: token.id },
    data: { usedAt: new Date() }
  });

  return NextResponse.json({ ok: true });
}
