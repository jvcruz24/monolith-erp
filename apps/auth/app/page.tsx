"use client";

import { useState, type FormEvent } from "react";
import { authClient } from "@/src/lib/auth-client";

export default function Home() {
  const { data: session, isPending } = authClient.useSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    const { error } = await authClient.signIn.email({ email, password });
    if (error) setError(error.message ?? "Sign-in failed");
  }

  if (isPending) return <p>Loading…</p>;

  if (session) {
    return (
      <main>
        <p>Signed in as {session.user.email}</p>
        <button onClick={() => authClient.signOut()}>Sign out</button>
        <p>
          <a href="http://kanban.monolith.test:3001">Open kanban</a>
        </p>
      </main>
    );
  }

  return (
    <main>
      <form onSubmit={onSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Sign in</button>
        {error && <p>{error}</p>}
      </form>
    </main>
  );
}
