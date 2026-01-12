"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import bannerImage from "../../Gemini_Generated_Image_kf4vfykf4vfykf4v (1).jpeg";

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const token = useMemo(() => searchParams.get("token") ?? "", [searchParams]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    const password = String(formData.get("password"));
    const confirm = String(formData.get("confirm"));

    if (!token) {
      setError("Gecersiz baglanti.");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("Parola en az 6 karakter olmali.");
      setLoading(false);
      return;
    }

    if (password !== confirm) {
      setError("Parolalar eslesmiyor.");
      setLoading(false);
      return;
    }

    const response = await fetch("/api/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, password })
    });

    setLoading(false);

    if (!response.ok) {
      const data = await response.json();
      setError(data.error ?? "Bir hata olustu.");
      return;
    }

    setSuccess(true);
  }

  return (
    <div className="max-w-md space-y-6">
      <div className="flex items-center gap-3">
        <img src="/logo-mark.svg" alt="Campus Loop logo mark" className="h-9 w-9" />
        <div>
          <h1 className="text-2xl font-semibold">Yeni parola belirle</h1>
          <p className="text-sm text-ink/70">Guclu bir parola sec ve sifreyi guncelle.</p>
        </div>
      </div>
      <Image
        src={bannerImage}
        alt="Campus Loop banner"
        className="w-full max-w-md rounded-3xl border border-black/10 shadow-sm"
        priority
      />
      <form onSubmit={handleSubmit} className="space-y-4 card">
        <div className="space-y-2">
          <label className="label" htmlFor="password">
            Yeni parola
          </label>
          <input className="input" id="password" name="password" type="password" required />
        </div>
        <div className="space-y-2">
          <label className="label" htmlFor="confirm">
            Yeni parolayi tekrar
          </label>
          <input className="input" id="confirm" name="confirm" type="password" required />
        </div>
        {error ? <p className="text-sm text-red-600">{error}</p> : null}
        {success ? (
          <p className="text-sm text-green-600">
            Parolan guncellendi. <Link href="/login">Login</Link>
          </p>
        ) : null}
        <button className="btn w-full" type="submit" disabled={loading}>
          {loading ? "Guncelleniyor..." : "Parolayi guncelle"}
        </button>
      </form>
    </div>
  );
}
