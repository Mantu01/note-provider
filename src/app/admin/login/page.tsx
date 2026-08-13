"use client";

import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/brand/logo";
import { useAdminLogin } from "@/features/admin/api/use-admin";

export default function AdminLoginPage() {
  const form = useForm<{ email: string; password: string }>({ defaultValues: { email: "", password: "" } });
  const login = useAdminLogin();
  const router = useRouter();
  return <main className="grid min-h-screen place-items-center px-4"><Card className="w-full max-w-md rounded-3xl"><CardContent className="space-y-6"><Logo href={null} size="lg" /><div><h1 className="text-2xl font-bold">Admin sign in</h1><p className="mt-1 text-sm text-muted-foreground">Use your administrator credentials to continue.</p></div><form className="space-y-4" onSubmit={form.handleSubmit((values) => login.mutate(values, { onSuccess: (admin) => { toast.success(`Welcome back, ${admin.name}`); router.push("/admin"); } }))}><div className="space-y-2"><Label htmlFor="email">Email</Label><Input id="email" type="email" {...form.register("email", { required: true })} /></div><div className="space-y-2"><Label htmlFor="password">Password</Label><Input id="password" type="password" {...form.register("password", { required: true })} /></div><Button type="submit" className="w-full" disabled={login.isPending}>{login.isPending ? "Signing in…" : "Sign in"}</Button></form></CardContent></Card></main>;
}
