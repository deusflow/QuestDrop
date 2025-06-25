package handlers

import (
	"encoding/json"
	"fmt"
	"net/http"

	"questdrop/models"
)

// Храним задания по userId
var tasksByUser = make(map[string][]models.Task)
var taskIDCounter = make(map[string]int)

// GetTasks возвращает список заданий для userId
func GetTasks(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	userId := r.URL.Query().Get("userId")
	if userId == "" {
		w.WriteHeader(http.StatusBadRequest)
		_ = json.NewEncoder(w).Encode(map[string]string{"error": "userId required"})
		return
	}
	defer cleanupInactiveUsers() // можно вызывать нечасто, например, раз в 10 минут или по вероятности
	updateUserActivity(userId)
	dataMu.RLock()
	json.NewEncoder(w).Encode(tasksByUser[userId])
	dataMu.RUnlock()
}

// AddTask добавляет новое задание для userId
func AddTask(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	var req struct {
		Description string `json:"description"`
		UserId      string `json:"userId"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		_ = json.NewEncoder(w).Encode(map[string]string{"error": "Invalid JSON"})
		return
	}
	if req.Description == "" || req.UserId == "" {
		w.WriteHeader(http.StatusBadRequest)
		_ = json.NewEncoder(w).Encode(map[string]string{"error": "Description and userId required"})
		return
	}
	dataMu.Lock()
	taskIDCounter[req.UserId]++
	task := models.Task{ID: taskIDCounter[req.UserId], Description: req.Description}
	tasksByUser[req.UserId] = append(tasksByUser[req.UserId], task)
	dataMu.Unlock()
	updateUserActivity(req.UserId)
	json.NewEncoder(w).Encode(task)
}

// DeleteTask удаляет задание по ID для userId
func DeleteTask(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	userId := r.URL.Query().Get("userId")
	if userId == "" {
		w.WriteHeader(http.StatusBadRequest)
		_ = json.NewEncoder(w).Encode(map[string]string{"error": "userId required"})
		return
	}
	idStr := r.URL.Path[len("/api/tasks/"):]
	var id int
	_, err := fmt.Sscanf(idStr, "%d", &id)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		_ = json.NewEncoder(w).Encode(map[string]string{"error": "Invalid ID"})
		return
	}
	dataMu.Lock()
	list := tasksByUser[userId]
	for i, task := range list {
		if task.ID == id {
			tasksByUser[userId] = append(list[:i], list[i+1:]...)
			w.WriteHeader(http.StatusNoContent)
			dataMu.Unlock()
			return
		}
	}
	dataMu.Unlock()
	w.WriteHeader(http.StatusNotFound)
	_ = json.NewEncoder(w).Encode(map[string]string{"error": "Task not found"})
}

// Используйте updateUserActivity(userId) и cleanupInactiveUsers() из workers.go
