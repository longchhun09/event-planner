import {
  trigger,
  state,
  style,
  transition,
  animate,
  query,
  stagger,
  keyframes
} from '@angular/animations';

/**
 * Reusable animations for the application
 * These animations enhance UX with smooth transitions
 */

// Fade in animation for page transitions
export const fadeInAnimation = trigger('fadeIn', [
  transition(':enter', [
    style({ opacity: 0, transform: 'translateY(10px)' }),
    animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
  ])
]);

// Slide in from right
export const slideInRight = trigger('slideInRight', [
  transition(':enter', [
    style({ opacity: 0, transform: 'translateX(50px)' }),
    animate('400ms cubic-bezier(0.35, 0, 0.25, 1)', style({ opacity: 1, transform: 'translateX(0)' }))
  ])
]);

// List stagger animation - animates list items one by one
export const listStagger = trigger('listStagger', [
  transition('* => *', [
    query(':enter', [
      style({ opacity: 0, transform: 'translateY(20px)' }),
      stagger('50ms', [
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ], { optional: true })
  ])
]);

// Card flip animation
export const cardFlip = trigger('cardFlip', [
  transition('* => *', [
    animate('600ms cubic-bezier(0.35, 0, 0.25, 1)', keyframes([
      style({ transform: 'rotateY(0deg)', offset: 0 }),
      style({ transform: 'rotateY(180deg)', offset: 0.5 }),
      style({ transform: 'rotateY(360deg)', offset: 1.0 })
    ]))
  ])
]);

// Slide animation for router transitions
export const slideAnimation = trigger('routeAnimations', [
  transition('* <=> *', [
    query(':enter, :leave', [
      style({
        position: 'absolute',
        width: '100%'
      })
    ], { optional: true }),
    query(':enter', [
      style({ opacity: 0, transform: 'translateX(100%)' })
    ], { optional: true }),
    query(':leave', [
      animate('300ms ease-in', style({ opacity: 0, transform: 'translateX(-100%)' }))
    ], { optional: true }),
    query(':enter', [
      animate('300ms ease-out', style({ opacity: 1, transform: 'translateX(0)' }))
    ], { optional: true })
  ])
]);

// Scale animation for buttons
export const scaleAnimation = trigger('scaleAnimation', [
  state('normal', style({ transform: 'scale(1)' })),
  state('hover', style({ transform: 'scale(1.05)' })),
  transition('normal <=> hover', animate('200ms ease-in-out'))
]);

// Expandable content animation
export const expandCollapse = trigger('expandCollapse', [
  state('collapsed', style({
    height: '0',
    overflow: 'hidden',
    opacity: 0
  })),
  state('expanded', style({
    height: '*',
    overflow: 'visible',
    opacity: 1
  })),
  transition('collapsed <=> expanded', animate('300ms cubic-bezier(0.4, 0.0, 0.2, 1)'))
]);

// Bounce animation
export const bounceAnimation = trigger('bounce', [
  transition(':enter', [
    animate('500ms', keyframes([
      style({ transform: 'translateY(-30px)', offset: 0 }),
      style({ transform: 'translateY(0)', offset: 0.5 }),
      style({ transform: 'translateY(-15px)', offset: 0.75 }),
      style({ transform: 'translateY(0)', offset: 1.0 })
    ]))
  ])
]);

// Shake animation for errors
export const shakeAnimation = trigger('shake', [
  transition('* => shake', [
    animate('500ms', keyframes([
      style({ transform: 'translateX(0)', offset: 0 }),
      style({ transform: 'translateX(-10px)', offset: 0.25 }),
      style({ transform: 'translateX(10px)', offset: 0.5 }),
      style({ transform: 'translateX(-10px)', offset: 0.75 }),
      style({ transform: 'translateX(0)', offset: 1.0 })
    ]))
  ])
]);

