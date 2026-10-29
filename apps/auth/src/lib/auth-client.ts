import { createClient } from '@repo/auth/client';

export const authClient = createClient(process.env.NEXT_PUBLIC_API_URL!);
