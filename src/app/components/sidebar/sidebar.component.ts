import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

/**
 * SidebarComponent - Navigation sidebar with clean, modern design
 *
 * Features:
 * - Angular logo branding
 * - Active route highlighting
 * - Material icons
 * - Responsive design
 */
@Component({
  selector: 'app-sidebar',
  imports: [CommonModule, RouterLink, RouterLinkActive, MatIconModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
  protected readonly appName = 'Event Planner';

  // Navigation items
  protected navItems = [
    {
      label: 'Event List',
      route: '/events',
      icon: 'list',
      active: true
    },
    {
      label: 'Calendar',
      route: '/calendar',
      icon: 'calendar_month',
      active: false
    },
    {
      label: 'Add Event',
      route: '/events/new',
      icon: 'add',
      active: false
    }
  ];
}
