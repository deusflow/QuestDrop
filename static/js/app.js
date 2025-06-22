
// Массивы для хранения работников и заданий (пока в памяти браузера)
let workers = []; // Список всех добавленных работников
let tasks = [];   // Список всех добавленных заданий

// ============ ПОЛУЧЕНИЕ DOM ЭЛЕМЕНТОВ ============
// Находим все нужные элементы интерфейса по их ID
const workerNameInput = document.getElementById('worker-name');     // Поле ввода имени работника
const addWorkerBtn = document.getElementById('add-worker');         // Кнопка Add для работников
const workersListDiv = document.getElementById('workers-list');     // Контейнер для списка работников

const taskNameInput = document.getElementById('task-name');         // Поле ввода названия задания
const addTaskBtn = document.getElementById('add-task');             // Кнопка Add для заданий
const tasksListDiv = document.getElementById('tasks-list');         // Контейнер для списка заданий

const distributeBtn = document.getElementById('distribute-tasks');  // Магическая кнопка распределения
const resultsDiv = document.getElementById('results');              // Контейнер для результатов

// ============ ОСНОВНЫЕ ФУНКЦИИ ============

// Функция добавления нового работника
function addWorker() {
    const name = workerNameInput.value.trim(); // Получаем текст из поля ввода и убираем пробелы

    if (name === '') {
        alert('Please enter worker name!'); // чекаю что поле не пустое
        return;
    }

    workers.push(name);           // Добавляю работника в массив
    workerNameInput.value = '';   // Очищаю поле ввода
    renderWorkersList();
}

// Функция добавления нового задания
function addTask() {
    const name = taskNameInput.value.trim(); //  текст из поля ввода и убираем пробелы

    if (name === '') {
        alert('Please enter task name!'); // ? поле не пустое
        return;
    }

    tasks.push(name);
    taskNameInput.value = '';
    renderTasksList();
}

// Функция отображения списка работников в HTML
function renderWorkersList() {
    workersListDiv.innerHTML = ''; // Очищаем контейнер

    workers.forEach((worker, index) => {
        const workerDiv = document.createElement('div');    // новый div элемент
        workerDiv.className = 'list-item';          // Добавляяю CSS класс для стилизации
        workerDiv.innerHTML = `
            <span>👤 ${worker}</span>
            <button onclick="removeWorker(${index})" style="float: right; background: none; border: none; cursor: pointer;">❌</button>
        `;
        workersListDiv.appendChild(workerDiv);              // Добавляем элемент в список
    });
}

// Функция отображения списка заданий в HTML
function renderTasksList() {
    tasksListDiv.innerHTML = ''; // Очищаем контейнер

    tasks.forEach((task, index) => {
        const taskDiv = document.createElement('div');      // Создаем новый div элемент
        taskDiv.className = 'list-item';                    // Добавляем CSS класс для стилизации
        taskDiv.innerHTML = `
            <span>📋 ${task}</span>
            <button onclick="removeTask(${index})" style="float: right; background: none; border: none; cursor: pointer;">❌</button>
        `;
        tasksListDiv.appendChild(taskDiv);                  // Добавляем элемент в список
    });
}

// Функции удаления элементов (для кнопок ❌)
function removeWorker(index) {
    workers.splice(index, 1);  // Удаляем работника из массива по индексу
    renderWorkersList();       // Обновляем отображение
}

function removeTask(index) {
    tasks.splice(index, 1);    // Удаляем задание из массива по индексу
    renderTasksList();         // Обновляем отображение
}

// ============ ОБРАБОТЧИКИ СОБЫТИЙ ============
// Привязываем функции к кнопкам когда страница загрузится
document.addEventListener('DOMContentLoaded', function() {

    // Клик по кнопке "Add ✨" для работников
    addWorkerBtn.addEventListener('click', addWorker);

    // Клик по кнопке "Add ✨" для заданий
    addTaskBtn.addEventListener('click', addTask);

    // Нажатие Enter в поле ввода работника
    workerNameInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            addWorker(); // Вызываем функцию добавления при нажатии Enter
        }
    });

    // Нажатие Enter в поле ввода задания
    taskNameInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            addTask(); // Вызываем функцию добавления при нажатии Enter
        }
    });

    // Пока магическая кнопка просто показывает alert (доработаем позже)
    distributeBtn.addEventListener('click', function() {
        if (workers.length === 0 || tasks.length === 0) {
            alert('Add workers and tasks first!');
            return;
        }
        alert('Magic distribution coming soon! ✨');
    });

});