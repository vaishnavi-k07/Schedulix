# Schedulix Frontend - Feature Documentation

## Architecture Overview

### Module-Based Structure
```
static/
├── script.js (entry point)
├── style.css (styling)
└── js/
    ├── app.js (application core)
    ├── api.js (API client with CSRF)
    ├── router.js (hash-based routing)
    ├── modules/
    │   ├── dashboard.js
    │   ├── subjects.js
    │   ├── teachers.js
    │   ├── classrooms.js
    │   ├── timeslots.js
    │   └── timetable.js
    ├── components/
    │   ├── modal.js
    │   ├── notification.js
    │   └── forms.js
    └── utils/
        ├── helpers.js
        └── validation.js
```

## Core Features

### 1. Hash-Based Routing ✓
- Routes: #/dashboard, #/subjects, #/teachers, #/classrooms, #/timeslots, #/timetable
- Active link highlighting
- Browser history support
- 404 handling

### 2. State Management ✓
- Global app state for subjects, teachers, classrooms, timeslots
- Real-time data synchronization
- Automatic re-rendering on data changes

### 3. API Integration ✓
- CSRF token management
- Error handling with proper status codes
- Request/response interceptors
- RESTful endpoints for all entities

### 4. Dashboard Module ✓
**Features:**
- Statistics cards (subjects, teachers, classrooms, timeslots)
- System status indicators
- Quick start guide
- System readiness check
- Quick action buttons

### 5. Subjects Module ✓
**Features:**
- List all subjects in table
- Search by code or name
- Add new subject (modal form)
- Edit subject
- Delete with confirmation
- Form validation
- Real-time updates

**Fields:**
- Code, Name, Type (Theory/Practical), Credits

### 6. Teachers Module ✓
**Features:**
- List all teachers with details
- Search by name or email
- Add new teacher (modal form)
- Edit teacher
- Delete with confirmation
- Subject assignment (multi-select)
- Available time configuration
- Email validation
- Time validation

**Fields:**
- Name, Email, Start Time, End Time
- Lectures per Day, Max Continuous Lectures
- Assigned Subjects

### 7. Classrooms Module ✓
**Features:**
- List all classrooms in table
- Search by room number
- Filter by wing (A, B, C, D)
- Filter by type (Theory, Practical, Both)
- Add new classroom (modal form)
- Edit classroom
- Delete with confirmation
- Capacity validation

**Fields:**
- Room Number, Wing, Capacity, Type

### 8. Timeslots Module ✓
**Features:**
- Display slots organized by day
- Add lecture slot
- Add break slot (short/long)
- Delete slot
- Filter by day
- Time conflict detection
- Visual distinction for breaks vs lectures

**Fields:**
- Day, Start Time, End Time, Is Break, Break Type

### 9. Timetable Module ✓
**Features:**
- Pre-generation validation
- Generate timetable with custom name
- Display validation errors
- List all generated timetables
- View timetable grid
- Delete timetable
- Export to PDF
- Print timetable
- Timetable grid with:
  - Days (Monday-Saturday)
  - Time slots
  - Subject, Teacher, Classroom
  - Break indicators

## UI Components

### Modal Component ✓
- Generic modal with configurable size
- Title and close button
- Click outside to close
- ESC key to close
- Smooth animations

### Notification System ✓
- Toast notifications (top-right)
- Types: success, error, warning, info
- Auto-dismiss after 4 seconds
- Manual dismiss button
- Stacked notifications
- Smooth slide-in animation

### Form Components ✓
- Dynamic form field generation
- Field types: text, email, number, select, textarea, checkbox-group, time-range
- Form validation
- Loading states
- Error display
- Form data extraction

## Validation

### Client-Side Validation ✓
- Email format validation
- Time range validation (start < end)
- Required field validation
- Number range validation
- Custom validation rules
- Form-level validation
- Visual error feedback

### Pre-Generation Validation ✓
- Check subjects exist
- Check teachers exist
- Check classrooms exist
- Check time slots exist (minimum 5)
- Check teacher-subject assignments
- Display user-friendly error messages

## Error Handling

### API Errors ✓
- 401: Redirect to login
- 403: Permission denied message
- 404: Not found message
- 500: Server error message
- Network errors: Connection error
- Detailed error messages from backend

### User Feedback ✓
- Loading spinners
- Disabled buttons during operations
- Clear error messages
- Success confirmations
- Validation highlighting

## Performance Optimizations

### Caching ✓
- In-memory state cache
- Invalidate on mutations
- Lazy data loading

### DOM ✓
- Event delegation
- Minimal DOM manipulations
- Efficient re-rendering

### Network ✓
- Batch API calls with Promise.all
- Single data load on init
- Optimistic UI updates

## Accessibility

### Features ✓
- Keyboard navigation (Tab, Enter, ESC)
- Focus management in modals
- Semantic HTML structure
- Clear labels and associations
- Screen reader friendly

## Responsive Design

### Mobile ✓
- Hamburger menu button (fixed bottom-right)
- Sidebar slide-out menu
- Touch-friendly buttons
- Responsive tables (horizontal scroll)
- Full-screen modals on mobile
- Adaptive layouts

### Tablet ✓
- Optimized navigation
- Adjusted spacing
- Grid layouts

### Desktop ✓
- Full sidebar visible
- Wide tables
- Multi-column layouts

## Browser Support
- Modern browsers with ES6 module support
- Chrome, Firefox, Safari, Edge (latest)

## Code Quality
- Modular ES6 code
- Clear separation of concerns
- DRY principles
- Consistent naming conventions
- Error boundaries
- Comprehensive error handling

## Security
- CSRF token protection
- Input sanitization (escapeHtml)
- XSS prevention
- Secure API communication

## Testing Checklist

### Dashboard
- [ ] Statistics display correctly
- [ ] System status shows proper validation
- [ ] Quick actions work
- [ ] Navigation links work

### Subjects
- [ ] List subjects
- [ ] Search subjects
- [ ] Add subject
- [ ] Edit subject
- [ ] Delete subject
- [ ] Form validation

### Teachers
- [ ] List teachers
- [ ] Search teachers
- [ ] Add teacher with subject assignment
- [ ] Edit teacher
- [ ] Delete teacher
- [ ] Email validation
- [ ] Time validation

### Classrooms
- [ ] List classrooms
- [ ] Filter by wing
- [ ] Filter by type
- [ ] Add classroom
- [ ] Edit classroom
- [ ] Delete classroom

### Timeslots
- [ ] List slots by day
- [ ] Add lecture slot
- [ ] Add break slot
- [ ] Delete slot
- [ ] Conflict detection

### Timetable
- [ ] Pre-generation validation
- [ ] Generate timetable
- [ ] View timetable grid
- [ ] List all timetables
- [ ] Delete timetable
- [ ] Export/Print

### UI/UX
- [ ] Modals open and close
- [ ] Notifications appear and dismiss
- [ ] Forms validate
- [ ] Loading states show
- [ ] Mobile menu works
- [ ] Responsive layouts
- [ ] Keyboard navigation
- [ ] Error handling

## API Endpoints Used

- GET /api/subjects/
- POST /api/subjects/
- PUT /api/subjects/:id/
- DELETE /api/subjects/:id/

- GET /api/teachers/
- POST /api/teachers/
- PUT /api/teachers/:id/
- DELETE /api/teachers/:id/

- GET /api/classrooms/
- POST /api/classrooms/
- PUT /api/classrooms/:id/
- DELETE /api/classrooms/:id/

- GET /api/timeslots/
- POST /api/timeslots/
- PUT /api/timeslots/:id/
- DELETE /api/timeslots/:id/

- GET /api/timetables/
- POST /api/timetables/generate/
- GET /api/timetables/:id/
- GET /api/timetables/:id/entries/
- DELETE /api/timetables/:id/
