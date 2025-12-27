from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from rest_framework.views import APIView
from django.db import transaction
from django.shortcuts import render, get_object_or_404, redirect
from django.http import JsonResponse, HttpResponseRedirect
from django.views.decorators.csrf import csrf_exempt
from django.urls import reverse
from django.contrib import messages
import json

from .models import Subject, Teacher, Classroom, TimeSlot, Timetable, TimetableEntry
from .serializers import (
    SubjectSerializer, TeacherSerializer, ClassroomSerializer,
    TimeSlotSerializer, TimetableSerializer, TimetableEntrySerializer
)
from .timetable_generator import TimetableGenerator
from .forms import SubjectForm, TeacherForm, ClassroomForm, TimeSlotForm, TimetableForm


# ============================================
# Model ViewSets for REST API
# ============================================

class SubjectViewSet(viewsets.ModelViewSet):
    """
    API endpoint for managing subjects.
    Data will be saved to database and persist across server restarts.
    """
    queryset = Subject.objects.all().order_by('code')
    serializer_class = SubjectSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def perform_create(self, serializer):
        """Save subject to database"""
        serializer.save()
        print(f"Subject '{serializer.instance.name}' saved to database.")

    def perform_update(self, serializer):
        """Update subject in database"""
        serializer.save()
        print(f"Subject '{serializer.instance.name}' updated in database.")

    def perform_destroy(self, instance):
        """Delete subject from database"""
        print(f"Subject '{instance.name}' deleted from database.")
        instance.delete()


class TeacherViewSet(viewsets.ModelViewSet):
    """
    API endpoint for managing teachers.
    Data will be saved to database and persist across server restarts.
    """
    queryset = Teacher.objects.all().order_by('name')
    serializer_class = TeacherSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def perform_create(self, serializer):
        """Save teacher to database"""
        serializer.save()
        print(f"Teacher '{serializer.instance.name}' saved to database.")

    def perform_update(self, serializer):
        """Update teacher in database"""
        serializer.save()
        print(f"Teacher '{serializer.instance.name}' updated in database.")

    def perform_destroy(self, instance):
        """Delete teacher from database"""
        print(f"Teacher '{instance.name}' deleted from database.")
        instance.delete()


class ClassroomViewSet(viewsets.ModelViewSet):
    """
    API endpoint for managing classrooms.
    Data will be saved to database and persist across server restarts.
    """
    queryset = Classroom.objects.all().order_by('number')
    serializer_class = ClassroomSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def perform_create(self, serializer):
        """Save classroom to database"""
        serializer.save()
        print(f"Classroom '{serializer.instance.number}' saved to database.")

    def perform_update(self, serializer):
        """Update classroom in database"""
        serializer.save()
        print(f"Classroom '{serializer.instance.number}' updated in database.")

    def perform_destroy(self, instance):
        """Delete classroom from database"""
        print(f"Classroom '{instance.number}' deleted from database.")
        instance.delete()


class TimeSlotViewSet(viewsets.ModelViewSet):
    """
    API endpoint for managing time slots.
    Data will be saved to database and persist across server restarts.
    """
    queryset = TimeSlot.objects.all().order_by('day', 'start_time')
    serializer_class = TimeSlotSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def perform_create(self, serializer):
        """Save time slot to database"""
        serializer.save()
        print(f"TimeSlot '{serializer.instance.day} {serializer.instance.start_time}-{serializer.instance.end_time}' saved to database.")

    def perform_update(self, serializer):
        """Update time slot in database"""
        serializer.save()
        print(f"TimeSlot '{serializer.instance.day} {serializer.instance.start_time}-{serializer.instance.end_time}' updated in database.")

    def perform_destroy(self, instance):
        """Delete time slot from database"""
        print(f"TimeSlot '{instance.day} {instance.start_time}-{instance.end_time}' deleted from database.")
        instance.delete()


class TimetableViewSet(viewsets.ModelViewSet):
    """
    API endpoint for managing timetables.
    Data will be saved to database and persist across server restarts.
    """
    queryset = Timetable.objects.all().order_by('-created_at')
    serializer_class = TimetableSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def perform_create(self, serializer):
        """Save timetable to database"""
        serializer.save()
        print(f"Timetable '{serializer.instance.name}' saved to database with ID {serializer.instance.id}.")

    def perform_update(self, serializer):
        """Update timetable in database"""
        serializer.save()
        print(f"Timetable '{serializer.instance.name}' updated in database.")

    def perform_destroy(self, instance):
        """Delete timetable from database"""
        print(f"Timetable '{instance.name}' deleted from database.")
        instance.delete()
    
    @action(detail=False, methods=['post'])
    def generate(self, request):
        """
        Generate a new timetable automatically.
        POST to /api/timetables/generate/ with JSON: {"name": "Timetable Name"}
        """
        name = request.data.get('name', 'Auto-generated Timetable')
        
        try:
            # Check if we have enough data
            if Subject.objects.count() == 0:
                return Response(
                    {'error': 'Please add subjects first before generating timetable'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            if Teacher.objects.count() == 0:
                return Response(
                    {'error': 'Please add teachers first before generating timetable'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            if Classroom.objects.count() == 0:
                return Response(
                    {'error': 'Please add classrooms first before generating timetable'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            if TimeSlot.objects.count() == 0:
                return Response(
                    {'error': 'Please add time slots first before generating timetable'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            with transaction.atomic():
                # Deactivate all previous timetables
                Timetable.objects.filter(is_active=True).update(is_active=False)
                
                # Generate new timetable
                generator = TimetableGenerator()
                timetable = generator.generate_timetable(name)
                
                # Activate the new timetable
                timetable.is_active = True
                timetable.save()
                
                print(f"Generated timetable '{timetable.name}' with {timetable.entries.count()} entries.")
                
                serializer = self.get_serializer(timetable)
                return Response(serializer.data, status=status.HTTP_201_CREATED)
                
        except Exception as e:
            return Response(
                {'error': f'Timetable generation failed: {str(e)}'},
                status=status.HTTP_400_BAD_REQUEST
            )
    
    @action(detail=True, methods=['get'])
    def entries(self, request, pk=None):
        """Get all entries for a specific timetable"""
        timetable = self.get_object()
        entries = timetable.entries.all().select_related(
            'subject', 'teacher', 'classroom', 'time_slot'
        )
        serializer = TimetableEntrySerializer(entries, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def active(self, request):
        """Get the currently active timetable"""
        active_timetable = Timetable.objects.filter(is_active=True).first()
        if active_timetable:
            serializer = self.get_serializer(active_timetable)
            return Response(serializer.data)
        return Response({'detail': 'No active timetable found.'}, status=status.HTTP_404_NOT_FOUND)
    
    @action(detail=True, methods=['get'])
    def export_csv(self, request, pk=None):
        """Export timetable as CSV"""
        timetable = self.get_object()
        entries = timetable.entries.all().select_related(
            'subject', 'teacher', 'classroom', 'time_slot'
        ).order_by('time_slot__day', 'time_slot__start_time')
        
        import csv
        from django.http import HttpResponse
        
        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = f'attachment; filename="{timetable.name}.csv"'
        
        writer = csv.writer(response)
        writer.writerow(['Day', 'Start Time', 'End Time', 'Subject', 'Teacher', 'Classroom', 'Type'])
        
        for entry in entries:
            writer.writerow([
                entry.time_slot.day,
                entry.time_slot.start_time,
                entry.time_slot.end_time,
                entry.subject.name,
                entry.teacher.name,
                entry.classroom.number,
                'Break' if entry.time_slot.is_break else 'Class'
            ])
            
        return response

    @action(detail=True, methods=['post'])
    def activate(self, request, pk=None):
        """Activate a specific timetable"""
        timetable = self.get_object()
        
        with transaction.atomic():
            # Deactivate all timetables
            Timetable.objects.filter(is_active=True).update(is_active=False)
            # Activate this timetable
            timetable.is_active = True
            timetable.save()
        
        print(f"Activated timetable '{timetable.name}'")
        return Response({'status': 'Timetable activated successfully'})


class TimetableEntryViewSet(viewsets.ModelViewSet):
    """
    API endpoint for managing timetable entries.
    Data will be saved to database and persist across server restarts.
    """
    queryset = TimetableEntry.objects.all().select_related(
        'subject', 'teacher', 'classroom', 'time_slot'
    ).order_by('timetable', 'time_slot__day', 'time_slot__start_time')
    serializer_class = TimetableEntrySerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def perform_create(self, serializer):
        """Save timetable entry to database"""
        serializer.save()
        entry = serializer.instance
        if entry.is_break:
            print(f"TimetableEntry saved: BREAK at {entry.time_slot}")
        else:
            print(f"TimetableEntry saved: {entry.subject.name} with {entry.teacher.name} in {entry.classroom.number} at {entry.time_slot}")

    def perform_update(self, serializer):
        """Update timetable entry in database"""
        serializer.save()
        entry = serializer.instance
        if entry.is_break:
            print(f"TimetableEntry updated: BREAK at {entry.time_slot}")
        else:
            print(f"TimetableEntry updated: {entry.subject.name} with {entry.teacher.name} in {entry.classroom.number} at {entry.time_slot}")

    def perform_destroy(self, instance):
        """Delete timetable entry from database"""
        if instance.is_break:
            print(f"TimetableEntry deleted: BREAK at {instance.time_slot}")
        else:
            print(f"TimetableEntry deleted: {instance.subject.name} with {instance.teacher.name} in {instance.classroom.number} at {instance.time_slot}")
        instance.delete()


# ============================================
# Web Form Views (User Input)
# ============================================

def home_view(request):
    """Home page showing all data and navigation"""
    subjects = Subject.objects.all().order_by('code')
    teachers = Teacher.objects.all().order_by('name')
    classrooms = Classroom.objects.all().order_by('number')
    time_slots = TimeSlot.objects.all().order_by('day', 'start_time')
    timetables = Timetable.objects.all().order_by('-created_at')
    active_timetable = Timetable.objects.filter(is_active=True).first()
    
    context = {
        'subjects': subjects,
        'teachers': teachers,
        'classrooms': classrooms,
        'time_slots': time_slots,
        'timetables': timetables,
        'active_timetable': active_timetable,
        'total_subjects': subjects.count(),
        'total_teachers': teachers.count(),
        'total_classrooms': classrooms.count(),
        'total_timetables': timetables.count(),
        'total_time_slots': time_slots.count(),
    }
    return render(request, 'timetable/home.html', context)


def subjects_view(request):
    """Web page showing all subjects and form to add new"""
    subjects = Subject.objects.all().order_by('code')
    
    if request.method == 'POST':
        form = SubjectForm(request.POST)
        if form.is_valid():
            form.save()
            messages.success(request, f'Subject "{form.cleaned_data["name"]}" added successfully!')
            return redirect('subjects')
    else:
        form = SubjectForm()
    
    return render(request, 'timetable/subjects.html', {
        'subjects': subjects,
        'form': form
    })


def teachers_view(request):
    """Web page showing all teachers and form to add new"""
    teachers = Teacher.objects.all().order_by('name')
    
    if request.method == 'POST':
        form = TeacherForm(request.POST)
        if form.is_valid():
            form.save()
            messages.success(request, f'Teacher "{form.cleaned_data["name"]}" added successfully!')
            return redirect('teachers')
    else:
        form = TeacherForm()
    
    return render(request, 'timetable/teachers.html', {
        'teachers': teachers,
        'form': form
    })


def classrooms_view(request):
    """Web page showing all classrooms and form to add new"""
    classrooms = Classroom.objects.all().order_by('number')
    
    if request.method == 'POST':
        form = ClassroomForm(request.POST)
        if form.is_valid():
            form.save()
            messages.success(request, f'Classroom "{form.cleaned_data["number"]}" added successfully!')
            return redirect('classrooms')
    else:
        form = ClassroomForm()
    
    return render(request, 'timetable/classrooms.html', {
        'classrooms': classrooms,
        'form': form
    })


def time_slots_view(request):
    """Web page showing all time slots and form to add new"""
    time_slots = TimeSlot.objects.all().order_by('day', 'start_time')
    
    if request.method == 'POST':
        form = TimeSlotForm(request.POST)
        if form.is_valid():
            form.save()
            day = form.cleaned_data["day"]
            start = form.cleaned_data["start_time"]
            end = form.cleaned_data["end_time"]
            messages.success(request, f'Time slot "{day} {start}-{end}" added successfully!')
            return redirect('time_slots')
    else:
        form = TimeSlotForm()
    
    return render(request, 'timetable/time_slots.html', {
        'time_slots': time_slots,
        'form': form
    })


def timetables_view(request):
    """Web page showing all timetables and form to add new"""
    timetables = Timetable.objects.all().order_by('-created_at')
    
    if request.method == 'POST':
        form = TimetableForm(request.POST)
        if form.is_valid():
            timetable = form.save()
            messages.success(request, f'Timetable "{timetable.name}" created successfully!')
            return redirect('timetables')
    else:
        form = TimetableForm()
    
    return render(request, 'timetable/timetables.html', {
        'timetables': timetables,
        'form': form
    })


def timetable_detail_view(request, timetable_id):
    """Web page showing a specific timetable"""
    timetable = get_object_or_404(Timetable, id=timetable_id)
    entries = timetable.entries.all().select_related(
        'subject', 'teacher', 'classroom', 'time_slot'
    ).order_by('time_slot__day', 'time_slot__start_time')
    
    # Organize entries by day for display
    days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    timetable_by_day = {day: [] for day in days}
    
    for entry in entries:
        timetable_by_day[entry.time_slot.day].append(entry)
    
    context = {
        'timetable': timetable,
        'entries': entries,
        'timetable_by_day': timetable_by_day,
        'days': days,
    }
    return render(request, 'timetable/timetable_detail.html', context)


def generate_timetable_view(request):
    """Web page to generate timetable"""
    if request.method == 'POST':
        name = request.POST.get('name', 'Auto-generated Timetable')
        
        # Check if we have enough data
        if Subject.objects.count() == 0:
            messages.error(request, 'Please add subjects first before generating timetable')
            return redirect('generate_timetable')
        if Teacher.objects.count() == 0:
            messages.error(request, 'Please add teachers first before generating timetable')
            return redirect('generate_timetable')
        if Classroom.objects.count() == 0:
            messages.error(request, 'Please add classrooms first before generating timetable')
            return redirect('generate_timetable')
        if TimeSlot.objects.count() == 0:
            messages.error(request, 'Please add time slots first before generating timetable')
            return redirect('generate_timetable')
        
        try:
            with transaction.atomic():
                # Deactivate all previous timetables
                Timetable.objects.filter(is_active=True).update(is_active=False)
                
                # Generate new timetable
                generator = TimetableGenerator()
                timetable = generator.generate_timetable(name)
                
                # Activate the new timetable
                timetable.is_active = True
                timetable.save()
                
                messages.success(request, f'Timetable "{timetable.name}" generated successfully with {timetable.entries.count()} entries!')
                return redirect('timetable_detail', timetable_id=timetable.id)
                
        except Exception as e:
            messages.error(request, f'Timetable generation failed: {str(e)}')
            return redirect('generate_timetable')
    
    return render(request, 'timetable/generate_timetable.html')


# ============================================
# Edit/Delete Views
# ============================================

def edit_subject(request, subject_id):
    """Edit an existing subject"""
    subject = get_object_or_404(Subject, id=subject_id)
    
    if request.method == 'POST':
        form = SubjectForm(request.POST, instance=subject)
        if form.is_valid():
            form.save()
            messages.success(request, f'Subject "{subject.name}" updated successfully!')
            return redirect('subjects')
    else:
        form = SubjectForm(instance=subject)
    
    return render(request, 'timetable/edit_subject.html', {
        'form': form,
        'subject': subject
    })


def delete_subject(request, subject_id):
    """Delete a subject"""
    subject = get_object_or_404(Subject, id=subject_id)
    
    if request.method == 'POST':
        subject_name = subject.name
        subject.delete()
        messages.success(request, f'Subject "{subject_name}" deleted successfully!')
        return redirect('subjects')
    
    return render(request, 'timetable/delete_subject.html', {'subject': subject})


def edit_teacher(request, teacher_id):
    """Edit an existing teacher"""
    teacher = get_object_or_404(Teacher, id=teacher_id)
    
    if request.method == 'POST':
        form = TeacherForm(request.POST, instance=teacher)
        if form.is_valid():
            form.save()
            messages.success(request, f'Teacher "{teacher.name}" updated successfully!')
            return redirect('teachers')
    else:
        form = TeacherForm(instance=teacher)
    
    return render(request, 'timetable/edit_teacher.html', {
        'form': form,
        'teacher': teacher
    })


def delete_teacher(request, teacher_id):
    """Delete a teacher"""
    teacher = get_object_or_404(Teacher, id=teacher_id)
    
    if request.method == 'POST':
        teacher_name = teacher.name
        teacher.delete()
        messages.success(request, f'Teacher "{teacher_name}" deleted successfully!')
        return redirect('teachers')
    
    return render(request, 'timetable/delete_teacher.html', {'teacher': teacher})


def edit_classroom(request, classroom_id):
    """Edit an existing classroom"""
    classroom = get_object_or_404(Classroom, id=classroom_id)
    
    if request.method == 'POST':
        form = ClassroomForm(request.POST, instance=classroom)
        if form.is_valid():
            form.save()
            messages.success(request, f'Classroom "{classroom.number}" updated successfully!')
            return redirect('classrooms')
    else:
        form = ClassroomForm(instance=classroom)
    
    return render(request, 'timetable/edit_classroom.html', {
        'form': form,
        'classroom': classroom
    })


def delete_classroom(request, classroom_id):
    """Delete a classroom"""
    classroom = get_object_or_404(Classroom, id=classroom_id)
    
    if request.method == 'POST':
        classroom_number = classroom.number
        classroom.delete()
        messages.success(request, f'Classroom "{classroom_number}" deleted successfully!')
        return redirect('classrooms')
    
    return render(request, 'timetable/delete_classroom.html', {'classroom': classroom})


def edit_time_slot(request, timeslot_id):
    """Edit an existing time slot"""
    time_slot = get_object_or_404(TimeSlot, id=timeslot_id)
    
    if request.method == 'POST':
        form = TimeSlotForm(request.POST, instance=time_slot)
        if form.is_valid():
            form.save()
            messages.success(request, f'Time slot updated successfully!')
            return redirect('time_slots')
    else:
        form = TimeSlotForm(instance=time_slot)
    
    return render(request, 'timetable/edit_time_slot.html', {
        'form': form,
        'time_slot': time_slot
    })


def delete_time_slot(request, timeslot_id):
    """Delete a time slot"""
    time_slot = get_object_or_404(TimeSlot, id=timeslot_id)
    
    if request.method == 'POST':
        time_slot_str = f"{time_slot.day} {time_slot.start_time}-{time_slot.end_time}"
        time_slot.delete()
        messages.success(request, f'Time slot "{time_slot_str}" deleted successfully!')
        return redirect('time_slots')
    
    return render(request, 'timetable/delete_time_slot.html', {'time_slot': time_slot})


# ============================================
# API Views for Data Operations
# ============================================

@api_view(['GET'])
def get_all_data(request):
    """Get all data in one API call"""
    data = {
        'subjects': SubjectSerializer(Subject.objects.all(), many=True).data,
        'teachers': TeacherSerializer(Teacher.objects.all(), many=True).data,
        'classrooms': ClassroomSerializer(Classroom.objects.all(), many=True).data,
        'time_slots': TimeSlotSerializer(TimeSlot.objects.all(), many=True).data,
        'timetables': TimetableSerializer(Timetable.objects.all(), many=True).data,
        'active_timetable': TimetableSerializer(Timetable.objects.filter(is_active=True).first()).data if Timetable.objects.filter(is_active=True).exists() else None,
    }
    return Response(data)


@api_view(['DELETE'])
def clear_all_data(request):
    """Clear all data (use with caution!)"""
    if request.method == 'DELETE':
        try:
            with transaction.atomic():
                count = {
                    'timetable_entries': TimetableEntry.objects.count(),
                    'timetables': Timetable.objects.count(),
                    'subjects': Subject.objects.count(),
                    'teachers': Teacher.objects.count(),
                    'classrooms': Classroom.objects.count(),
                    'time_slots': TimeSlot.objects.count(),
                }
                
                TimetableEntry.objects.all().delete()
                Timetable.objects.all().delete()
                Subject.objects.all().delete()
                Teacher.objects.all().delete()
                Classroom.objects.all().delete()
                TimeSlot.objects.all().delete()
                
                print("All data cleared from database")
                return Response({
                    'message': 'All data cleared successfully',
                    'deleted_counts': count
                })
        
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


# ============================================
# Utility Views
# ============================================

class DatabaseStatusView(APIView):
    """Check database connection and data status"""
    
    def get(self, request):
        status_data = {
            'database_connected': True,
            'total_subjects': Subject.objects.count(),
            'total_teachers': Teacher.objects.count(),
            'total_classrooms': Classroom.objects.count(),
            'total_time_slots': TimeSlot.objects.count(),
            'total_timetables': Timetable.objects.count(),
            'total_timetable_entries': TimetableEntry.objects.count(),
            'active_timetable': None,
        }
        
        active_timetable = Timetable.objects.filter(is_active=True).first()
        if active_timetable:
            status_data['active_timetable'] = {
                'id': active_timetable.id,
                'name': active_timetable.name,
                'entries_count': active_timetable.entries.count(),
            }
        
        return Response(status_data)


@api_view(['GET'])
def validate_data_for_generation(request):
    """Validate if we have enough data to generate a timetable"""
    errors = []
    warnings = []
    
    # Check subjects
    subjects = Subject.objects.all()
    if not subjects.exists():
        errors.append('No subjects found. Add at least one subject.')
    else:
        warnings.append(f'Found {subjects.count()} subjects')
    
    # Check teachers
    teachers = Teacher.objects.all()
    if not teachers.exists():
        errors.append('No teachers found. Add at least one teacher.')
    else:
        # Validate teacher-subject assignments
        for teacher in teachers:
            if not teacher.subjects.exists():
                errors.append(f"Teacher '{teacher.name}' has no subjects assigned.")
        warnings.append(f'Found {teachers.count()} teachers')
    
    # Check classrooms
    classrooms = Classroom.objects.all()
    if not classrooms.exists():
        errors.append('No classrooms found. Add at least one classroom.')
    else:
        warnings.append(f'Found {classrooms.count()} classrooms')
    
    # Check time slots
    time_slots = TimeSlot.objects.all()
    if not time_slots.exists():
        errors.append('No time slots found. Add at least one time slot.')
    else:
        class_slots = time_slots.filter(is_break=False)
        break_slots = time_slots.filter(is_break=True)
        warnings.append(f'Found {time_slots.count()} time slots ({class_slots.count()} class slots, {break_slots.count()} break slots)')
    
    # Check for teacher availability vs time slots
    if teachers.exists() and time_slots.exists():
        for teacher in teachers:
            available_hours = []
            if teacher.start_time and teacher.end_time:
                # Check if any timeslot falls within teacher's availability
                available_count = time_slots.filter(
                    is_break=False,
                    start_time__gte=teacher.start_time,
                    end_time__lte=teacher.end_time
                ).count()
                if available_count == 0:
                    warnings.append(f"Teacher '{teacher.name}' has no available timeslots within their working hours")
    
    # Validate subject-classroom compatibility
    if subjects.exists() and classrooms.exists():
        for subject in subjects:
            suitable_rooms = classrooms.filter(
                models.Q(type='Both') | models.Q(type=subject.type)
            ).count()
            if suitable_rooms == 0:
                warnings.append(f"No suitable classrooms found for {subject.type} subject '{subject.name}'")
    
    # Check active timetable requirements
    active_timetable = Timetable.objects.filter(is_active=True).first()
    if active_timetable and active_timetable.entries.exists():
        entries = active_timetable.entries.all()
        scheduled_hours = entries.filter(is_break=False).count()
        break_hours = entries.filter(is_break=True).count()
        warnings.append(f'Currently active timetable has {scheduled_hours} class entries and {break_hours} break entries')
    
    return Response({
        'valid': len(errors) == 0,
        'errors': errors,
        'warnings': warnings
    })


def export_data_json(request):
    """Export all data as JSON"""
    data = {
        'subjects': list(Subject.objects.all().values()),
        'teachers': list(Teacher.objects.all().values()),
        'classrooms': list(Classroom.objects.all().values()),
        'time_slots': list(TimeSlot.objects.all().values()),
        'timetables': list(Timetable.objects.all().values()),
        'timetable_entries': list(TimetableEntry.objects.all().values()),
    }
    
    response = JsonResponse(data, json_dumps_params={'indent': 2})
    response['Content-Disposition'] = 'attachment; filename="timetable_data.json"'
    return response


@csrf_exempt
def import_data_json(request):
    """Import data from JSON"""
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            
            with transaction.atomic():
                # Import subjects
                if 'subjects' in data:
                    for subject_data in data['subjects']:
                        Subject.objects.update_or_create(
                            code=subject_data['code'],
                            defaults=subject_data
                        )
                
                # Import other models similarly...
                # (Add similar blocks for teachers, classrooms, etc.)
                
            return JsonResponse({'message': 'Data imported successfully'})
        
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)