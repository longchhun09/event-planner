# 📅 Event Planner - Angular Application

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18 or higher
- **npm** v9 or higher

### Installation

1. Navigate to the project directory:
   ```bash
   cd /dev/todo-app-angular
   ```

2. Install dependencies (if not already done):
   ```bash
   npm install
   ```

### Running the Application

Start the development server:

```bash
npm start
```

Then open your browser and navigate to:
```
http://localhost:4200
```

The application will automatically reload when you make changes.

## 🧪 Testing

Run the test suite:

```bash
npm test
```

## 🔨 Building for Production

Build the application for production:

```bash
npm run build
```

The build artifacts will be stored in the `dist/` directory.

## 🗺️ Application Routes

| Route | Component | Description |
|-------|-----------|-------------|
| `/` | Redirect | Redirects to `/events` |
| `/events` | EventListComponent | Main event list view |
| `/calendar` | CalendarViewComponent | Calendar view of events |
| `/events/new` | AddEventComponent | Add new event form |
| `/events/:id/edit` | EditEventComponent | Edit existing event |

## 💡 Usage Guide

### Viewing Events

**List View:**
1. Navigate to "List View" in the navigation bar
2. Events are displayed in a grid of cards
3. Each card shows event details with color-coded categories
4. Past events appear slightly dimmed

**Calendar View:**
1. Navigate to "Calendar" in the navigation bar
2. See events displayed on their respective dates
3. Use arrow buttons to navigate between months
4. Click "Today" to jump to the current month
5. Click on event badges to edit them

### Adding a New Event

1. Click "Add Event" in the navigation bar
2. Fill in the required fields:
   - Event Name (minimum 3 characters)
   - Date (must be today or in the future)
   - Time
   - Location (minimum 3 characters)
   - Category (select from dropdown)
3. Optionally add a description
4. Click "Create Event" to save

### Editing an Event

1. Click the "Edit" button on any event card
2. Modify the desired fields
3. View creation and update timestamps
4. Click "Save Changes" to update

### Deleting an Event

1. Click the "Delete" button on any event card
2. Confirm the deletion in the dialog
3. Event is permanently removed

### Filtering & Searching Events

1. Use the Filter & Search section on the event list page
2. **Search**: Type keywords to search across event details
3. **Category**: Select a category from the dropdown
4. **Date Range**: Select "From" and "To" dates
5. Click "Clear All" to reset filters

## 🎨 Event Categories

The application supports the following event categories, each with a unique color:

- **Conference** - Purple gradient
- **Meetup** - Pink gradient
- **Workshop** - Blue gradient
- **Seminar** - Green gradient
- **Networking** - Rose gradient
- **Social** - Yellow gradient
- **Other** - Gray

## 🔧 Customization

### Changing Category Colors

Edit the `getCategoryColor()` method in:
- `src/app/components/event-card/event-card.component.ts`
- `src/app/pages/calendar-view/calendar-view.component.ts`

### Adding New Categories

1. Update the `EventCategory` enum in `src/app/models/event.model.ts`
2. Add corresponding color in `getCategoryColor()` methods

### Modifying Theme Colors

Edit the CSS variables and gradients in:
- `src/styles.css` - Global styles
- `src/app/app.css` - Navigation and header styles
- Individual component CSS files

## 📊 State Management

The application uses a hybrid approach to state management:

1. **EventService with BehaviorSubject**: 
   - Central source of truth for event data
   - Observable streams for reactive updates
   - All components subscribe to the same data source

2. **Angular Signals**:
   - Component-level reactive state
   - Computed values for derived data
   - Efficient change detection

3. **LocalStorage**:
   - Automatic persistence on every change
   - Data loaded on app initialization
   - Sample data loaded if no saved data exists

## 🎯 Key Features Demonstrated

### Angular Concepts

- ✅ Standalone Components
- ✅ Signals and Computed Values
- ✅ Reactive Forms with Validation
- ✅ Dependency Injection with `inject()`
- ✅ Routing with Lazy Loading
- ✅ Services with BehaviorSubject
- ✅ Observable Streams with RxJS
- ✅ Component Communication
- ✅ Template-driven UI
- ✅ Lifecycle Hooks

### Best Practices

- ✅ Type Safety with TypeScript
- ✅ Separation of Concerns
- ✅ Reusable Components
- ✅ Responsive Design
- ✅ Accessibility Considerations
- ✅ Error Handling
- ✅ Form Validation
- ✅ Clean Code Structure
- ✅ Modern ES6+ Features

## 🚀 Future Enhancements

Potential features for future development:

1. **Backend Integration**
   - REST API integration
   - Database persistence
   - User authentication

2. **Advanced Features**
   - Recurring events
   - Event reminders/notifications
   - Event participants/attendees
   - Event photos/attachments
   - Export to iCal/Google Calendar

3. **UI/UX Improvements**
   - Dark mode
   - Custom themes
   - Drag-and-drop event rescheduling
   - Week/day calendar views
   - Print functionality

4. **Collaboration**
   - Share events with others
   - Public/private events
   - RSVP functionality
   - Comments on events

5. **Mobile App**
   - Progressive Web App (PWA)
   - Native mobile apps
   - Push notifications

## 📄 License

This project is open source and available for educational purposes.

## 🤝 Contributing

Feel free to fork, modify, and use this project as a learning resource or starting point for your own applications!

## 📞 Support

For questions or issues:
- Check the inline code comments
- Review Angular documentation: https://angular.dev
- Explore RxJS documentation: https://rxjs.dev

---

**Built with ❤️ using Angular 20, TypeScript, and RxJS**

**Happy Event Planning! 🎉**
