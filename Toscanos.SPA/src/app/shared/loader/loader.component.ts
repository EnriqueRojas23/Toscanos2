import { Component, Input } from '@angular/core';
import { Router, NavigationStart, NavigationEnd } from '@angular/router';
import { filter, map } from 'rxjs/operators';

@Component({
  selector: 'app-progress-bar',
  template: `
  <p-progressBar mode="{{ mode$ | async }}"></p-progressBar>
  `,
  styles: [`
    :host ::ng-deep .ui-progressbar {
        height: 4px;
        background: #c5c5c5;
    }`, `
    :host ::ng-deep .ui-widget-header {
        border: none;
    }`, `
    :host ::ng-deep .ui-widget-content {
        border: none;
    }`, `
    :host ::ng-deep .ui-corner-all {
        border-radius: 0;
    }
    `
  ]
})
export class loaderComponent { 
    mode$ = this.router.events.pipe(
        filter(evt => evt instanceof NavigationStart || evt instanceof NavigationEnd),
        map(evt => evt instanceof NavigationStart ? 'indeterminate' : '')
    );

    constructor(private router: Router) { }
}