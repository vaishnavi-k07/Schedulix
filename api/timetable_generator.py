import random
from django.db import transaction
from django.utils import timezone
from .models import Subject, Teacher, Classroom, TimeSlot, Timetable, TimetableEntry

class TimetableGenerator:
    """Automatic conflict-free timetable generator"""
    
    def generate_timetable(self, name):
        """Generate complete conflict-free timetable"""
        # Get all data from database (user input)
        teachers = list(Teacher.objects.all().prefetch_related('subjects'))
        subjects = list(Subject.objects.all())
        classrooms = list(Classroom.objects.all())
        timeslots = list(TimeSlot.objects.filter(is_break=False).order_by('day', 'start_time'))
        break_slots = list(TimeSlot.objects.filter(is_break=True).order_by('day', 'start_time'))
        
        # Validate data
        self.validate_data(teachers, subjects, classrooms, timeslots)
        
        # Create new timetable
        timetable = Timetable.objects.create(
            name=name,
            is_active=True
        )
        
        # Generate entries
        self.generate_entries(timetable, teachers, subjects, classrooms, timeslots, break_slots)
        
        return timetable
    
    def validate_data(self, teachers, subjects, classrooms, timeslots):
        """Validate that we have enough data to generate timetable"""
        if not teachers:
            raise ValueError("No teachers found. Please add teachers first.")
        if not subjects:
            raise ValueError("No subjects found. Please add subjects first.")
        if not classrooms:
            raise ValueError("No classrooms found. Please add classrooms first.")
        if not timeslots:
            raise ValueError("No time slots found. Please add time slots first.")
        
        # Check if teachers have subjects assigned
        for teacher in teachers:
            if not teacher.subjects.exists():
                raise ValueError(f"Teacher {teacher.name} has no subjects assigned.")
    
    def generate_entries(self, timetable, teachers, subjects, classrooms, timeslots, break_slots):
        """Generate conflict-free timetable entries"""
        days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
        
        # Track assignments to avoid conflicts
        teacher_assignments = {teacher.id: set() for teacher in teachers}
        classroom_assignments = {classroom.id: set() for classroom in classrooms}
        teacher_daily_count = {teacher.id: {day: 0 for day in days} for teacher in teachers}
        
        # Add break entries first
        self.add_break_entries(timetable, break_slots)
        
        # Generate regular entries for each day
        for day in days:
            day_timeslots = [ts for ts in timeslots if ts.day == day]
            self.generate_day_schedule(
                timetable, day, day_timeslots, teachers, subjects, classrooms,
                teacher_assignments, classroom_assignments, teacher_daily_count
            )
    
    def add_break_entries(self, timetable, break_slots):
        """Add break time entries to timetable"""
        for break_slot in break_slots:
            TimetableEntry.objects.create(
                timetable=timetable,
                day=break_slot.day,
                time_slot=break_slot,
                subject_id=None,
                teacher_id=None,
                classroom_id=None,
                is_break=True
            )
    
    def generate_day_schedule(self, timetable, day, day_timeslots, teachers, subjects, 
                            classrooms, teacher_assignments, classroom_assignments, teacher_daily_count):
        """Generate schedule for a single day"""
        
        for timeslot in day_timeslots:
            # Find available teachers for this timeslot
            available_teachers = self.get_available_teachers(
                teachers, timeslot, day, teacher_assignments, teacher_daily_count
            )
            
            # Shuffle for random assignment
            random.shuffle(available_teachers)
            
            assigned = False
            for teacher in available_teachers:
                # Get teacher's subjects
                teacher_subjects = list(teacher.subjects.all())
                if not teacher_subjects:
                    continue
                
                # Find available classroom
                available_classroom = self.get_available_classroom(
                    classrooms, timeslot, day, classroom_assignments
                )
                if not available_classroom:
                    continue
                
                # Select random subject from teacher's subjects
                subject = random.choice(teacher_subjects)
                
                # Check classroom suitability
                if not self.is_classroom_suitable(available_classroom, subject):
                    continue
                
                # Create timetable entry
                TimetableEntry.objects.create(
                    timetable=timetable,
                    day=day,
                    time_slot=timeslot,
                    subject=subject,
                    teacher=teacher,
                    classroom=available_classroom,
                    is_break=False
                )
                
                # Update tracking
                slot_key = f"{day}-{timeslot.id}"
                teacher_assignments[teacher.id].add(slot_key)
                classroom_assignments[available_classroom.id].add(slot_key)
                teacher_daily_count[teacher.id][day] += 1
                
                assigned = True
                break
    
    def get_available_teachers(self, teachers, timeslot, day, teacher_assignments, teacher_daily_count):
        """Get teachers available for the given timeslot"""
        available = []
        
        for teacher in teachers:
            # Check time availability
            if not (teacher.start_time <= timeslot.start_time <= teacher.end_time):
                continue
            
            # Check daily lecture limit
            if teacher_daily_count[teacher.id][day] >= teacher.lectures_per_day:
                continue
            
            # Check if already assigned in this timeslot
            slot_key = f"{day}-{timeslot.id}"
            if slot_key in teacher_assignments[teacher.id]:
                continue
            
            available.append(teacher)
        
        return available
    
    def get_available_classroom(self, classrooms, timeslot, day, classroom_assignments):
        """Get available classroom for the given timeslot"""
        available_classrooms = []
        
        for classroom in classrooms:
            slot_key = f"{day}-{timeslot.id}"
            if slot_key not in classroom_assignments[classroom.id]:
                available_classrooms.append(classroom)
        
        return random.choice(available_classrooms) if available_classrooms else None
    
    def is_classroom_suitable(self, classroom, subject):
        """Check if classroom is suitable for the subject"""
        if classroom.type == 'Both':
            return True
        return classroom.type == subject.type