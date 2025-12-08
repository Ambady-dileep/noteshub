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
const openAddNoteBtn = document.getElementById("openAddNoteBtn");

// ================== Search with Debouncing ==================
const searchInput = document.getElementById("searchInput");
const searchLoader = document.getElementById("searchLoader");
let searchTimeout;

if (searchInput) {
    searchInput.addEventListener("input", function() {
        clearTimeout(searchTimeout);
        
        // Show loader
        searchLoader.classList.add("active");
        
        searchTimeout = setTimeout(() => {
            performSearch();
        }, 500); // 500ms debounce delay
    });

    // Allow Enter key to search immediately
    searchInput.addEventListener("keypress", function(e) {
        if (e.key === "Enter") {
            e.preventDefault();
            clearTimeout(searchTimeout);
            performSearch();
        }
    });
}

function performSearch() {
    const query = searchInput.value.trim();
    const url = new URL(window.location.href);
    
    if (query) {
        url.searchParams.set("q", query);
    } else {
        url.searchParams.delete("q");
    }
    
    // Keep current sort parameter
    const currentSort = url.searchParams.get("sort");
    if (currentSort) {
        url.searchParams.set("sort", currentSort);
    }
    
    // Reset to page 1 on new search
    url.searchParams.delete("page");
    
    window.location.href = url.toString();
}

// ================== Sort Dropdown ==================
const sortBtn = document.getElementById("sortBtn");
const sortMenu = document.getElementById("sortMenu");
const sortDropdown = document.querySelector(".sort-dropdown");
const sortOptions = document.querySelectorAll(".sort-option");
const sortLabel = document.getElementById("sortLabel");

// Toggle dropdown
if (sortBtn) {
    sortBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        sortDropdown.classList.toggle("active");
    });
}

// Close dropdown when clicking outside
document.addEventListener("click", () => {
    if (sortDropdown) {
        sortDropdown.classList.remove("active");
    }
});

// Handle sort option selection
sortOptions.forEach(option => {
    option.addEventListener("click", (e) => {
        e.stopPropagation();
        const sortValue = option.dataset.value;
        
        // Update URL with new sort value
        const url = new URL(window.location.href);
        url.searchParams.set("sort", sortValue);
        
        // Reset to page 1 on new sort
        url.searchParams.delete("page");
        
        window.location.href = url.toString();
    });
});

// Set initial sort label based on current sort
function updateSortLabel() {
    const activeOption = document.querySelector('.sort-option[data-active="true"]');
    if (activeOption && sortLabel) {
        const labelText = activeOption.querySelector('span').textContent;
        sortLabel.textContent = labelText.replace(' First', '').replace(' (A-Z)', '').replace(' (Z-A)', '');
    }
}

updateSortLabel();

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
    if (e.target === viewModal) closeViewModal();
    if (e.target === noteFormModal) closeNoteFormModal();
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

// ================== Add/Edit Note Modal ==================
document.querySelectorAll(".note-btn.edit-btn").forEach(btn => {
    btn.addEventListener("click", () => {
        const url = btn.dataset.editUrl;
        const titleValue = btn.dataset.title;
        const contentValue = btn.dataset.content;
        openNoteFormModal(url, "Edit Note", titleValue, contentValue);
    });
});

function openNoteFormModal(url, heading = "Add Note", titleValue = "", contentValue = "") {
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

// ================== Stagger Animation for Note Cards ==================
const noteCards = document.querySelectorAll('.note-card');
noteCards.forEach((card, index) => {
    card.style.animationDelay = `${index * 0.05}s`;
});