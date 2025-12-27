# Schedulix Frontend - Developer Guide

## Overview
The Schedulix frontend is a modern Single Page Application (SPA) built with vanilla JavaScript ES6 modules, following best practices for maintainability and scalability.

## Quick Start

### Running the Application
```bash
python manage.py runserver
```
Then navigate to http://localhost:8000/

## Architecture

### Technology Stack
- **JavaScript**: ES6 Modules (no build step required)
- **CSS**: Tailwind CSS (CDN) + Custom styles
- **Routing**: Hash-based client-side routing
- **State Management**: In-memory reactive state
- **API**: REST API with Django REST Framework

### File Structure
```
static/
├── script.js              # Entry point
├── style.css              # Custom CSS
└── js/
    ├── app.js            # App initialization & core logic
    ├── api.js            # API client with CSRF handling
    ├── router.js         # Client-side hash router
    ├── modules/          # Feature modules
    │   ├── dashboard.js
    │   ├── subjects.js
    │   ├── teachers.js
    │   ├── classrooms.js
    │   ├── timeslots.js
    │   └── timetable.js
    ├── components/       # Reusable UI components
    │   ├── modal.js
    │   ├── notification.js
    │   └── forms.js
    └── utils/           # Utility functions
        ├── helpers.js
        └── validation.js
```

## Key Concepts

### 1. Module Pattern
Each feature is encapsulated in its own module class:
```javascript
export class SubjectsModule {
    constructor(appState) {
        this.appState = appState;
    }
    
    async render() {
        // Render logic
    }
}
```

### 2. State Management
The app maintains a global state object:
```javascript
this.state = {
    subjects: [],
    teachers: [],
    classrooms: [],
    timeslots: [],
    timetables: []
};
```

State updates trigger automatic re-rendering.

### 3. Routing
Hash-based routing without page reloads:
```javascript
this.router.register('/dashboard', () => this.modules.dashboard.render());
```

### 4. API Layer
Centralized API client with error handling:
```javascript
import { api } from './api.js';

const subjects = await api.subjects.list();
await api.subjects.create(data);
```

### 5. Component System
Reusable UI components:
```javascript
import { openModal } from './components/modal.js';
import { showNotification } from './components/notification.js';

openModal(content, { title: 'Add Subject', size: 'md' });
showNotification('Success!', 'success');
```

## Development Guidelines

### Adding a New Module

1. Create module file in `static/js/modules/`:
```javascript
import { api } from '../api.js';
import { showNotification } from '../components/notification.js';

export class MyModule {
    constructor(appState) {
        this.appState = appState;
    }
    
    async render() {
        const main = document.getElementById('mainContent');
        main.innerHTML = `<!-- Your HTML -->`;
    }
}
```

2. Register in `app.js`:
```javascript
import { MyModule } from './modules/mymodule.js';

this.modules.mymodule = new MyModule(this.state);
this.router.register('/myroute', () => this.modules.mymodule.render());
```

3. Add navigation link in template.

### Creating Forms

Use the form component system:
```javascript
import { createForm, getFormData } from '../components/forms.js';

const fields = [
    {
        type: 'text',
        name: 'name',
        label: 'Name',
        required: true
    },
    {
        type: 'select',
        name: 'type',
        label: 'Type',
        options: [
            { value: 'A', label: 'Option A' },
            { value: 'B', label: 'Option B' }
        ]
    }
];

const formHTML = createForm(fields, {
    submitLabel: 'Save',
    cancelLabel: 'Cancel'
});
```

### Handling API Calls

Always use try-catch and show notifications:
```javascript
try {
    const data = await api.subjects.create(formData);
    showNotification('Created successfully!', 'success');
    await window.app.loadAllData();
} catch (error) {
    console.error('Error:', error);
    showNotification(error.message || 'Error occurred', 'error');
}
```

### Form Validation

Use validation utilities:
```javascript
import { validateEmail, validateTime } from '../utils/validation.js';

if (!validateEmail(formData.email)) {
    showNotification('Invalid email', 'error');
    return;
}
```

## Best Practices

### 1. Always Escape User Input
```javascript
import { escapeHtml } from '../utils/helpers.js';
const safe = escapeHtml(userInput);
```

### 2. Use Loading States
```javascript
import { setFormLoading } from '../components/forms.js';
setFormLoading(form, true);
// ... async operation
setFormLoading(form, false);
```

### 3. Handle Errors Gracefully
- Show user-friendly error messages
- Log errors to console for debugging
- Provide recovery options

### 4. Maintain State Consistency
- Always reload data after mutations
- Keep UI in sync with backend

### 5. Use Semantic HTML
- Proper heading hierarchy
- Accessible form labels
- Button vs link usage

## Common Tasks

### Adding a New CRUD Entity

1. Create module class
2. Implement render() method
3. Add openForm() method for create/edit
4. Add delete() method
5. Register route in app.js
6. Add navigation link

### Adding Validation

1. Add validation rule in `validation.js`
2. Use in form submission handler
3. Display errors to user

### Styling Components

1. Use Tailwind utility classes
2. Add custom CSS to `style.css` only when necessary
3. Follow existing patterns

## Debugging

### Enable Verbose Logging
```javascript
// In browser console
localStorage.setItem('debug', 'true');
```

### Check Network Requests
- Open browser DevTools
- Go to Network tab
- Filter by XHR/Fetch

### Inspect State
```javascript
// In browser console
console.log(window.app.state);
```

## Testing

### Manual Testing Checklist
See FRONTEND_FEATURES.md for comprehensive checklist.

### Browser Testing
- Chrome (primary)
- Firefox
- Safari
- Edge

### Device Testing
- Desktop (1920x1080)
- Tablet (768x1024)
- Mobile (375x667)

## Performance

### Current Optimizations
- In-memory caching
- Batch API calls
- Event delegation
- Minimal DOM updates
- Lazy loading

### Monitoring
- Check Network tab for request count
- Use Performance tab for rendering time
- Monitor memory usage in long sessions

## Security

### CSRF Protection
Automatically handled by api.js using Django's CSRF token.

### XSS Prevention
- Always use escapeHtml() for user input
- No eval() or innerHTML with user data
- Sanitize all dynamic content

## Browser Compatibility

### Requirements
- ES6 module support
- Fetch API
- Promises/async-await
- Modern CSS (flexbox, grid)

### Supported Browsers
- Chrome 61+
- Firefox 60+
- Safari 11+
- Edge 79+

## Troubleshooting

### Module Not Loading
- Check browser console for errors
- Verify all imports are correct
- Ensure file paths are correct

### API Calls Failing
- Check CSRF token is present
- Verify API endpoint exists
- Check Django server is running
- Look at Network tab for details

### UI Not Updating
- Verify state is updated
- Check render() is called
- Ensure data reload after mutations

### Modal/Notification Not Working
- Check modalRoot element exists
- Verify imports are correct
- Check for JavaScript errors

## Future Enhancements

### Potential Improvements
- [ ] Add unit tests (Jest)
- [ ] Add e2e tests (Playwright)
- [ ] Implement service worker for offline
- [ ] Add real-time updates (WebSocket)
- [ ] Optimize bundle size
- [ ] Add analytics
- [ ] Implement undo/redo
- [ ] Add keyboard shortcuts
- [ ] Improve accessibility (ARIA)
- [ ] Add dark mode
- [ ] Implement infinite scroll
- [ ] Add data export (CSV, Excel)
- [ ] Implement drag-and-drop

## Resources

### Documentation
- [MDN Web Docs](https://developer.mozilla.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Django REST Framework](https://www.django-rest-framework.org/)

### Code Style
- Use ES6+ features
- Follow Airbnb JavaScript Style Guide
- Use descriptive variable names
- Comment complex logic only

## Contact & Support

For questions or issues:
1. Check this documentation
2. Review FRONTEND_FEATURES.md
3. Check browser console for errors
4. Review Django logs
5. Consult project repository

## License

This project is part of the Schedulix application.
