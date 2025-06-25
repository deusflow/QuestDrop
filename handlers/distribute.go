package handlers

import (
	"encoding/json"
	"math/rand"
	"net/http"
)

// DistributionResult представляет результат распределения для одного работника
type DistributionResult struct {
	WorkerName string   `json:"worker_name"`
	Tasks      []string `json:"tasks"`
}

// DistributeTasks распределяет задания между работниками сбалансированно
func DistributeTasks(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	//check if there are workers and tasks
	if len(workers) == 0 || len(tasks) == 0 {
		// Если нет работников или заданий, возвращаем пустой результат
		json.NewEncoder(w).Encode([]DistributionResult{})
		return
	}

	// Double Shuffle: перемешиваем И работников И задания для справедливости
	rand.Shuffle(len(workers), func(i, j int) {
		workers[i], workers[j] = workers[j], workers[i]
	})
	rand.Shuffle(len(tasks), func(i, j int) {
		tasks[i], tasks[j] = tasks[j], tasks[i]
	})

	// массив результатов для каждого работника
	results := make([]DistributionResult, len(workers))
	// Заполняем результаты именами работников
	for index, worker := range workers {
		results[index] = DistributionResult{
			WorkerName: worker.Name,
			Tasks:      []string{},
		}
	}

	// Сбалансированное распределение заданий
	for index, task := range tasks {
		workerIndex := index % len(workers) // Индекс работника по кругу
		results[workerIndex].Tasks = append(results[workerIndex].Tasks, task.Description)
	}

	// Отправляем результат распределения
	json.NewEncoder(w).Encode(results)

}
