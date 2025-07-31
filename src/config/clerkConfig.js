import dotenv from 'dotenv';
import { ClerkExpressWithAuth, clerkClient } from '@clerk/clerk-sdk-node';

dotenv.config();

export { ClerkExpressWithAuth, clerkClient };
