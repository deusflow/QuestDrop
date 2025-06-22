package models

// Worker имя нашей будущей структуры
type Worker struct {
	ID   int    `json:"id"`   // ID работника
	Name string `json:"name"` // Имя работника
}

// Task представляет одно задание в системе
type Task struct {
	ID          int    `json:"id"`          // ID задания
	Description string `json:"description"` // Описание задания
}
