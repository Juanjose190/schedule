import { Button } from "@/components/ui/button";
import { GraduationCap } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <section className="min-h-screen bg-gradient-to-b from-background to-muted">
      <section className="container mx-auto px-4 py-16">
        <article className="text-center space-y-6 max-w-3xl mx-auto">
          <GraduationCap className="w-16 h-16 mx-auto text-primary" />
          <h1 className="text-4xl font-bold tracking-tight">School Schedule System</h1>
          <p className="text-lg text-muted-foreground">
            Efficient and automated school schedule management for educational institutions
          </p>
          <section className="flex gap-4 justify-center">
            <Link href="/login">
              <Button size="lg">Login</Button>
            </Link>
          </section>
        </article>
      </section>
    </section>
  );
}