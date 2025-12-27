from django.db import models

class Subject(models.Model):
    SUBJECT_TYPES = [
        ('Theory', 'Theory'),
        ('Practical', 'Practical'),
    ]
    
    code = models.CharField(max_length=20, unique=True)
    name = models.CharField(max_length=100)
    type = models.CharField(max_length=10, choices=SUBJECT_TYPES)
    credits = models.PositiveIntegerField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.code} - {self.name}"

class Classroom(models.Model):
    WING_CHOICES = [
        ('A', 'A'),
        ('B', 'B'),
        ('C', 'C'),
        ('D', 'D'),
    ]
    CLASSROOM_TYPES = [
        ('Theory', 'Theory'),
        ('Practical', 'Practical'),
        ('Both', 'Both'),
    ]
    
    number = models.CharField(max_length=20, unique=True)
    wing = models.CharField(max_length=1, choices=WING_CHOICES)
    capacity = models.PositiveIntegerField()
    type = models.CharField(max_length=10, choices=CLASSROOM_TYPES, default='Theory')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Room {self.number} - Wing {self.wing}"

class Teacher(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    start_time = models.TimeField()
    end_time = models.TimeField()
    lectures_per_day = models.PositiveIntegerField(default=4)
    max_continuous_lectures = models.PositiveIntegerField(default=2)
    subjects = models.ManyToManyField(Subject, through='TeacherSubject')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

class TeacherSubject(models.Model):
    teacher = models.ForeignKey(Teacher, on_delete=models.CASCADE)
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ['teacher', 'subject']

class TimeSlot(models.Model):
    DAY_CHOICES = [
        ('Monday', 'Monday'),
        ('Tuesday', 'Tuesday'),
        ('Wednesday', 'Wednesday'),
        ('Thursday', 'Thursday'),
        ('Friday', 'Friday'),
        ('Saturday', 'Saturday'),
    ]
    BREAK_TYPES = [
        ('short', 'Short Break'),
        ('long', 'Long Break'),
    ]
    
    start_time = models.TimeField()
    end_time = models.TimeField()
    day = models.CharField(max_length=10, choices=DAY_CHOICES)
    is_break = models.BooleanField(default=False)
    break_type = models.CharField(max_length=10, choices=BREAK_TYPES, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ['day', 'start_time', 'end_time']

    def __str__(self):
        return f"{self.day} {self.start_time}-{self.end_time}"

class Timetable(models.Model):
    name = models.CharField(max_length=100)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

class TimetableEntry(models.Model):
    DAY_CHOICES = TimeSlot.DAY_CHOICES
    
    timetable = models.ForeignKey(Timetable, on_delete=models.CASCADE, related_name='entries')
    day = models.CharField(max_length=10, choices=DAY_CHOICES)
    time_slot = models.ForeignKey(TimeSlot, on_delete=models.CASCADE)
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE, null=True, blank=True)
    teacher = models.ForeignKey(Teacher, on_delete=models.CASCADE, null=True, blank=True)
    classroom = models.ForeignKey(Classroom, on_delete=models.CASCADE, null=True, blank=True)
    is_break = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = [
            ['timetable', 'day', 'time_slot', 'teacher'],
            ['timetable', 'day', 'time_slot', 'classroom']
        ]

    def __str__(self):
        return self.get_entry_display()
    
    def get_entry_display(self):
        """Return display string for timetable entry"""
        if self.is_break:
            return f"{self.day} {self.time_slot} - BREAK"
        return f"{self.day} {self.time_slot} - {self.subject or 'No Subject'} ({self.teacher or 'No Teacher'} in {self.classroom or 'No Classroom'})"