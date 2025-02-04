# AuthKit Angular Library

## Installation

```bash
npm install workos-authkit-angular
```

or

```bash
yarn add workos-authkit-angular
```

## Setup

Add your site's URL to the list of allowed origins in the WorkOS dashboard by
clicking on the "Configure CORS" button of the "Authentication" page.

## Usage

Set up a provider using:

```ts
...
import { WORKOS_AUTHKIT_CLIENT_PARAMETERS } from 'authkit-angular';
...

export const appConfig: ApplicationConfig = {
  providers: [
    ...
    {
      provide: WORKOS_AUTHKIT_CLIENT_PARAMETERS,
      useValue: {
        clientId: '<CLIENT ID FROM THE WORKOS DASHBOARD>',
        redirectUri: '<REDIRECT URL>',
      },
    },
    ...
  ],
};
```

The Client ID and Redirect URL should match the information from the WorkOS dashboard. In development mode with the standard Angular port, an example of a redirect url is `http://localhost:4200/auth`.

After the provider is set up, the service can be used directly on any component:

```ts
...
import { AuthKitService } from 'authkit-angular';
...

@Component({
   ...
})
export class AppComponent {
  // authkit user
  user = computed(() => this.auth.state().user);

  constructor(private auth: AuthKitService) {}

  async signIn() {
    await this.auth.signIn();
  }

  async signOut() {
    this.auth.signOut();
  }

  async getAccessToken(): Promise<string> {
    return await this.auth.getAccessToken();
  }
}
```

On a successful login, AuthKit redirects to a pre-defined url. Use the following to handle that redirect automatically and (optionally) redirect to an internal route:

```ts
import { Routes } from '@angular/router';
import { AuthKitComponent } from 'authkit-angular';

export const routes: Routes = [
  ...
  {
    path: 'auth',
    component: AuthKitComponent,
    data: { redirectTo: '/' },
  },
  ...
];
```

Note that the `auth` route needs to match one of the allowed redirect urls.

## Reference

### Provider

Your app needs to configure the provider with at least the Client ID. Other valid fields can be found in the [authkit-js](https://github.com/workos/authkit-js) library (see the `CreateClientOptions` [interface](https://github.com/workos/authkit-js/blob/main/src/interfaces/create-client-options.interface.ts). For example:

- `clientId` (required): Your `WORKOS_CLIENT_ID`
- `apiHostname`: Defaults to `api.workos.com`. This should be set to your custom Authentication API domain in production.
- `redirectUri`: The url that WorkOS will redirect to upon successful authentication. (Used when constructing sign-in/sign-up URLs).
- `devMode`: Defaults to `true` if window.location is "localhost" or "127.0.0.1". Tokens will be stored in localStorage when this prop is true.
- `onRedirectCallback`: Called after exchanging the
  `authorization_code`. Can be used for things like redirecting to a "return
  to" path in the OAuth state.

### AuthKitService

The `AuthKitService` service returns user information and helper functions:

- `isLoading`: true while user information is being obtained from fetch during initial load.
- `user`: The WorkOS `User` object for this session.
- `getAccessToken`: Returns an access token. Will fetch a fresh access token if necessary.
- `signIn`: Redirects the user to the Hosted AuthKit sign-in page. Takes an optional `state` argument.
- `signUp`: Redirects the user to the Hosted AuthKit sign-up page. Takes an optional `state` argument.
- `signOut`: Ends the session.
- `switchToOrganization`: Switches to the given organization. Redirects to the hosted login page if switch is unsuccessful.

The following claims may be populated if the user is part of an organization:

- `organizationId`: The currently-selected organization.
- `role`: The `role` of the user for the current organization.
- `permissions`: Permissions corresponding to this role.
