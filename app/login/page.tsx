"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { useState } from "react";

const DEFAULT_CREDENTIALS = {
  admin: {
    email: "admin@school.com",
    password: "admin123"
  },
  teacher: {
    email: "teacher@school.com",
    password: "teacher123"
  }
};

export default function LoginPage() {
  const router = useRouter();
  const [role, setRole] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const credentials = role === "admin" ? DEFAULT_CREDENTIALS.admin : DEFAULT_CREDENTIALS.teacher;

    if (email === credentials.email && password === credentials.password) {
      if (role === "admin") {
        router.push("/admin/dashboard");
      } else {
        router.push("/teacher/dashboard");
      }
    } else {
      setError("Invalid credentials");
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Login</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <section className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@example.com"
                required
              />
            </section>
            <section className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </section>
            <section className="space-y-2">
              <Label>Role</Label>
              <section className="flex gap-4">
                <Button
                  type="button"
                  variant={role === "admin" ? "default" : "outline"}
                  onClick={() => setRole("admin")}
                  className="flex-1"
                >
                  Administrator
                </Button>
                <Button
                  type="button"
                  variant={role === "teacher" ? "default" : "outline"}
                  onClick={() => setRole("teacher")}
                  className="flex-1"
                >
                  Teacher
                </Button>
              </section>
            </section>
            {error && (
              <p className="text-sm text-destructive text-center">{error}</p>
            )}
            <Button type="submit" className="w-full">
              Login
            </Button>
          </form>
          <section className="mt-4 text-sm text-muted-foreground">
            <p className="text-center font-semibold">Default Credentials</p>
            <section className="mt-2 space-y-2">
              <article className="p-2 bg-secondary rounded">
                <p><strong>Admin:</strong> admin@school.com / admin123</p>
              </article>
              <article className="p-2 bg-secondary rounded">
                <p><strong>Teacher:</strong> teacher@school.com / teacher123</p>
              </article>
            </section>
          </section>
        </CardContent>
      </Card>
    </section>
  );
}