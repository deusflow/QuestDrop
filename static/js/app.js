
// Массивы для хранения данных
let workers = []; // Работники (синхронизируются с Go сервером)
let tasks = [];   // Задания (синхронизируются с Go сервером)

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

// Функция загрузки заданий с сервера
function loadTasks() {
    fetch('/api/tasks')
        .then(response => response.json())
        .then(data => {
            tasks = data || [];  // Обновляем массив заданий
            renderTasksList();   // Обновляем интерфейс
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
    const description = taskNameInput.value.trim();
    
    if (description === '') {
        alert('Please enter task description!');
        return;
    }
    
    // Отправляем POST запрос на Go сервер
    fetch('/api/tasks', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({description: description})
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
    // TODO: Добавить DELETE запрос к серверу
    alert('Удаление работников будет добавлено позже!');
}

function removeTask(index) {
    // TODO: Добавить DELETE запрос к серверу
    alert('Удаление заданий будет добавлено позже!');
}


// Функция отображения результатов распределения
function displayResults(results) {
    resultsDiv.innerHTML = '';
    
    if (results.length === 0) {
        resultsDiv.innerHTML = '<p>Нет данных для распределения</p>';
        return;
    }
    
    resultsDiv.innerHTML = '<h3>🎯 Результат распределения:</h3>';
    
    results.forEach(result => {
        const resultDiv = document.createElement('div');
        resultDiv.className = 'result-item';
        resultDiv.style.marginBottom = '15px';
        resultDiv.style.padding = '10px';
        resultDiv.style.border = '1px solid #ddd';
        resultDiv.style.borderRadius = '5px';
        
        const tasksHtml = result.tasks.map(task => `<li>${task}</li>`).join('');
        
        resultDiv.innerHTML = `
            <h4>👤 ${result.worker_name}</h4>
            <p><strong>Заданий: ${result.tasks.length}</strong></p>
            <ul>${tasksHtml}</ul>
        `;
        
        resultsDiv.appendChild(resultDiv);
    });
}

// Заменить класс AdvancedSakuraPetals на этот:
class AdvancedSakuraPetals {
    constructor() {
        this.container = this.createContainer();
        this.petals = [];
        this.maxPetals = 15; // Увеличили количество
        this.mouseX = 0;
        this.mouseY = 0;
        this.lastMouseTime = 0;
        
        this.initMouseTracking();
    }
    
    createContainer() {
        const container = document.createElement('div');
        container.className = 'sakura-petals';
        document.body.appendChild(container);
        return container;
    }
    
    initMouseTracking() {
        document.addEventListener('mousemove', (e) => {
            this.mouseX = e.clientX;
            this.mouseY = e.clientY;
            
            // Создаем лепестки чаще при движении мыши
            const now = Date.now();
            if (now - this.lastMouseTime > 60) { // Уменьшили задержку
                if (Math.random() < 0.50) { // Увеличили вероятность
                    this.createPetal(e.clientX, e.clientY);
                }
                this.lastMouseTime = now;
            }
        });
    }
    
    createPetal(x, y) {
        if (this.petals.length >= this.maxPetals) {
            const oldPetal = this.petals.shift();
            if (oldPetal && oldPetal.parentNode) {
                oldPetal.parentNode.removeChild(oldPetal);
            }
        }
        
        const petal = document.createElement('div');
        petal.className = 'sakura-petal';
        
        // Добавляем случайные типы лепестков
        const types = ['type-1', 'type-2', 'type-3', 'type-4'];
        const randomType = types[Math.floor(Math.random() * types.length)];
        petal.classList.add(randomType);
        
        // Начальная позиция рядом с курсором
        petal.style.left = (x + Math.random() * 30 - 15) + 'px';
        petal.style.top = (y + Math.random() * 30 - 15) + 'px';
        
        // Более разнообразное движение
        const randomX = (Math.random() - 0.5) * 120;
        const randomY = Math.random() * 80 + 40;
        const finalX = randomX + (Math.random() - 0.5) * 60;
        const finalY = randomY + Math.random() * 100;
        
        petal.style.setProperty('--random-x', randomX + 'px');
        petal.style.setProperty('--random-y', randomY + 'px');
        petal.style.setProperty('--final-x', finalX + 'px');
        petal.style.setProperty('--final-y', finalY + 'px');
        
        this.container.appendChild(petal);
        this.petals.push(petal);
        
        // Время жизни лепестка
        setTimeout(() => {
            if (petal.parentNode) {
                petal.parentNode.removeChild(petal);
                const index = this.petals.indexOf(petal);
                if (index > -1) {
                    this.petals.splice(index, 1);
                }
            }
        }, 4000); // Немного уменьшили время жизни
    }
}




// ============ ОБРАБОТЧИКИ СОБЫТИЙ ============
// Заменить все обработчики DOMContentLoaded на один:
document.addEventListener('DOMContentLoaded', function() {
    // 🌸 ИНИЦИАЛИЗАЦИЯ ЛЕПЕСТКОВ САКУРЫ
    new AdvancedSakuraPetals();
    
    // 📝 ИНИЦИАЛИЗАЦИЯ ПЕЧАТНОЙ МАШИНКИ
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
    loadWorkers();
    loadTasks();

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
});