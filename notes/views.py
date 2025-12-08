import os
from dotenv import load_dotenv
load_dotenv()
from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from django.shortcuts import get_object_or_404
from django.core.paginator import Paginator
from .forms import NoteForm
from django.db.models import Q
from django.contrib import messages
from .models import Note
import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from openai import OpenAI
# Create your views here.

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

@login_required
def add_note(request):
    if request.method == "POST":
        form = NoteForm(request.POST)
        if form.is_valid():
            note = form.save(commit=False)
            note.user = request.user
            note.save()
            messages.success(request, "Note created successfully!")
        else:
            messages.error(request, "Error creating note. Please check the form.")
    return redirect("notes:notes_list")


@login_required
def edit_note(request, pk):
    note = get_object_or_404(Note, pk=pk, user=request.user)
    if request.method == "POST":
        form = NoteForm(request.POST, instance=note)
        if form.is_valid():
            form.save()
            messages.success(request, "Note updated successfully!")
        else:
            messages.error(request, "Error updating note. Check your input.")
    return redirect("notes:notes_list")


@login_required
def delete_note(request, pk):
    note = get_object_or_404(Note, pk=pk, user=request.user)

    if request.method == "POST":
        note.delete()
        messages.success(request, "Note deleted successfully!")
        return redirect("notes:notes_list")

    return redirect("notes:notes_list")

@login_required
def notes_list(request):
    query = request.GET.get("q", "")
    sort_by = request.GET.get("sort", "-created_at")  # default: newest first

    notes = Note.objects.filter(user=request.user)

    # Search filter
    if query:
        notes = notes.filter(Q(title__icontains=query) | Q(content__icontains=query))

    # Sorting
    notes = notes.order_by(sort_by)

    # Pagination
    paginator = Paginator(notes, 10)  # 10 notes per page
    page_number = request.GET.get("page")
    page_obj = paginator.get_page(page_number)

    context = {
        "page_obj": page_obj,
        "query": query,
        "sort_by": sort_by
    }
    return render(request, "notes/pages/notes_list.html", context)

@login_required
@csrf_exempt
def chatbot(request):
    if request.method != "POST":
        return JsonResponse({"error": "Invalid request"}, status=405)

    try:
        data = json.loads(request.body)
        user_message = data.get("message", "").strip()

        if not user_message:
            return JsonResponse({"reply": "Please type something to get started! 💭"})

        # Enhanced system prompt for NotesHub context
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {
                    "role": "system", 
                    "content": "You are NotesHub AI Assistant, a helpful and friendly AI that assists users with their note-taking needs. You can help with organizing notes, suggesting titles, summarizing content, and providing productivity tips. Be concise, helpful, and conversational."
                },
                {"role": "user", "content": user_message}
            ],
            temperature=0.7,
            max_tokens=500
        )

        reply = response.choices[0].message.content
        return JsonResponse({"reply": reply})

    except Exception as e:
        return JsonResponse({"error": f"An error occurred: {str(e)}"}, status=500)