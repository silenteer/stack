import { createTRPCReact } from '@trpc/react-query';
import type { AppRouter } from '@sample/backend';

export const client = createTRPCReact<AppRouter>();