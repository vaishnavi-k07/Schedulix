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
    path('stats/', views.DatabaseStatusView.as_view(), name='api-stats'),
    path('clear-all-data/', views.clear_all_data, name='api-clear-all'),
    path('validate/', views.validate_data_for_generation, name='api-validate'),
    path('get-all-data/', views.get_all_data, name='api-get-all'),
    path('export-json/', views.export_data_json, name='api-export-json'),
    path('import-json/', views.import_data_json, name='api-import-json'),
]