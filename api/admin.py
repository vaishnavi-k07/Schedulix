from django.contrib import admin
from .models import Subject, Teacher, Classroom, TimeSlot, Timetable, TimetableEntry

@admin.register(Subject)
class SubjectAdmin(admin.ModelAdmin):
    list_display = ['code', 'name', 'type', 'credits']
    search_fields = ['code', 'name']

@admin.register(Teacher)
class TeacherAdmin(admin.ModelAdmin):
    list_display = ['name', 'email', 'start_time', 'end_time', 'lectures_per_day']
    search_fields = ['name', 'email']
    raw_id_fields = ['subjects']

@admin.register(Classroom)
class ClassroomAdmin(admin.ModelAdmin):
    list_display = ['number', 'wing', 'capacity', 'type']
    search_fields = ['number', 'wing']

@admin.register(TimeSlot)
class TimeSlotAdmin(admin.ModelAdmin):
    list_display = ['day', 'start_time', 'end_time', 'is_break', 'break_type']
    list_filter = ['day', 'is_break']

@admin.register(Timetable)
class TimetableAdmin(admin.ModelAdmin):
    list_display = ['name', 'is_active', 'created_at']
    list_filter = ['is_active']

@admin.register(TimetableEntry)
class TimetableEntryAdmin(admin.ModelAdmin):
    list_display = ['timetable', 'day', 'time_slot', 'subject', 'teacher', 'classroom']
    list_filter = ['timetable', 'day', 'is_break']