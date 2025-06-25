package main

import (
	"fmt"
	"log"
	"net/http"
	"os"

	"questdrop/handlers"
)

func main() {
	fmt.Println("🌸 QuestDrop сервер запускается... ✨")

	//файловый сервер, отдает файлы из папки "static",http.Dir("./static/") говорит "ищи файлы в папке static"
	fs := http.FileServer(http.Dir("./static/"))

	// Health check endpoint для Render
	http.HandleFunc("/health", func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
		_, _ = w.Write([]byte("OK"))
	})

	// API роуты для работников
	http.HandleFunc("/api/workers/", func(w http.ResponseWriter, r *http.Request) {
		fmt.Printf("🔍 WORKERS: %s %s\n", r.Method, r.URL.Path)
		if r.Method == "GET" {
			handlers.GetWorkers(w, r)
		} else if r.Method == "POST" {
			handlers.AddWorker(w, r)
		} else if r.Method == "DELETE" {
			handlers.DeleteWorker(w, r)
		}
	})

	http.HandleFunc("/api/workers/", func(w http.ResponseWriter, r *http.Request) {
		if r.Method == "DELETE" {
			handlers.DeleteWorker(w, r)
		}
	})

	// API роуты для заданий
	http.HandleFunc("/api/tasks/", func(w http.ResponseWriter, r *http.Request) {
		fmt.Printf("🔍 TASKS: %s %s\n", r.Method, r.URL.Path)
		if r.Method == "GET" {
			handlers.GetTasks(w, r)
		} else if r.Method == "POST" {
			handlers.AddTask(w, r)
		} else if r.Method == "DELETE" {
			handlers.DeleteTask(w, r)
		}
	})

	http.HandleFunc("/api/tasks/", func(w http.ResponseWriter, r *http.Request) {
		if r.Method == "DELETE" {
			handlers.DeleteTask(w, r)
		}
	})

	// Роут для распределения заданий
	http.HandleFunc("/api/distribute", handlers.DistributeTasks)

	http.Handle("/", fs)

	fmt.Println("🚀 Сервер работает на http://localhost:8080")
	fmt.Println("💖 Готов к распределению заданий!")

	// Делаем гибкий порт (хостинг сам назначит порт)
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080" // локально используем 8080
	}

	// Обновляем сообщение с динамическим портом
	fmt.Printf("🚀 Сервер работает на порту %s\n", port)
	fmt.Printf("🔍 Переменная окружения PORT: %s\n", os.Getenv("PORT"))
	fmt.Printf("🌐 Слушаем на всех интерфейсах: 0.0.0.0:%s\n", port)

	// Запускаем сервер с динамическим портом
	err := http.ListenAndServe(":"+port, nil)
	if err != nil {
		log.Fatal("Ошибка запуска сервера:", err)
	}
}
