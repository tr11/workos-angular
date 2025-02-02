import { computed, Inject, Injectable, signal } from '@angular/core';
import {
  createClient,
  getClaims,
  LoginRequiredError,
  OnRefreshResponse,
  User,
} from '@workos-inc/authkit-js';
import { WORKOS_AUTHKIT_CLIENT_PARAMETERS } from './tokens';
import { AuthKitParameters, Client, State } from './interfaces';

type RedirectOptions = Parameters<Client['signIn']>[0];
type SignInOptionsType = Omit<RedirectOptions, 'type'>;

@Injectable({
  providedIn: 'root',
})
export class AuthKitService {
  /* private state */
  private _client = signal<Client>(NOOP_CLIENT);
  private _state = signal<State>({
    isLoading: true,
    user: null,
    role: null,
    organizationId: null,
    permissions: [],
  });

  /* public signals */
  state = computed(() => this._state());
  client = computed(() => this._client());

  /* constructor */
  constructor(
    @Inject(WORKOS_AUTHKIT_CLIENT_PARAMETERS) private _params: AuthKitParameters
  ) {
    createClient(_params.clientId, {
      ..._params,
      onRefresh: (response: OnRefreshResponse) => {
        /* update state on refresh */
        const { user, accessToken, organizationId } = response;
        const { role = null, permissions = [] } = getClaims(accessToken);

        const prev = this._state();
        const next: State = {
          ...prev,
          user,
          organizationId: organizationId ?? null,
          role,
          permissions,
        };

        if (!isEquivalentWorkOSSession(prev, next)) {
          this._state.set(next);
        }

        this._params.onRefresh?.(response);
      },
    }).then((client) => {
      this._client.set({
        getAccessToken: client.getAccessToken.bind(client),
        getUser: client.getUser.bind(client),
        signIn: client.signIn.bind(client),
        signUp: client.signUp.bind(client),
        signOut: client.signOut.bind(client),
        switchToOrganization: client.switchToOrganization.bind(client),
      });
      const user = client.getUser();
      this._state.update((x) => ({ ...x, isLoading: false, user }));
    });
  }

  /* convenience functions */
  async signIn(opts?: SignInOptionsType): Promise<void> {
    return this._client().signIn(opts);
  }
  async signUp(opts?: SignInOptionsType): Promise<void> {
    return this._client().signUp(opts);
  }
  getUser(): User | null {
    return this._client().getUser();
  }
  async getAccessToken(): Promise<string> {
    return this._client().getAccessToken();
  }
  signOut(options?: { returnTo: string }) {
    return this._client().signOut(options);
  }
}

/* deep equality */
function isEquivalentWorkOSSession(a: State, b: State) {
  return (
    a.user?.updatedAt === b.user?.updatedAt &&
    a.organizationId === b.organizationId &&
    a.role === b.role &&
    a.permissions.every((perm, i) => perm === b.permissions[i])
  );
}

/* state before init */
const NOOP_CLIENT: Client = {
  signIn: async () => {},
  signUp: async () => {},
  getUser: () => null,
  getAccessToken: () => Promise.reject(new LoginRequiredError()),
  switchToOrganization: () => Promise.resolve(),
  signOut: () => {},
};
