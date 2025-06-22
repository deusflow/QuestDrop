
// Массивы для хранения данных
let workers = []; // Работники (синхронизируются с Go сервером)
let tasks = [];   // Задания (пока только локально)

// ============ ПОЛУЧЕНИЕ DOM ЭЛЕМЕНТОВ ============
const workerNameInput = document.getElementById('worker-name');
const addWorkerBtn = document.getElementById('add-worker');
const workersListDiv = document.getElementById('workers-list');

const taskNameInput = document.getElementById('task-name');
const addTaskBtn = document.getElementById('add-task');
const tasksListDiv = document.getElementById('tasks-list');

const distributeBtn = document.getElementById('distribute-tasks');
const resultsDiv = document.getElementById('results');

// ============ ОСНОВНЫЕ ФУНКЦИИ ============

// Функция загрузки работников с сервера
function loadWorkers() {
    fetch('/api/workers')
        .then(response => response.json())
        .then(data => {
            workers = data || [];  // Обновляем массив работников
            renderWorkersList();   // Обновляем интерфейс
        })
        .catch(error => {
            // В случае ошибки просто не обновляем список
        });
}

// Функция добавления нового работника
function addWorker() {
    const name = workerNameInput.value.trim();
    
    if (name === '') {
        alert('Please enter worker name!');
        return;
    }
    
    // Отправляем POST запрос на Go сервер
    fetch('/api/workers', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({name: name})
    })
    .then(response => response.json())
    .then(worker => {
        workerNameInput.value = '';  // Очищаем поле ввода
        loadWorkers();              // Обновляем список
    })
    .catch(error => {
        alert('Ошибка добавления работника!');
    });
}

// Функция добавления нового задания
function addTask() {
    const name = taskNameInput.value.trim();

    if (name === '') {
        alert('Please enter task name!');
        return;
    }

    tasks.push(name);
    taskNameInput.value = '';
    renderTasksList();
}

// Функция отображения списка работников в HTML
function renderWorkersList() {
    workersListDiv.innerHTML = '';

    workers.forEach((worker, index) => {
        const workerDiv = document.createElement('div');
        workerDiv.className = 'list-item';
        const workerName = typeof worker === 'string' ? worker : worker.name;
        workerDiv.innerHTML = `
            <span>👤 ${workerName}</span>
            <button onclick="removeWorker(${index})" style="float: right; background: none; border: none; cursor: pointer;">❌</button>
        `;
        workersListDiv.appendChild(workerDiv);
    });
}

// Функция отображения списка заданий в HTML
function renderTasksList() {
    tasksListDiv.innerHTML = '';

    tasks.forEach((task, index) => {
        const taskDiv = document.createElement('div');
        taskDiv.className = 'list-item';
        taskDiv.innerHTML = `
            <span>📋 ${task}</span>
            <button onclick="removeTask(${index})" style="float: right; background: none; border: none; cursor: pointer;">❌</button>
        `;
        tasksListDiv.appendChild(taskDiv);
    });
}

// Функции удаления элементов (временно отключены для работников)
function removeWorker(index) {
    // TODO: Добавить DELETE запрос к серверу
    alert('Удаление работников будет добавлено позже!');
}

function removeTask(index) {
    tasks.splice(index, 1);    // Удаляем задание из массива по индексу
    renderTasksList();         // Обновляем отображение
}

// ============ ОБРАБОТЧИКИ СОБЫТИЙ ============
document.addEventListener('DOMContentLoaded', function() {
    // Загружаем существующих работников
    loadWorkers();

    // Обработчики кнопок
    addWorkerBtn.addEventListener('click', addWorker);
    addTaskBtn.addEventListener('click', addTask);

    // Обработчики Enter
    workerNameInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') addWorker();
    });

    taskNameInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') addTask();
    });

    // Магическая кнопка распределения
    distributeBtn.addEventListener('click', function() {
        if (workers.length === 0 || tasks.length === 0) {
            alert('Add workers and tasks first!');
            return;
        }
        alert('Magic distribution coming soon! ✨');
    });
});