from django.shortcuts import render, redirect

def login_view(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')

        # Simple check (for learning)
        if username == "admin" and password == "123":
            return redirect('index')

    return render(request, 'loginpage.html')


def index(request):
    return render(request, 'index.html')


