from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'subjects', views.SubjectViewSet)
router.register(r'teachers', views.TeacherViewSet)
router.register(r'classrooms', views.ClassroomViewSet)
router.register(r'timeslots', views.TimeSlotViewSet)
router.register(r'timetables', views.TimetableViewSet)
router.register(r'timetable-entries', views.TimetableEntryViewSet)

urlpatterns = [
    path('', include(router.urls)),
]