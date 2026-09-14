// ===== VARIABLES GLOBALES =====
let tasks = [];
let currentFilter = 'all';
const STORAGE_KEY = 'todoAppTasks';

// ===== ELEMENTOS DEL DOM =====
const taskInput = document.getElementById('taskInput');
const addBtn = document.getElementById('addBtn');
const taskList = document.getElementById('taskList');
const emptyMessage = document.getElementById('emptyMessage');
const filterBtns = document.querySelectorAll('.filter-btn');
const clearCompletedBtn = document.getElementById('clearCompletedBtn');
const clearAllBtn = document.getElementById('clearAllBtn');
const exportBtn = document.getElementById('exportBtn');
const totalCount = document.getElementById('totalCount');
const completedCount = document.getElementById('completedCount');
const pendingCount = document.getElementById('pendingCount');
const progressPercent = document.getElementById('progressPercent');
const progressBar = document.getElementById('progressBar');
const confirmModal = document.getElementById('confirmModal');
const confirmBtn = document.getElementById('confirmBtn');
const cancelBtn = document.getElementById('cancelBtn');
const confirmMessage = document.getElementById('confirmMessage');

// ===== EVENT LISTENERS =====
document.addEventListener('DOMContentLoaded', () => {
    loadTasks();
    renderTasks();
    updateStats();
});

addBtn.addEventListener('click', addTask);
taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addTask();
});

clearCompletedBtn.addEventListener('click', () => {
    if (tasks.some(t => t.completed)) {
        showConfirmModal(
            '¿Eliminar todas las tareas completadas?',
            clearCompleted
        );
    } else {
        alert('No hay tareas completadas para limpiar.');
    }
});

clearAllBtn.addEventListener('click', () => {
    if (tasks.length > 0) {
        showConfirmModal(
            '¿Eliminar TODAS las tareas? Esta acción no se puede deshacer.',
            clearAll
        );
    } else {
        alert('No hay tareas para eliminar.');
    }
});

exportBtn.addEventListener('click', exportTasks);

filterBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        filterBtns.forEach(b => b.classList.remove('active'));
        e.target.closest('.filter-btn').classList.add('active');
        currentFilter = e.target.closest('.filter-btn').dataset.filter;
        renderTasks();
    });
});

cancelBtn.addEventListener('click', closeConfirmModal);
confirmBtn.addEventListener('click', () => {
    if (window.pendingAction) {
        window.pendingAction();
        closeConfirmModal();
    }
});

// ===== FUNCIONES PRINCIPALES =====

/**
 * Agregar una nueva tarea
 */
function addTask() {
    const text = taskInput.value.trim();
    
    if (!text) {
        alert('Por favor, ingresa una tarea.');
        taskInput.focus();
        return;
    }

    const task = {
        id: Date.now(),
        text: text,
        completed: false,
        priority: 'medium',
        date: new Date().toLocaleDateString('es-ES')
    };

    tasks.unshift(task);
    taskInput.value = '';
    taskInput.focus();
    
    saveTasks();
    renderTasks();
    updateStats();
}

/**
 * Renderizar tareas en la interfaz
 */
function renderTasks() {
    taskList.innerHTML = '';
    
    const filteredTasks = tasks.filter(task => {
        if (currentFilter === 'completed') return task.completed;
        if (currentFilter === 'active') return !task.completed;
        return true;
    });

    if (filteredTasks.length === 0) {
        emptyMessage.classList.remove('hidden');
        return;
    }

    emptyMessage.classList.add('hidden');

    filteredTasks.forEach(task => {
        const taskEl = createTaskElement(task);
        taskList.appendChild(taskEl);
    });
}

/**
 * Crear elemento de tarea
 */
function createTaskElement(task) {
    const li = document.createElement('li');
    li.className = `task-item ${task.completed ? 'completed' : ''}`;
    li.dataset.id = task.id;

    li.innerHTML = `
        <input 
            type="checkbox" 
            class="task-checkbox" 
            ${task.completed ? 'checked' : ''}
            aria-label="Marcar tarea como completada"
        >
        <div class="task-content">
            <div class="task-text">${escapeHtml(task.text)}</div>
            <div class="task-date">${task.date}</div>
        </div>
        <span class="task-priority ${task.priority}">${task.priority}</span>
        <div class="task-actions">
            <button class="btn-task edit" title="Editar tarea" aria-label="Editar">
                <i class="fas fa-edit"></i>
            </button>
            <button class="btn-task delete" title="Eliminar tarea" aria-label="Eliminar">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `;

    // Event listeners para la tarea
    const checkbox = li.querySelector('.task-checkbox');
    checkbox.addEventListener('change', () => toggleTask(task.id));

    const editBtn = li.querySelector('.btn-task.edit');
    editBtn.addEventListener('click', () => editTask(task.id));

    const deleteBtn = li.querySelector('.btn-task.delete');
    deleteBtn.addEventListener('click', () => {
        showConfirmModal(
            '¿Eliminar esta tarea?',
            () => deleteTask(task.id)
        );
    });

    return li;
}

/**
 * Alternar estado completado de una tarea
 */
function toggleTask(id) {
    const task = tasks.find(t => t.id === id);
    if (task) {
        task.completed = !task.completed;
        saveTasks();
        renderTasks();
        updateStats();
    }
}

/**
 * Editar una tarea
 */
function editTask(id) {
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    const newText = prompt('Editar tarea:', task.text);
    
    if (newText !== null && newText.trim()) {
        task.text = newText.trim();
        saveTasks();
        renderTasks();
    }
}

/**
 * Eliminar una tarea
 */
function deleteTask(id) {
    tasks = tasks.filter(t => t.id !== id);
    saveTasks();
    renderTasks();
    updateStats();
}

/**
 * Limpiar tareas completadas
 */
function clearCompleted() {
    tasks = tasks.filter(t => !t.completed);
    saveTasks();
    renderTasks();
    updateStats();
}

/**
 * Eliminar todas las tareas
 */
function clearAll() {
    tasks = [];
    saveTasks();
    renderTasks();
    updateStats();
}

// ===== ALMACENAMIENTO LOCAL =====

/**
 * Guardar tareas en localStorage
 */
function saveTasks() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

/**
 * Cargar tareas de localStorage
 */
function loadTasks() {
    const stored = localStorage.getItem(STORAGE_KEY);
    tasks = stored ? JSON.parse(stored) : [];
}

// ===== ESTADÍSTICAS =====

/**
 * Actualizar estadísticas
 */
function updateStats() {
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    const pending = total - completed;
    const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);

    totalCount.textContent = total;
    completedCount.textContent = completed;
    pendingCount.textContent = pending;
    progressPercent.textContent = percentage + '%';
    progressBar.style.width = percentage + '%';
}

// ===== EXPORTAR TAREAS =====

/**
 * Exportar tareas como JSON
 */
function exportTasks() {
    const dataStr = JSON.stringify(tasks, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `tareas_${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
}

// ===== MODAL DE CONFIRMACIÓN =====

/**
 * Mostrar modal de confirmación
 */
function showConfirmModal(message, action) {
    confirmMessage.textContent = message;
    window.pendingAction = action;
    confirmModal.classList.add('active');
}

/**
 * Cerrar modal de confirmación
 */
function closeConfirmModal() {
    confirmModal.classList.remove('active');
    window.pendingAction = null;
}

// ===== UTILIDADES =====

/**
 * Escapar caracteres HTML para evitar XSS
 */
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Cerrar modal al hacer clic fuera de él
confirmModal.addEventListener('click', (e) => {
    if (e.target === confirmModal) {
        closeConfirmModal();
    }
});
