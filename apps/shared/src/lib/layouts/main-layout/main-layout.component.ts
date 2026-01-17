import { Component, inject, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router, NavigationEnd, Event as RouterEvent } from '@angular/router';
import { TopMenuComponent } from '../top-menu/top-menu.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { FooterComponent } from '../footer/footer.component';
import { LayoutService } from '../../core/services/layout.service';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, TopMenuComponent, SidebarComponent, FooterComponent],
  templateUrl: './main-layout.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainLayoutComponent implements OnInit {
  public layout = inject(LayoutService);
  private router = inject(Router);

  ngOnInit(): void {
    // Using a filter makes the type narrowing explicit for the compiler
    this.router.events.pipe(
      filter((event: RouterEvent): event is NavigationEnd => event instanceof NavigationEnd)
    ).subscribe(() => {
      if (typeof window !== 'undefined') {
        window.scrollTo(0, 0);
      }
    });
  }
}
