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
    subject_name = serializers.CharField(source='subject.name', read_only=True)
    teacher_name = serializers.CharField(source='teacher.name', read_only=True)
    classroom_number = serializers.CharField(source='classroom.number', read_only=True)
    time_display = serializers.CharField(source='time_slot.__str__', read_only=True)

    class Meta:
        model = TimetableEntry
        fields = '__all__'

class TimetableSerializer(serializers.ModelSerializer):
    entries = TimetableEntrySerializer(many=True, read_only=True)
    
    class Meta:
        model = Timetable
        fields = '__all__'