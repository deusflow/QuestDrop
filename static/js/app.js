// Массивы для хранения данных
let workers = []; // Работники (синхронизируются сGo сервером)
let tasks = [];   // Задания (синхронизируются сGo сервером)

function saveDataToLocalStorage() {
    localStorage.setItem('workers', JSON.stringify(workers));
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadDataFromLocalStorage() {
    const savedWorkers = localStorage.getItem('workers');
    const savedTasks = localStorage.getItem('tasks');
    workers = savedWorkers ? JSON.parse(savedWorkers) : [];
    tasks = savedTasks ? JSON.parse(savedTasks) : [];
}

// Загружаем данные из localStorage при старте
loadDataFromLocalStorage();

// ============ ПОЛУЧЕНИЕ DOM ЭЛЕМЕНТОВ ============
const workerNameInput = document.getElementById('worker-name');
const addWorkerBtn = document.getElementById('add-worker');
const workersListDiv = document.getElementById('workers-list');

const taskNameInput = document.getElementById('task-name');
const addTaskBtn = document.getElementById('add-task');
const tasksListDiv = document.getElementById('tasks-list');

const distributeBtn = document.getElementById('distribute-tasks');
const resultsDiv = document.getElementById('results');

// Генерация и хранение userId
function getUserId() {
    let userId = localStorage.getItem('userId');
    if (!userId) {
        userId = 'u-' + Math.random().toString(36).substr(2, 16) + '-' + Date.now();
        localStorage.setItem('userId', userId);
    }
    return userId;
}
const userId = getUserId();

// ============ ОСНОВНЫЕ ФУНКЦИИ ============

// Функция загрузки
function loadWorkers() {
    fetch('/api/workers?userId=' + encodeURIComponent(userId))
        .then(response => response.json())
        .then(data => {
            workers = data || [];
            renderWorkersList();
            saveDataToLocalStorage();
        })
        .catch(error => {});
}

// Функция загрузки заданий с сервера
function loadTasks() {
    fetch('/api/tasks?userId=' + encodeURIComponent(userId))
        .then(response => response.json())
        .then(data => {
            tasks = data || [];
            renderTasksList();
            saveDataToLocalStorage();
        })
        .catch(error => {});
}


// Функция добавления нового работника
function addWorker() {
    const name = workerNameInput.value.trim();
    if (name === '') {
        alert('Please enter worker name!');
        return;
    }
    fetch('/api/workers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, userId })
    })
    .then(response => response.json())
    .then(worker => {
        workerNameInput.value = '';
        loadWorkers();
    })
    .catch(error => {
        alert('Ошибка добавления работника!');
    });
}

// Функция добавления нового задания
function addTask() {
    const description = taskNameInput.value.trim();
    if (description === '') {
        alert('Please enter task description!');
        return;
    }
    fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description, userId })
    })
    .then(response => response.json())
    .then(task => {
        taskNameInput.value = '';
        loadTasks();
    })
    .catch(error => {
        alert('Ошибка добавления задания!');
    });
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
            <span>📋 ${typeof task === 'string' ? task : task.description}</span>
            <button onclick="removeTask(${index})" style="float: right; background: none; border: none; cursor: pointer;">❌</button>
        `;
        tasksListDiv.appendChild(taskDiv);
    });
}

// Функции удаления элементов (временно отключены для работников)
function removeWorker(index) {
    const worker = workers[index];
    if (!worker || typeof worker.id === 'undefined') {
        alert('Некорректный работник!');
        return;
    }
    const id = worker.id;
    fetch(`/api/workers/${id}?userId=${encodeURIComponent(userId)}`, { method: 'DELETE' })
        .then(response => {
            if (response.ok) {
                loadWorkers();
            } else {
                alert('Ошибка удаления работника!');
            }
        })
        .catch(() => alert('Ошибка удаления работника!'));
}

function removeTask(index) {
    const task = tasks[index];
    if (!task || typeof task.id === 'undefined') {
        alert('Некорректное задание!');
        return;
    }
    const id = task.id;
    fetch(`/api/tasks/${id}?userId=${encodeURIComponent(userId)}`, { method: 'DELETE' })
        .then(response => {
            if (response.ok) {
                loadTasks();
            } else {
                alert('Ошибка удаления задания!');
            }
        })
        .catch(() => alert('Ошибка удаления задания!'));
}


// Функция отображения результатов распределения
function displayResults(results) {
    resultsDiv.innerHTML = '';
    if (results.length === 0) {
        resultsDiv.innerHTML = '<p>Нет данных для распределения</p>';
        return;
    }
    resultsDiv.innerHTML =`
  <div class="results-header">
    <span class="results-icon"></span>
    <span class="results-title-text">Outcome of the distribution:</span>
  </div>
  <ul class="results-list"></ul>
`;
    const resultsList = resultsDiv.querySelector('.results-list');
    results.forEach(result => {
        const li = document.createElement('li');
        li.className = 'list-item result-item';
        li.innerHTML = `
    <h4 class="result-worker">👤 ${result.worker_name}</h4>
    <p><strong>Tasks: ${result.tasks.length}</strong></p>
    <ul class="result-tasks">
      ${result.tasks.map(task => `<li>${task}</li>`).join('')}
    </ul>
  `;
        resultsList.appendChild(li);
    });
}

// Заменить весь класс AdvancedSakuraPetals на эт��т:
class AdvancedSakuraPetals {
    constructor() {
        this.container = this.createContainer();
        this.petals = [];
        this.maxPetals = 15;
        this.lastMouseTime = 0;
        this.isEnabled = true; // НОВОЕ СВОЙСТВО - включены ли лепестки

        this.initMouseTracking();
        this.initToggleButton(); // НОВЫЙ МЕТОД
    }

    createContainer() {
        const container = document.createElement('div');
        container.className = 'sakura-petals';
        document.body.appendChild(container);
        return container;
    }

    // НОВЫЙ МЕТОД - инициализация кнопки
    initToggleButton() {
        const toggleBtn = document.getElementById('sakura-toggle');
        if (toggleBtn) {
            toggleBtn.addEventListener('click', () => {
                this.togglePetals();
            });
        }
    }

    // НОВЫЙ МЕТОД - переключение лепестков
    togglePetals() {
        this.isEnabled = !this.isEnabled;
        const toggleBtn = document.getElementById('sakura-toggle');

        if (this.isEnabled) {
            // Включаем лепестки
            toggleBtn.classList.remove('disabled');
            toggleBtn.textContent = '🌸';
            toggleBtn.title = 'Выключить лепестки сакуры';
            console.log('🌸 Лепестки сакуры включены');
        } else {
            // Выключаем лепестки
            toggleBtn.classList.add('disabled');
            toggleBtn.textContent = '🚫';
            toggleBtn.title = 'Включить лепестки сакуры';
            this.clearAllPetals(); // удаляем все существующие лепестки
            console.log('🚫 Лепестки сакуры выключены');
        }
    }

    // НОВЫЙ МЕТОД - очистка всех лепестков
    clearAllPetals() {
        this.petals.forEach(petal => {
            if (petal && petal.parentNode) {
                petal.parentNode.removeChild(petal);
            }
        });
        this.petals = [];
    }

    initMouseTracking() {
        document.addEventListener('mousemove', (e) => {
            // ПРОВЕРЯЕМ, ВКЛЮЧЕНЫ ЛИ ЛЕПЕСТКИ
            if (!this.isEnabled) return;

            const now = Date.now();
            if (now - this.lastMouseTime > 80) {
                this.createPetal(e.clientX, e.clientY);
                this.lastMouseTime = now;
            }
        });
    }

    // Создание лепестка (теперь с картинкой)
    createPetal(x, y) {
        if (!this.isEnabled) return;
        if (this.petals.length >= this.maxPetals) return;

        // Случайный выбор картинки
        const images = [
            '/images/Sakura/SAKURA.png',
            '/images/Sakura/SAKURA2.png',
            '/images/Sakura/SAKURA3.png',
            '/images/Sakura/SAKURA4.png'
        ];
        const imgSrc = images[Math.floor(Math.random() * images.length)];

        // Случайный тип для размера/формы
        const type = 'type-' + (1 + Math.floor(Math.random() * 4));

        const petal = document.createElement('img');
        petal.src = imgSrc;
        petal.alt = 'sakura';
        petal.draggable = false;
        petal.className = `sakura-petal ${type}`;
        petal.style.left = x + 'px';
        petal.style.top = y + 'px';
        petal.style.pointerEvents = 'none';
        petal.style.userSelect = 'none';
        // Случайная длительность и направление
        const duration = 2.8 + Math.random() * 2.2;
        petal.style.animationDuration = duration + 's';
        petal.style.setProperty('--final-x', (Math.random() * 120 - 60) + 'px');
        petal.style.setProperty('--final-y', (80 + Math.random() * 120) + 'px');

        this.container.appendChild(petal);
        this.petals.push(petal);

        petal.addEventListener('animationend', () => {
            this.container.removeChild(petal);
            this.petals = this.petals.filter(p => p !== petal);
        });
    }
}




// ============ ОБРАБОТЧИКИ СОБЫТИЙ ============
// Заменить все обработчики DOMContentLoaded на один:
document.addEventListener('DOMContentLoaded', function() {
    // 🌸 ИНИЦИАЛИЗАЦИЯ ЛЕПЕСТКОВ САКУРЫ
    new AdvancedSakuraPetals();

    // 📝 ИНИЦИАЛИЗАЦИЯ ПЕЧАТН��Й МАШИНКИ
    const subtitle = document.getElementById('typing-subtitle');
    if (subtitle) {
        const text = subtitle.textContent;
        subtitle.innerHTML = '';
        subtitle.classList.add('typing');

        text.split('').forEach((char, index) => {
            const span = document.createElement('span');
            span.textContent = char === ' ' ? '\u00A0' : char;
            span.className = 'letter';
            span.style.animationDelay = `${index * 80}ms`;
            subtitle.appendChild(span);
        });

        setTimeout(() => {
            subtitle.classList.remove('typing');
        }, text.length * 80 + 1000);
    }

    // 🔄 ЗАГРУЗКА ДАННЫХ
    // loadWorkers();
    // loadTasks();
    renderWorkersList();
    renderTasksList();

    // 🔘 ОБРАБОТЧИКИ КНОПОК
    if (addWorkerBtn) addWorkerBtn.addEventListener('click', addWorker);
    if (addTaskBtn) addTaskBtn.addEventListener('click', addTask);

    // ⌨️ ОБРАБОТЧИКИ ENTER
    if (workerNameInput) {
        workerNameInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') addWorker();
        });
    }

    if (taskNameInput) {
        taskNameInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') addTask();
        });
    }

    // 🎯 ОБРАБОТЧИК РАСПРЕДЕЛЕНИЯ
    if (distributeBtn) {
        distributeBtn.addEventListener('click', function() {
            if (workers.length === 0 || tasks.length === 0) {
                alert('Add workers and tasks first!');
                return;
            }

            fetch('/api/distribute')
                .then(response => response.json())
                .then(results => {
                    displayResults(results);
                })
                .catch(error => {
                    alert('Ошибка распределения: ' + error);
                });
        });
    }

    document.getElementById('reset-all').addEventListener('click', function() {
        fetch('/api/reset', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId })
        })
        .then(() => {
            // Очищаем localStorage для workers и tasks
            localStorage.removeItem('workers');
            localStorage.removeItem('tasks');
            // После сброса загружаем пустые данные с сервера и синхронизируем localStorage
            loadWorkers();
            loadTasks();
            resultsDiv.innerHTML = '';
        });
    });
});
