package handlers

import (
	"encoding/json"
	"fmt"
	"net/http"

	"questdrop/models"
)

// Глобальная переменная для хранения работников в памяти
var workers []models.Worker

// GetWorkers возвращает список всех работников
func GetWorkers(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	err := json.NewEncoder(w).Encode(workers)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte(`{"error": "Internal server error"}`))
		return
	}
}

// AddWorker добавляет нового работника
func AddWorker(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	var worker models.Worker
	err := json.NewDecoder(r.Body).Decode(&worker)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest) // 400
		err := json.NewEncoder(w).Encode(map[string]string{"error": "Invalid JSON"})
		if err != nil {
			return
		}
		return
	}

	if worker.Name == "" {
		w.WriteHeader(http.StatusBadRequest) // 400
		err := json.NewEncoder(w).Encode(map[string]string{"error": "Name is required"})
		if err != nil {
			return
		}
		return
	}

	worker.ID = len(workers) + 1      // Присваиваем ID на основе текущей длины среза
	workers = append(workers, worker) // Добавляем
	// Возвращаем добавленного работника
	err = json.NewEncoder(w).Encode(worker)
	if err != nil {
		return
	}
}

// DeleteWorker удаляет работника по ID
func DeleteWorker(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	// Получаем ID из URL
	idStr := r.URL.Path[len("/api/workers/"):] // предполагаем, что путь такой
	var id int
	_, err := fmt.Sscanf(idStr, "%d", &id)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		err := json.NewEncoder(w).Encode(map[string]string{"error": "Invalid ID"})
		if err != nil {
			return
		}
		return
	}

	// Ищем и удаляем работника
	for i, worker := range workers {
		if worker.ID == id {
			workers = append(workers[:i], workers[i+1:]...)
			w.WriteHeader(http.StatusNoContent) // 204
			return
		}
	}
	w.WriteHeader(http.StatusNotFound)
	err = json.NewEncoder(w).Encode(map[string]string{"error": "Worker not found"})
	if err != nil {
		return
	}
}
