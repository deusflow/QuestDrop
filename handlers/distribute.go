package handlers

import (
	"encoding/json"
	"net/http"
)

// DistributionResult представляет результат распределения для одного работника
type DistributionResult struct {
	WorkerName string   `json:"worker_name"`
	Tasks      []string `json:"tasks"`
}

// DistributeTasks распределяет задания между работниками сбалансированно/// Пример: распределение только по userId
func DistributeTasks(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	userId := r.URL.Query().Get("userId")
	if userId == "" {
		w.WriteHeader(http.StatusBadRequest)
		_ = json.NewEncoder(w).Encode(map[string]string{"error": "userId required"})
		return
	}
	dataMu.RLock()
	workers := workersByUser[userId]
	tasks := tasksByUser[userId]
	dataMu.RUnlock()
	// Здесь ваша логика распределения (пример: равномерно)
	results := []map[string]interface{}{}
	if len(workers) == 0 || len(tasks) == 0 {
		_ = json.NewEncoder(w).Encode(results)
		return
	}
	tasksPerWorker := len(tasks) / len(workers)
	extra := len(tasks) % len(workers)
	taskIdx := 0
	for i, worker := range workers {
		count := tasksPerWorker
		if i < extra {
			count++
		}
		workerTasks := []string{}
		for j := 0; j < count && taskIdx < len(tasks); j++ {
			workerTasks = append(workerTasks, tasks[taskIdx].Description)
			taskIdx++
		}
		results = append(results, map[string]interface{}{
			"worker_name": worker.Name,
			"tasks":       workerTasks,
		})
	}
	_ = json.NewEncoder(w).Encode(results)
}
