package handlers

import (
	"encoding/json"
	"fmt"
	"net/http"

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
	// Декодируем JSON из тела запроса в структуру Task
	err := json.NewDecoder(r.Body).Decode(&task)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{"error": "Invalid JSON"})
		return
	}

	if task.Description == "" {
		w.WriteHeader(http.StatusBadRequest) // 400
		json.NewEncoder(w).Encode(map[string]string{"error": "Description is required"})
		return
	}

	task.ID = len(tasks) + 1    // Присваиваем ID на основе текущей длины среза
	tasks = append(tasks, task) // Добавляем задание в срез
	// Возвращаем это новое задание
	json.NewEncoder(w).Encode(task)
}

func DeleteTask(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	idStr := r.URL.Path[len("/api/tasks/"):] // предполагаем, что путь такой
	var id int
	_, err := fmt.Sscanf(idStr, "%d", &id)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{"error": "Invalid ID"})
		return
	}

	for i, task := range tasks {
		if task.ID == id {
			tasks = append(tasks[:i], tasks[i+1:]...)
			w.WriteHeader(http.StatusNoContent)
			return
		}
	}
	w.WriteHeader(http.StatusNotFound)
	json.NewEncoder(w).Encode(map[string]string{"error": "Task not found"})
}
