import { NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  university: z.string().optional().nullable()
});

export async function POST(request: Request) {
  const body = await request.json();
  const result = registerSchema.safeParse(body);

  if (!result.success) {
    return NextResponse.json({ error: "Gecersiz alanlar." }, { status: 400 });
  }

  const { name, password, university } = result.data;
  const email = result.data.email.toLowerCase().trim();

  if (!email.endsWith(".edu.tr")) {
    return NextResponse.json({ error: "Only .edu.tr university emails are allowed" }, { status: 400 });
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json({ error: "Bu email zaten kayitli." }, { status: 400 });
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      passwordHash,
      university: university ?? null
    }
  });

  return NextResponse.json({ id: user.id });
}
