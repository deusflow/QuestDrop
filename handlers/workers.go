package handlers

import (
	"encoding/json"
	"net/http"
	"strconv" //конвертация строк в числа
	"strings" // для работы со строками

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

// func DeleteWorker(w http.ResponseWriter, r *http.Request) {
func DeleteWorker(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	// нужно разбить УРЛ на части, чтобы получить ID работника
	parts := strings.Split(r.URL.Path, "/")
	if len(parts) < 4 {
		http.Error(w, "Invalid URL", http.StatusBadRequest)
		return
	}
	idStr := parts[3] // Получаем ID из URL, 3 позиция, т.к. 0 - это пустая строка, 1 - api, 2 - workers
	id, err := strconv.Atoi(idStr) // Преобразуем ID из строки в число
	if err != nil {
		http.Error(w, "Invalid ID format", http.StatusBadRequest)
		return
	}

	// Ищем работника с таким ID
	workerIndex := -1
	for i, worker := range workers {
		// Сравниваем ID работника с переданным ID
		// Если нашли работника с таким ID, запоминаем индекс
		// и выходим из цикла
		if worker.ID == id {
			workerIndex = i
			break
		}

	}
	if workerIndex == -1 {
		http.Error(w, "Worker not found", http.StatusNotFound) // Если не нашли
		return
	}
	
	// Удаляем работника из среза
	workers = append(workers[:workerIndex], workers[workerIndex+1:]...) // Удаляем работника по индексу
	    // Отправляем успешный ответ
    w.WriteHeader(http.StatusOK)
    json.NewEncoder(w).Encode(map[string]string{"message": "Worker deleted successfully"})