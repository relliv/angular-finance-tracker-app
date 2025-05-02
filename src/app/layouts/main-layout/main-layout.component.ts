import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { User } from '../../models/user.model';
import { AuthService } from '../../core/auth/auth.service';
import { HeaderComponent } from './header/header.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { MobileNavComponent } from './mobile-nav/mobile-nav.component';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    HeaderComponent,
    SidebarComponent,
    MobileNavComponent
  ],
  template: `
    <div class="app-container" [class.sidebar-expanded]="sidebarExpanded">
      <app-header 
        [user]="currentUser" 
        (toggleSidebar)="toggleSidebar()"
      ></app-header>
      
      <div class="content-container">
        <app-sidebar 
          [expanded]="sidebarExpanded"
          [user]="currentUser"
          (toggleExpanded)="toggleSidebar()"
        ></app-sidebar>
        
        <main class="main-content">
          <router-outlet></router-outlet>
        </main>
      </div>
      
      <app-mobile-nav></app-mobile-nav>
    </div>
  `,
  styles: [`
    .app-container {
      display: flex;
      flex-direction: column;
      height: 100vh;
    }
    
    .content-container {
      display: flex;
      flex: 1;
      overflow: hidden;
    }
    
    .main-content {
      flex: 1;
      padding: var(--spacing-lg);
      overflow-y: auto;
      background-color: var(--neutral-light);
    }
    
    @media (max-width: 768px) {
      .content-container {
        flex-direction: column;
      }
      
      .main-content {
        padding: var(--spacing-md);
        padding-bottom: 72px; /* Space for mobile navigation */
      }
    }
  `]
})
export class MainLayoutComponent implements OnInit {
  currentUser: User | null = null;
  sidebarExpanded = true;
  
  constructor(private authService: AuthService) {}
  
  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
    
    // Collapse sidebar on mobile by default
    this.checkScreenSize();
    window.addEventListener('resize', () => this.checkScreenSize());
  }
  
  toggleSidebar(): void {
    this.sidebarExpanded = !this.sidebarExpanded;
  }
  
  private checkScreenSize(): void {
    if (window.innerWidth <= 768) {
      this.sidebarExpanded = false;
    } else {
      this.sidebarExpanded = true;
    }
  }
}