import { User } from '@workos-inc/authkit-js';
import { createClient } from '@workos-inc/authkit-js';

export type Client = Pick<
  Awaited<ReturnType<typeof createClient>>,
  | 'signIn'
  | 'signUp'
  | 'getUser'
  | 'getAccessToken'
  | 'signOut'
  | 'switchToOrganization'
>;

type CreateClientOptions = NonNullable<Parameters<typeof createClient>[1]>;

export interface AuthKitParameters extends CreateClientOptions {
  clientId: string;
}

export interface State {
  isLoading: boolean;
  user: User | null;
  role: string | null;
  organizationId: string | null;
  permissions: string[];
}
