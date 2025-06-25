package handlers

import (
	"encoding/json"
	"fmt"
	"net/http"
	"sync"
	"time"

	"questdrop/models"
)

var dataMu sync.RWMutex

// Храним работников по userId
var workersByUser = make(map[string][]models.Worker)
var workerIDCounter = make(map[string]int)

// Экспортируемые переменные для задач
var TasksByUser = make(map[string][]models.Task)
var TaskIDCounter = make(map[string]int)

// Для очистки неактивных пользователей
var userLastActive = make(map[string]time.Time)

const userDataTTL = 7 * 24 * time.Hour // 7 дней

// GetWorkers возвращает список работников для userId
func GetWorkers(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	userId := r.URL.Query().Get("userId")
	if userId == "" {
		w.WriteHeader(http.StatusBadRequest)
		_ = json.NewEncoder(w).Encode(map[string]string{"error": "userId required"})
		return
	}
	defer cleanupInactiveUsers()
	updateUserActivity(userId)
	dataMu.RLock()
	json.NewEncoder(w).Encode(workersByUser[userId])
	dataMu.RUnlock()
}

// AddWorker добавляет работника для userId
func AddWorker(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	var req struct {
		Name   string `json:"name"`
		UserId string `json:"userId"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		_ = json.NewEncoder(w).Encode(map[string]string{"error": "Invalid JSON"})
		return
	}
	if req.Name == "" || req.UserId == "" {
		w.WriteHeader(http.StatusBadRequest)
		_ = json.NewEncoder(w).Encode(map[string]string{"error": "Name and userId required"})
		return
	}
	dataMu.Lock()
	workerIDCounter[req.UserId]++
	worker := models.Worker{ID: workerIDCounter[req.UserId], Name: req.Name}
	workersByUser[req.UserId] = append(workersByUser[req.UserId], worker)
	dataMu.Unlock()
	defer cleanupInactiveUsers()
	updateUserActivity(req.UserId)
	json.NewEncoder(w).Encode(worker)
}

// DeleteWorker удаляет работника по ID для userId
func DeleteWorker(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	userId := r.URL.Query().Get("userId")
	if userId == "" {
		w.WriteHeader(http.StatusBadRequest)
		_ = json.NewEncoder(w).Encode(map[string]string{"error": "userId required"})
		return
	}
	idStr := r.URL.Path[len("/api/workers/"):]
	var id int
	_, err := fmt.Sscanf(idStr, "%d", &id)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		_ = json.NewEncoder(w).Encode(map[string]string{"error": "Invalid ID"})
		return
	}
	dataMu.Lock()
	list := workersByUser[userId]
	for i, worker := range list {
		if worker.ID == id {
			workersByUser[userId] = append(list[:i], list[i+1:]...)
			w.WriteHeader(http.StatusOK)
			_ = json.NewEncoder(w).Encode(map[string]string{"result": "deleted"})
			dataMu.Unlock()
			return
		}
	}
	dataMu.Unlock()
	w.WriteHeader(http.StatusNotFound)
	_ = json.NewEncoder(w).Encode(map[string]string{"error": "Not found"})
}

// Обновляет время последней активности пользователя
func updateUserActivity(userId string) {
	if userId != "" {
		userLastActive[userId] = time.Now()
	}
}

// Удаляет неактивных пользователей (все данные)
func cleanupInactiveUsers() {
	now := time.Now()
	for userId, last := range userLastActive {
		if now.Sub(last) > userDataTTL {
			dataMu.Lock()
			delete(workersByUser, userId)
			delete(workerIDCounter, userId)
			delete(TasksByUser, userId)
			delete(TaskIDCounter, userId)
			delete(userLastActive, userId)
			dataMu.Unlock()
		}
	}
}
