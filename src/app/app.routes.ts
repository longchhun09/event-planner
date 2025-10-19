import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/events',
    pathMatch: 'full'
  },
  {
    path: 'events',
    loadComponent: () => import('./pages/event-list/event-list.component').then(m => m.EventListComponent)
  },
  {
    path: 'calendar',
    loadComponent: () => import('./pages/calendar-view/calendar-view.component').then(m => m.CalendarViewComponent)
  },
  {
    path: 'events/new',
    loadComponent: () => import('./pages/add-event/add-event.component').then(m => m.AddEventComponent)
  },
  {
    path: 'events/:id/edit',
    loadComponent: () => import('./pages/edit-event/edit-event.component').then(m => m.EditEventComponent)
  },
  {
    path: '**',
    redirectTo: '/events'
  }
];
