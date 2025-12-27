# forms.py
from django import forms
from .models import Subject, Teacher, Classroom, TimeSlot, Timetable

class SubjectForm(forms.ModelForm):
    class Meta:
        model = Subject
        fields = ['code', 'name', 'type', 'credits']
        widgets = {
            'code': forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'e.g., MATH101'}),
            'name': forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'e.g., Mathematics'}),
            'type': forms.Select(attrs={'class': 'form-control'}),
            'credits': forms.NumberInput(attrs={'class': 'form-control', 'min': 1, 'max': 10}),
        }
        labels = {
            'code': 'Subject Code',
            'name': 'Subject Name',
            'type': 'Type',
            'credits': 'Credits',
        }

class TeacherForm(forms.ModelForm):
    class Meta:
        model = Teacher
        fields = ['name', 'email', 'start_time', 'end_time', 'lectures_per_day', 'max_continuous_lectures']
        widgets = {
            'name': forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'e.g., Dr. John Smith'}),
            'email': forms.EmailInput(attrs={'class': 'form-control', 'placeholder': 'e.g., john@example.com'}),
            'start_time': forms.TimeInput(attrs={'class': 'form-control', 'type': 'time'}),
            'end_time': forms.TimeInput(attrs={'class': 'form-control', 'type': 'time'}),
            'lectures_per_day': forms.NumberInput(attrs={'class': 'form-control', 'min': 1, 'max': 8}),
            'max_continuous_lectures': forms.NumberInput(attrs={'class': 'form-control', 'min': 1, 'max': 4}),
        }
        labels = {
            'name': 'Full Name',
            'email': 'Email Address',
            'start_time': 'Start Time',
            'end_time': 'End Time',
            'lectures_per_day': 'Lectures Per Day',
            'max_continuous_lectures': 'Max Continuous Lectures',
        }

class ClassroomForm(forms.ModelForm):
    class Meta:
        model = Classroom
        fields = ['number', 'wing', 'capacity', 'type']
        widgets = {
            'number': forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'e.g., Room 101'}),
            'wing': forms.Select(attrs={'class': 'form-control'}),
            'capacity': forms.NumberInput(attrs={'class': 'form-control', 'min': 1, 'max': 500}),
            'type': forms.Select(attrs={'class': 'form-control'}),
        }
        labels = {
            'number': 'Room Number',
            'wing': 'Wing',
            'capacity': 'Seating Capacity',
            'type': 'Room Type',
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
        fields = ['name', 'is_active']
        widgets = {
            'name': forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'e.g., Fall 2024 Timetable'}),
            'is_active': forms.CheckboxInput(attrs={'class': 'form-check-input'}),
        }
        labels = {
            'name': 'Timetable Name',
            'is_active': 'Is Active',
        }