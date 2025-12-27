# forms.py
from django import forms
from .models import Subject, Teacher, Classroom, TimeSlot, Timetable

class SubjectForm(forms.ModelForm):
    class Meta:
        model = Subject
        fields = ['code', 'name', 'credit_hours']
        widgets = {
            'code': forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'e.g., MATH101'}),
            'name': forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'e.g., Mathematics'}),
            'credit_hours': forms.NumberInput(attrs={'class': 'form-control', 'min': 1, 'max': 10}),
        }
        labels = {
            'code': 'Subject Code',
            'name': 'Subject Name',
            'credit_hours': 'Credit Hours',
        }

class TeacherForm(forms.ModelForm):
    class Meta:
        model = Teacher
        fields = ['teacher_id', 'name', 'email', 'phone']
        widgets = {
            'teacher_id': forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'e.g., T001'}),
            'name': forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'e.g., Dr. John Smith'}),
            'email': forms.EmailInput(attrs={'class': 'form-control', 'placeholder': 'e.g., john@example.com'}),
            'phone': forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'e.g., +1234567890'}),
        }
        labels = {
            'teacher_id': 'Teacher ID',
            'name': 'Full Name',
            'email': 'Email Address',
            'phone': 'Phone Number',
        }

class ClassroomForm(forms.ModelForm):
    class Meta:
        model = Classroom
        fields = ['number', 'capacity', 'type', 'facilities']
        widgets = {
            'number': forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'e.g., Room 101'}),
            'capacity': forms.NumberInput(attrs={'class': 'form-control', 'min': 1, 'max': 500}),
            'type': forms.Select(attrs={'class': 'form-control'}),
            'facilities': forms.Textarea(attrs={'class': 'form-control', 'rows': 3, 'placeholder': 'e.g., Projector, Whiteboard, AC'}),
        }
        labels = {
            'number': 'Room Number',
            'capacity': 'Seating Capacity',
            'type': 'Room Type',
            'facilities': 'Available Facilities',
        }

class TimeSlotForm(forms.ModelForm):
    class Meta:
        model = TimeSlot
        fields = ['day', 'start_time', 'end_time']
        widgets = {
            'day': forms.Select(attrs={'class': 'form-control'}),
            'start_time': forms.TimeInput(attrs={'class': 'form-control', 'type': 'time'}),
            'end_time': forms.TimeInput(attrs={'class': 'form-control', 'type': 'time'}),
        }
        labels = {
            'day': 'Day of Week',
            'start_time': 'Start Time',
            'end_time': 'End Time',
        }

class TimetableForm(forms.ModelForm):
    class Meta:
        model = Timetable
        fields = ['name', 'description']
        widgets = {
            'name': forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'e.g., Fall 2024 Timetable'}),
            'description': forms.Textarea(attrs={'class': 'form-control', 'rows': 3, 'placeholder': 'Optional description'}),
        }
        labels = {
            'name': 'Timetable Name',
            'description': 'Description',
        }