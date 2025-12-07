// ================== Get Modal Elements ==================
const deleteModal = document.getElementById("deleteModal");
const deleteForm = document.getElementById("deleteForm");
const closeDeleteModalBtn = document.getElementById("closeDeleteModalBtn");
const cancelDeleteBtn = document.getElementById("cancelDeleteBtn");

const viewModal = document.getElementById("viewModal");
const closeViewModalBtn = document.getElementById("closeViewModalBtn");
const modalTitle = document.getElementById("modalTitle");
const modalContent = document.getElementById("modalContent");

const noteFormModal = document.getElementById("noteFormModal");
const closeNoteFormModalBtn = document.getElementById("closeNoteFormModalBtn");
const noteForm = document.getElementById("noteForm");
const modalHeading = document.getElementById("modalHeading");
const modalSubmitBtn = document.getElementById("modalSubmitBtn");
const openAddNoteBtn = document.getElementById("openAddNoteBtn");

// ================== Delete Modal ==================
function openDeleteModal(url) {
    deleteForm.action = url;
    deleteModal.style.display = "flex";
}

function closeDeleteModal() {
    deleteModal.style.display = "none";
}

// Attach delete buttons
document.querySelectorAll(".note-btn.delete-btn").forEach(btn => {
    btn.addEventListener("click", () => openDeleteModal(btn.dataset.deleteUrl));
});

// Close buttons
if (closeDeleteModalBtn) closeDeleteModalBtn.addEventListener("click", closeDeleteModal);
if (cancelDeleteBtn) cancelDeleteBtn.addEventListener("click", closeDeleteModal);

// Close modal on outside click
window.addEventListener("click", e => {
    if (e.target === deleteModal) closeDeleteModal();
});

// ================== View Modal ==================
function openViewModal(title, content) {
    modalTitle.textContent = title;
    modalContent.textContent = content;
    viewModal.style.display = "flex";
}

function closeViewModal() {
    viewModal.style.display = "none";
}

if (closeViewModalBtn) closeViewModalBtn.addEventListener("click", closeViewModal);
window.addEventListener("click", e => {
    if (e.target === viewModal) closeViewModal();
});

// ================== Add/Edit Note Modal ==================
document.querySelectorAll(".note-btn.edit-btn").forEach(btn => {
    btn.addEventListener("click", () => {
        const url = btn.dataset.editUrl;
        const titleValue = btn.dataset.title;
        const contentValue = btn.dataset.content;
        openNoteFormModal(url, "Edit Note", titleValue, contentValue);
    });
});

// Update openNoteFormModal to prefill inputs
function openNoteFormModal(url, heading="Add Note", titleValue="", contentValue="") {
    modalHeading.innerText = heading;
    noteForm.action = url;
    noteFormModal.style.display = "flex";

    // Prefill the form
    document.getElementById("id_title").value = titleValue;
    document.getElementById("id_content").value = contentValue;
}

function closeNoteFormModal() {
    noteFormModal.style.display = "none";
    noteForm.reset();
}

if (closeNoteFormModalBtn) closeNoteFormModalBtn.addEventListener("click", closeNoteFormModal);

// Open Add Note modal
if (openAddNoteBtn) {
    openAddNoteBtn.addEventListener("click", () => {
        openNoteFormModal("/notes/add/", "Add Note");
    });
}

// Close modal on outside click
window.addEventListener("click", e => {
    if (e.target === noteFormModal) closeNoteFormModal();
});

// ================== Sorting ==================
function sortNotes() {
    const sortSelect = document.querySelector("select[name='sort']");
    if (!sortSelect) return;

    const sortValue = sortSelect.value;
    const url = new URL(window.location.href);
    url.searchParams.set("sort", sortValue);
    window.location.href = url;
}
