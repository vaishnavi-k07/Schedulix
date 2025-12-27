# Schedulix HTML Templates Documentation

## Overview
This directory contains professionally structured HTML templates for the Schedulix Timetable Generator. All templates are built with semantic HTML5, Tailwind CSS, and accessibility features.

## Template Structure

### Base Templates
- **`base.html`** - Master template that all other templates extend
  - Navigation bar
  - Sidebar navigation
  - Footer
  - Flash message rendering
  - Static asset loading
  - Modal and notification containers

### Component Templates (`components/`)
- **`navbar.html`** - Navigation bar with branding, user profile, and help button
- **`sidebar.html`** - Sidebar navigation with menu items and quick actions
- **`footer.html`** - Footer with copyright, version info, and links

### Page Templates
1. **`dashboard.html`** - Dashboard overview with statistics and quick actions
2. **`subjects.html`** - Subject management with table, search, and add/edit modal
3. **`teachers.html`** - Faculty management with availability settings
4. **`classrooms.html`** - Classroom management with capacity and type configuration
5. **`timeslots.html`** - Time slot management with visual weekly view
6. **`timetable.html`** - Timetable generation page with validation checklist
7. **`timetable_view.html`** - View generated timetable in grid format with export options
8. **`timetable_list.html`** - List all generated timetables with card view

### Error Pages (`errors/`)
- **`404.html`** - Custom 404 Not Found page
- **`500.html`** - Custom 500 Internal Server Error page

### Legacy Templates
- **`index.html`** - SPA shell (existing, preserved for JavaScript routing)
- **`loginpage.html`** - Login page (existing)

## Features

### Semantic HTML
- All templates use semantic HTML5 tags (`<header>`, `<nav>`, `<main>`, `<section>`, `<aside>`, `<footer>`)
- Proper heading hierarchy (h1 → h2 → h3)
- Meaningful class names following BEM methodology

### Accessibility
- ARIA labels and roles throughout
- Keyboard navigation support
- Focus indicators on interactive elements
- Screen reader friendly
- Semantic button and link usage
- Form labels properly associated with inputs

### Styling
- Tailwind CSS utility classes
- Consistent color scheme (blue primary, appropriate semantic colors)
- Responsive design (mobile-first)
- Hover and focus states
- Smooth transitions
- Print-friendly styles (where applicable)

### Responsiveness
- Mobile-first design
- Breakpoints: `sm:`, `md:`, `lg:` (Tailwind defaults)
- Collapsible sidebar on mobile
- Responsive tables with horizontal scroll
- Stacked layouts on small screens

### Modals
- Modal templates embedded in respective pages
- Accessible dialog structure
- Backdrop click to close
- Keyboard Escape to close
- Focus trap when open

### Forms
- Proper labels with required indicators
- Input validation structure
- Error message placeholders
- Accessible select dropdowns
- Time and date input fields
- Multi-select support

### Tables
- Sortable structure
- Zebra striping
- Empty state messages
- Action buttons (Edit/Delete)
- Responsive overflow handling

## Integration Guide

### For JavaScript SPA
The current implementation uses hash-based routing. To integrate these templates:

1. **Option A: Load templates via AJAX**
   ```javascript
   async function loadTemplate(templateName) {
       const response = await fetch(`/templates/${templateName}.html`);
       const html = await response.text();
       document.getElementById('mainContent').innerHTML = html;
   }
   ```

2. **Option B: Use Django views to render templates**
   ```python
   # In views.py
   def dashboard_view(request):
       return render(request, 'dashboard.html', context)
   ```

3. **Option C: Generate HTML dynamically using template structure**
   - Use templates as reference for HTML structure
   - JavaScript generates matching HTML dynamically

### For Server-Side Rendering
Update `urls.py` to add routes:
```python
from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('dashboard/', views.dashboard, name='dashboard'),
    path('subjects/', views.subjects, name='subjects'),
    path('teachers/', views.teachers, name='teachers'),
    # ... add more routes
]
```

## Template Variables

### Dashboard Template
- `totalSubjects` - Total number of subjects
- `totalTeachers` - Total number of teachers
- `totalClassrooms` - Total number of classrooms
- `totalTimeSlots` - Total number of time slots

### Subjects Template
- `subjects` - List of subject objects
- Each subject: `code`, `name`, `type`, `credits`

### Teachers Template
- `teachers` - List of teacher objects
- Each teacher: `name`, `email`, `start_time`, `end_time`, `lectures_per_day`, `max_continuous_lectures`, `subjects`

### Classrooms Template
- `classrooms` - List of classroom objects
- Each classroom: `number`, `wing`, `capacity`, `type`

### Time Slots Template
- `timeslots` - List of time slot objects
- Each slot: `day`, `start_time`, `end_time`, `is_break`, `break_type`

### Timetable View Template
- `timetable` - Timetable object
- `entries` - List of timetable entry objects
- Each entry: `time_slot`, `subject`, `teacher`, `classroom`

### Timetable List Template
- `timetables` - List of all timetables
- Each timetable: `name`, `created_date`, `is_active`, `entries_count`

## CSS Classes Reference

### Layout Classes
- `.dashboard`, `.subjects`, `.teachers`, etc. - Page container classes
- `.stat-card` - Statistics card component
- `.nav-link` - Navigation link
- `.empty-state` - Empty state message

### Component Classes
- `.modal` - Modal overlay
- `.modal__content` - Modal dialog box
- `.modal__header` - Modal header section
- `.modal__body` - Modal body content
- `.modal__footer` - Modal footer actions
- `.btn` - Base button class
- `.btn--primary` - Primary action button
- `.btn--danger` - Destructive action button
- `.form-group` - Form field container
- `.form-error` - Error message text

### State Classes
- `.active` - Active navigation item
- `.disabled` - Disabled element
- `.hidden` - Hidden element
- `.loading` - Loading state

## Browser Support
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Print Styles
Templates include print-friendly styles:
- Removes navigation and sidebar
- Optimizes timetable grid for printing
- Shows only essential content

## Customization

### Color Scheme
Primary colors are defined in Tailwind CSS classes:
- Primary: `blue-600`
- Success: `green-600`
- Warning: `yellow-600`
- Danger: `red-600`
- Neutral: `gray-*`

To customize, update Tailwind configuration or replace color classes.

### Typography
- Font: System font stack (sans-serif)
- Headings: Bold, varying sizes
- Body: Regular weight, 16px base

### Spacing
Uses Tailwind's spacing scale (0.25rem increments)

## Best Practices

1. **Template Inheritance**: Always extend `base.html` for consistency
2. **Block Structure**: Use `{% block content %}` for page-specific content
3. **Component Reuse**: Include components via `{% include %}`
4. **Accessibility**: Maintain ARIA labels and semantic HTML
5. **Responsiveness**: Test on mobile devices
6. **Loading States**: Show appropriate feedback during async operations
7. **Error Handling**: Display user-friendly error messages

## Testing Checklist

- [ ] All templates render without errors
- [ ] Forms submit correctly
- [ ] Modals open and close properly
- [ ] Navigation works on all pages
- [ ] Responsive design works on mobile
- [ ] Tables are scrollable on small screens
- [ ] Accessibility: keyboard navigation works
- [ ] Accessibility: screen reader compatible
- [ ] Print styles work correctly
- [ ] Error pages display properly

## Future Enhancements

- Dark mode support
- Advanced filtering and sorting
- Drag-and-drop timetable editing
- Real-time collaboration
- Export to multiple formats (iCal, Google Calendar)
- Notification system
- User preferences

## Support

For questions or issues with these templates:
1. Check this documentation
2. Review the component structure
3. Refer to Tailwind CSS documentation
4. Contact the development team

---

**Version**: 1.0.0  
**Last Updated**: 2024  
**Maintainer**: Schedulix Development Team
