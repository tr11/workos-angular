import { InjectionToken } from '@angular/core';
import { AuthKitParameters } from './interfaces';

export const WORKOS_AUTHKIT_CLIENT_PARAMETERS =
  new InjectionToken<AuthKitParameters>(
    'Client creation parameters. ClientID is required.'
  );
