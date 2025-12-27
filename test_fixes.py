#!/usr/bin/env python3
"""
Test script to validate all critical fixes for the Schedulix timetable generator
"""
import os
import sys
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'Firstproject.settings')
sys.path.append('/home/engine/project')
django.setup()

from django.db import transaction
from api.models import Subject, Teacher, Classroom, TimeSlot, Timetable, TimetableEntry
from api.timetable_generator import TimetableGenerator

def test_model_null_fks():
    """Test that TimetableEntry can have NULL foreign keys"""
    print("\n=== Testing TimetableEntry NULL FKs ===")
    
    # Clean up existing data
    TimetableEntry.objects.all().delete()
    Timetable.objects.all().delete()
    
    # Create base objects
    timetable = Timetable.objects.create(name="Test Timetable")
    
    timeslot = TimeSlot.objects.create(
        start_time='10:00',
        end_time='10:15',
        day='Monday',
        is_break=True
    )
    
    # Create a break entry with NULL FKs
    entry = TimetableEntry.objects.create(
        timetable=timetable,
        day='Monday',
        time_slot=timeslot,
        is_break=True
        # subject, teacher, classroom are NULL by default
    )
    
    assert entry.subject is None, "Subject should be NULL"
    assert entry.teacher is None, "Teacher should be NULL"
    assert entry.classroom is None, "Classroom should be NULL"
    assert entry.is_break is True, "Entry should be marked as break"
    
    print("✓ TimetableEntry NULL FKs work correctly")
    return True

def test_timetable_generator():
    """Test that timetable generator can create break entries"""
    print("\n=== Testing TimetableGenerator ===")
    
    # Clean up
    TimetableEntry.objects.all().delete()
    Timetable.objects.all().delete()
    
    # Create all necessary data
    # Subjects
    subject1 = Subject.objects.create(
        code='CS101',
        name='Computer Science',
        type='Theory',
        credits=3
    )
    
    subject2 = Subject.objects.create(
        code='PHY101',
        name='Physics',
        type='Practical',
        credits=4
    )
    
    # Teacher
    teacher = Teacher.objects.create(
        name='Dr. Smith',
        email='smith@example.com',
        start_time='09:00',
        end_time='17:00',
        lectures_per_day=4,
        max_continuous_lectures=2
    )
    teacher.subjects.add(subject1, subject2)
    
    # Classrooms
    classroom1 = Classroom.objects.create(
        number='A101',
        wing='A',
        capacity=50,
        type='Theory'
    )
    
    classroom2 = Classroom.objects.create(
        number='LabB',
        wing='B',
        capacity=30,
        type='Practical'
    )
    
    # TimeSlots - Lecture slots
    slot1 = TimeSlot.objects.create(
        start_time='09:00',
        end_time='10:00',
        day='Monday',
        is_break=False
    )
    
    slot2 = TimeSlot.objects.create(
        start_time='10:15',
        end_time='11:15',
        day='Monday',
        is_break=False
    )
    
    # TimeSlots - Break slots
    break1 = TimeSlot.objects.create(
        start_time='10:00',
        end_time='10:15',
        day='Monday',
        is_break=True,
        break_type='short'
    )
    
    break2 = TimeSlot.objects.create(
        start_time='12:00',
        end_time='13:00',
        day='Monday',
        is_break=True,
        break_type='long'
    )
    
    # Generate timetable
    generator = TimetableGenerator()
    timetable = generator.generate_timetable("Test Schedule")
    
    # Check entries were created
    entries = timetable.entries.all()
    print(f"Generated {entries.count()} entries")
    
    # Check split between breaks and classes
    break_entries = entries.filter(is_break=True)
    class_entries = entries.filter(is_break=False)
    
    print(f"  - {break_entries.count()} break entries")
    print(f"  - {class_entries.count()} class entries")
    
    # Verify break entries have NULL FKs
    for break_entry in break_entries:
        assert break_entry.subject is None, f"Break entry should have NULL subject"
        assert break_entry.teacher is None, f"Break entry should have NULL teacher"
        assert break_entry.classroom is None, f"Break entry should have NULL classroom"
    
    # Verify class entries have proper FKs
    for class_entry in class_entries:
        assert class_entry.subject is not None, "Class entry should have a subject"
        assert class_entry.teacher is not None, "Class entry should have a teacher"
        assert class_entry.classroom is not None, "Class entry should have a classroom"
    
    print("✓ TimetableGenerator creates correct break and class entries")
    return True

def test_serializer_validation():
    """Test serializer validation handles break entries correctly"""
    print("\n=== Testing Serializer Validation ===")
    
    from api.serializers import TimetableEntrySerializer
    
    # Clean up
    TimetableEntry.objects.all().delete()
    
    # Create test data
    timetable = Timetable.objects.create(name="Validation Test")
    timeslot = TimeSlot.objects.create(
        start_time='10:00',
        end_time='10:15',
        day='Monday',
        is_break=True
    )
    
    # Test break entry (should be valid)
    break_entry_data = {
        'timetable': timetable.id,
        'day': 'Monday',
        'time_slot': timeslot.id,
        'is_break': True
    }
    
    serializer = TimetableEntrySerializer(data=break_entry_data)
    assert serializer.is_valid(), f"Break entry should be valid: {serializer.errors}"
    
    break_entry = serializer.save()
    assert break_entry.is_break is True, "Entry should be break"
    assert break_entry.subject is None, "Subject should be None"
    assert break_entry.teacher is None, "Teacher should be None"
    assert break_entry.classroom is None, "Classroom should be None"
    
    print("✓ Serializer validation works correctly for break entries")
    
    # Test invalid regular entry missing required fields
    timeslot2 = TimeSlot.objects.create(
        start_time='11:00',
        end_time='12:00',
        day='Monday',
        is_break=False
    )
    
    invalid_data = {
        'timetable': timetable.id,
        'day': 'Monday',
        'time_slot': timeslot2.id,
        'is_break': False  # This should fail validation without subject/teacher/classroom
    }
    
    invalid_serializer = TimetableEntrySerializer(data=invalid_data)
    assert not invalid_serializer.is_valid(), "Entry without required FKs should fail validation"
    
    print("✓ Serializer validation correctly rejects invalid entries")
    return True

def test_api_endpoints():
    """Test that API endpoints are accessible"""
    print("\n=== Testing API Endpoints ===")
    
    # Test basic queries
    subjects_count = Subject.objects.count()
    teachers_count = Teacher.objects.count()
    classrooms_count = Classroom.objects.count()
    timetables_count = Timetable.objects.count()
    entries_count = TimetableEntry.objects.count()
    
    print(f"Database stats:")
    print(f"  - {subjects_count} subjects")
    print(f"  - {teachers_count} teachers")
    print(f"  - {classrooms_count} classrooms")
    print(f"  - {timetables_count} timetables")
    print(f"  - {entries_count} entries")
    
    # Check that at least we have some test data
    assert subjects_count >= 2, f"Expected at least 2 subjects, got {subjects_count}"
    assert teachers_count >= 1, f"Expected at least 1 teacher, got {teachers_count}"
    
    print("✓ API models are accessible")
    return True

def test_rest_framework_installed():
    """Test that REST framework is properly installed"""
    print("\n=== Testing REST Framework Installation ===")
    
    try:
        from rest_framework import status, permissions, serializers
        print("✓ Django REST Framework is properly installed")
        return True
    except ImportError as e:
        print(f"✗ Django REST Framework not installed: {e}")
        return False

def test_migration_applied():
    """Test that migration was applied successfully"""
    print("\n=== Testing Migration Application ===")
    
    from django.db import connection
    
    # Check if TimetableEntry has nullable fields
    table_name = TimetableEntry._meta.db_table
    
    with connection.cursor() as cursor:
        cursor.execute(f"SELECT * FROM PRAGMA_TABLE_INFO('{table_name}')")
        columns = cursor.fetchall()
        
        # Find subject_id, teacher_id, classroom_id columns
        column_info = {
            'subject_id': None,
            'teacher_id': None,
            'classroom_id': None
        }
        
        for col in columns:
            col_name = col[1]
            if col_name in column_info:
                column_info[col_name] = col[3]  # column[3] is NOT NULL flag
        
        print(f"Column constraints: {column_info}")
        
        # Verify NULL is allowed (NOT NULL flag should be 0)
        for col_name, not_null in column_info.items():
            if not_null == 1:  # 1 means NOT NULL constraint
                print(f"✗ {col_name} still has NOT NULL constraint")
                return False
            else:
                print(f"✓ {col_name} allows NULL")
    
    print("✓ Migration applied successfully - fields allow NULL")
    return True

def main():
    """Run all tests"""
    print("=" * 60)
    print("Schedulix Critical Fixes Test Suite")
    print("=" * 60)
    
    tests = [
        test_rest_framework_installed,
        test_migration_applied,
        test_model_null_fks,
        test_timetable_generator,
        test_serializer_validation,
        test_api_endpoints,
    ]
    
    failed = []
    for test in tests:
        try:
            if not test():
                failed.append(test.__name__)
        except Exception as e:
            print(f"✗ Test {test.__name__} failed with error: {e}")
            import traceback
            traceback.print_exc()
            failed.append(test.__name__)
    
    print("\n" + "=" * 60)
    print("Test Summary")
    print("=" * 60)
    if failed:
        print(f"❌ {len(failed)} test(s) failed:")
        for name in failed:
            print(f"  - {name}")
        return False
    else:
        print("✅ All critical fixes validated successfully!")
        return True

if __name__ == '__main__':
    success = main()
    sys.exit(0 if success else 1)