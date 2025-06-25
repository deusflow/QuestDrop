package handlers

import (
	"encoding/json"
	"net/http"
	"strconv"
	"strings"

	"questdrop/models"
)

var tasks []models.Task

// GetTasks возвращает список всех заданий
func GetTasks(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(tasks)
}

// AddTask добавляет новое задание
func AddTask(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	var task models.Task
	json.NewDecoder(r.Body).Decode(&task)
	task.ID = len(tasks) + 1    // Присваиваем ID на основе текущей длины среза
	tasks = append(tasks, task) // Добавляем задание в срез
	// Возвращаем это новое задание
	json.NewEncoder(w).Encode(task)
}

// DeleteTask удаляет задание по ID из URL
func DeleteTask(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	// Разбиваем URL на части, чтобы получить ID задания
	parts := strings.Split(r.URL.Path, "/")
	if len(parts) < 4 {
		http.Error(w, "Invalid URL", http.StatusBadRequest)
		return
	}
	idStr := parts[3]              // Получаем ID из URL, 3 позиция, т.к. 0 - это пустая строка, 1 - api, 2 - tasks
	id, err := strconv.Atoi(idStr) // Преобразуем ID из строки в число
	if err != nil {
		http.Error(w, "Invalid ID format", http.StatusBadRequest)
		return
	}

	// Ищем задание с таким ID
	taskIndex := -1
	for i, task := range tasks {
		if task.ID == id {
			taskIndex = i
			break
		}
	}

	// Если не нашли задание с таким ID, возвращаем ошибку 404
	if taskIndex == -1 {
		http.Error(w, "Task not found", http.StatusNotFound)
		return
	}

	// Удаляем задание из среза
	tasks = append(tasks[:taskIndex], tasks[taskIndex+1:]...)
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{"message": "Task deleted successfully"})
}
