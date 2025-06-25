package handlers

import (
	"encoding/json"
	"net/http"
)

// ResetUserData удаляет все данные пользователя (workers и tasks) по userId
func ResetUserData(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	var req struct {
		UserId string `json:"userId"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil || req.UserId == "" {
		w.WriteHeader(http.StatusBadRequest)
		_ = json.NewEncoder(w).Encode(map[string]string{"error": "userId required"})
		return
	}
	// Удаляем данные пользователя потокобезопасно
	dataMu.Lock()
	delete(workersByUser, req.UserId)
	delete(workerIDCounter, req.UserId)
	delete(tasksByUser, req.UserId)
	delete(taskIDCounter, req.UserId)
	delete(userLastActive, req.UserId)
	dataMu.Unlock()
	w.WriteHeader(http.StatusOK)
	_ = json.NewEncoder(w).Encode(map[string]string{"result": "reset"})
}
