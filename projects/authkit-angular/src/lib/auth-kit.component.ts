import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthKitService } from './authkit.service';

@Component({
  imports: [],
  template: '',
})
export class AuthKitComponent implements OnInit {
  constructor(
    private auth: AuthKitService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    const queryParams = new URLSearchParams(
      this.route.snapshot.queryParams
    ).toString();

    this.route.data.subscribe((d) => {
      const redirectTo = d['redirectTo'];

      this.auth
        .client()
        .signIn({ context: queryParams })
        .then(() => {
          if (redirectTo) this.router.navigateByUrl(redirectTo);
        });
    });
  }
}
