import { NextResponse } from "next/server";
import { z } from "zod";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { sendPasswordResetEmail } from "@/lib/email";

const forgotPasswordSchema = z.object({
  email: z.string().email()
});

function hashToken(token: string) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

export async function POST(request: Request) {
  const body = await request.json();
  const result = forgotPasswordSchema.safeParse(body);

  if (!result.success) {
    return NextResponse.json({ error: "Gecersiz alanlar." }, { status: 400 });
  }

  const email = result.data.email.toLowerCase().trim();
  if (!email.endsWith(".edu.tr")) {
    return NextResponse.json({ error: "Sadece .edu.tr uzantili e-postalar kabul edilir." }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return NextResponse.json({ ok: true });
  }

  const rawToken = crypto.randomBytes(32).toString("hex");
  const tokenHash = hashToken(rawToken);
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60);

  await prisma.passwordResetToken.deleteMany({ where: { userId: user.id } });
  await prisma.passwordResetToken.create({
    data: {
      userId: user.id,
      tokenHash,
      expiresAt
    }
  });

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? request.headers.get("origin") ?? "";
  const resetUrl = `${baseUrl}/reset-password?token=${rawToken}`;

  await sendPasswordResetEmail({ to: email, resetUrl });

  return NextResponse.json({ ok: true });
}
