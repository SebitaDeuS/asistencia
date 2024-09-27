import { Component } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {

  public pageTitle: string = 'Principal';
  constructor(private router: Router, private activatedRoute: ActivatedRoute) {

    // Escuchar cambios en la ruta
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.setPageTitle();
      });
    
  }
  isLoginPage(): boolean {
    return this.router.url === '/login';
  }

  private setPageTitle() {
    const route = this.activatedRoute.firstChild;
    if (route?.snapshot.data['title']) {
      this.pageTitle = route.snapshot.data['title'];
    }

  }

  

}

