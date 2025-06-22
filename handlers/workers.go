package handlers

import (
	"encoding/json"
	"net/http"

	"questdrop/models"
)

// Глобальная переменная для хранения работников в памяти
var workers []models.Worker

// GetWorkers возвращает список всех работников
func GetWorkers(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(workers)
}

// AddWorker добавляет нового работника
func AddWorker(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	var worker models.Worker
	json.NewDecoder(r.Body).Decode(&worker)
	worker.ID = len(workers) + 1      // Присваиваем ID на основе текущей длины среза
	workers = append(workers, worker) // Добавляем
	// Возвращаем добавленного работника
	json.NewEncoder(w).Encode(worker)
}
