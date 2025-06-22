package handlers

import (
	"encoding/json"
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
	json.NewDecoder(r.Body).Decode(&task)
	task.ID = len(tasks) + 1    // Присваиваем ID на основе текущей длины среза
	tasks = append(tasks, task) // Добавляем задание в срез
	// Возвращаем это новое задание
	json.NewEncoder(w).Encode(task)
}
