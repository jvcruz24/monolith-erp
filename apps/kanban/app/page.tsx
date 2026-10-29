'use client';

import { authClient } from '@/src/lib/auth-client';

export default function Home() {
  const { data: session, isPending } = authClient.useSession();

  if (isPending) return <p>Loading…</p>;

  if (!session) {
    return (
      <main>
        <p>Not signed in.</p>
        <a href='http://portal.monolith.test:3000'>Go to sign-in</a>
      </main>
    );
  }

  return (
    <main>
      <h1>Kanban</h1>
      <p>Signed in as {session.user.email}</p>
    </main>
  );
}
