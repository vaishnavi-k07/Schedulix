from rest_framework import serializers
from .models import Subject, Teacher, Classroom, TimeSlot, Timetable, TimetableEntry

class SubjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subject
        fields = '__all__'

class ClassroomSerializer(serializers.ModelSerializer):
    class Meta:
        model = Classroom
        fields = '__all__'

class TeacherSerializer(serializers.ModelSerializer):
    subjects = serializers.PrimaryKeyRelatedField(many=True, queryset=Subject.objects.all())
    
    class Meta:
        model = Teacher
        fields = '__all__'
    
    def create(self, validated_data):
        subjects_data = validated_data.pop('subjects', [])
        teacher = Teacher.objects.create(**validated_data)
        teacher.subjects.set(subjects_data)
        return teacher
    
    def update(self, instance, validated_data):
        subjects_data = validated_data.pop('subjects', None)
        
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        
        if subjects_data is not None:
            instance.subjects.set(subjects_data)
        
        return instance

class TimeSlotSerializer(serializers.ModelSerializer):
    class Meta:
        model = TimeSlot
        fields = '__all__'

class TimetableEntrySerializer(serializers.ModelSerializer):
    subject_data = SubjectSerializer(source='subject', read_only=True)
    teacher_data = TeacherSerializer(source='teacher', read_only=True)
    classroom_data = ClassroomSerializer(source='classroom', read_only=True)
    time_slot_data = TimeSlotSerializer(source='time_slot', read_only=True)

    class Meta:
        model = TimetableEntry
        fields = ['id', 'timetable', 'day', 'time_slot', 'time_slot_data',
                 'subject', 'subject_data', 'teacher', 'teacher_data', 
                 'classroom', 'classroom_data', 'is_break', 'created_at']
        
    def to_representation(self, instance):
        """Custom representation to handle break entries"""
        representation = super().to_representation(instance)
        
        # For break entries, don't serialize the related objects
        if instance.is_break:
            representation['subject'] = None
            representation['teacher'] = None 
            representation['classroom'] = None
            representation['subject_data'] = None
            representation['teacher_data'] = None
            representation['classroom_data'] = None
            
        return representation
    
    def validate(self, data):
        """Validate timetable entry data"""
        is_break = data.get('is_break', False)
        
        # For break entries, subject/teacher/classroom can be null
        if is_break:
            return data
            
        # For regular entries, validate required fields
        required_fields = ['subject', 'teacher', 'classroom']
        for field in required_fields:
            if not data.get(field):
                raise serializers.ValidationError(f'{field} is required for non-break entries')
        
        # Validate teacher teaches the subject
        teacher = data.get('teacher')
        subject = data.get('subject')
        
        if teacher and subject:
            if not teacher.subjects.filter(id=subject.id).exists():
                raise serializers.ValidationError(
                    f"Teacher {teacher.name} is not assigned to subject {subject.name}"
                )
        
        # Validate classroom suitability
        classroom = data.get('classroom')
        if classroom and subject:
            if classroom.type != 'Both' and classroom.type != subject.type:
                raise serializers.ValidationError(
                    f"Classroom {classroom.number} is not suitable for {subject.type} subject"
                )
        
        return data

class TimetableSerializer(serializers.ModelSerializer):
    entries = TimetableEntrySerializer(many=True, read_only=True)
    
    class Meta:
        model = Timetable
        fields = '__all__'