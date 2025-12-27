#!/usr/bin/env python
"""
Template Verification Script
Verifies all Schedulix templates are properly structured and accessible
"""

import os
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'Firstproject.settings')
django.setup()

from django.template.loader import get_template
from django.template import TemplateDoesNotExist

# Define all templates to verify
TEMPLATES = {
    'Core Templates': [
        'base.html',
    ],
    'Component Templates': [
        'components/navbar.html',
        'components/sidebar.html',
        'components/footer.html',
    ],
    'Page Templates': [
        'dashboard.html',
        'subjects.html',
        'teachers.html',
        'classrooms.html',
        'timeslots.html',
        'timetable.html',
        'timetable_view.html',
        'timetable_list.html',
    ],
    'Error Pages': [
        'errors/404.html',
        'errors/500.html',
    ],
}

def verify_template(template_name):
    """Verify a single template can be loaded"""
    try:
        template = get_template(template_name)
        return True, "OK"
    except TemplateDoesNotExist as e:
        return False, f"Not Found: {e}"
    except Exception as e:
        return False, f"Error: {e}"

def main():
    print("=" * 60)
    print("SCHEDULIX TEMPLATE VERIFICATION")
    print("=" * 60)
    print()
    
    total_templates = 0
    successful_templates = 0
    
    for category, templates in TEMPLATES.items():
        print(f"\n{category}")
        print("-" * 60)
        
        for template_name in templates:
            total_templates += 1
            success, message = verify_template(template_name)
            
            if success:
                successful_templates += 1
                status = "✓"
                color = "\033[92m"  # Green
            else:
                status = "✗"
                color = "\033[91m"  # Red
            
            reset = "\033[0m"
            print(f"{color}{status}{reset} {template_name:<35} {message}")
    
    print()
    print("=" * 60)
    print(f"SUMMARY: {successful_templates}/{total_templates} templates verified")
    
    if successful_templates == total_templates:
        print("\033[92m✓ All templates are properly structured and accessible!\033[0m")
        return 0
    else:
        print(f"\033[91m✗ {total_templates - successful_templates} template(s) failed verification\033[0m")
        return 1

if __name__ == '__main__':
    exit(main())
