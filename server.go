package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net"
	"net/http"
	"os"
	"path/filepath"
	"strings"
	"time"
)

// User represents admin user data
type User struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

// Response represents API response format
type Response struct {
	Success bool        `json:"success"`
	Message string      `json:"message"`
	Data    interface{} `json:"data,omitempty"`
	Error   string      `json:"error,omitempty"`
}

// Simple in-memory database (for demo purposes)
var users = make(map[string]string) // email -> password

func main() {
	// Initialize default admin user
	users["superadmin@company.com"] = "SuperSecure123!"

	// Detect available port
	port := findAvailablePort()

	// Set up static file server
	setupFileServer()

	// Set up API endpoints
	setupAPIEndpoints()

	// Start server
	fmt.Printf("🚀 Dashboard server starting on port %s\n", port)
	fmt.Printf("📱 Dashboard: http://localhost:%s\n", port)
	fmt.Printf("🔐 Login: http://localhost:%s/login.html\n", port)
	fmt.Printf("📝 Register: http://localhost:%s/register.html\n", port)
	fmt.Printf("💡 Press Ctrl+C to stop\n\n")

	log.Fatal(http.ListenAndServe(":"+port, nil))
}

func findAvailablePort() string {
	// Always use port 8000 for consistency
	if isPortAvailable("8000") {
		return "8000"
	}

	// If 8000 is not available, try 8080
	if isPortAvailable("8080") {
		return "8080"
	}

	// If neither available, use 8000 anyway (let user kill other process)
	return "8000"
}

func isPortAvailable(port string) bool {
	listener, err := net.Listen("tcp", ":"+port)
	if err != nil {
		return false
	}
	listener.Close()
	return true
}

func setupAPIEndpoints() {
	// CORS middleware
	setCORSHeaders := func(w http.ResponseWriter) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
	}

	// Handle preflight requests
	handlePreflight := func(w http.ResponseWriter, r *http.Request) {
		if r.Method == "OPTIONS" {
			setCORSHeaders(w)
			w.WriteHeader(http.StatusOK)
			return
		}
	}

	// API: Login
	http.HandleFunc("/api/login", func(w http.ResponseWriter, r *http.Request) {
		setCORSHeaders(w)
		handlePreflight(w, r)
		if r.Method == "OPTIONS" {
			return
		}

		if r.Method != "POST" {
			http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
			return
		}

		var user User
		if err := json.NewDecoder(r.Body).Decode(&user); err != nil {
			response := Response{
				Success: false,
				Error:   "Invalid JSON format",
			}
			w.Header().Set("Content-Type", "application/json")
			json.NewEncoder(w).Encode(response)
			return
		}

		// Check credentials
		if storedPassword, exists := users[user.Email]; exists && storedPassword == user.Password {
			response := Response{
				Success: true,
				Message: "Login berhasil",
				Data: map[string]interface{}{
					"email": user.Email,
					"token": "demo-token-" + fmt.Sprintf("%d", time.Now().Unix()),
				},
			}
			w.Header().Set("Content-Type", "application/json")
			json.NewEncoder(w).Encode(response)
		} else {
			response := Response{
				Success: false,
				Error:   "Email atau password salah",
			}
			w.Header().Set("Content-Type", "application/json")
			w.WriteHeader(http.StatusUnauthorized)
			json.NewEncoder(w).Encode(response)
		}
	})

	// API: Register
	http.HandleFunc("/api/register", func(w http.ResponseWriter, r *http.Request) {
		setCORSHeaders(w)
		handlePreflight(w, r)
		if r.Method == "OPTIONS" {
			return
		}

		if r.Method != "POST" {
			http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
			return
		}

		var user User
		if err := json.NewDecoder(r.Body).Decode(&user); err != nil {
			response := Response{
				Success: false,
				Error:   "Invalid JSON format",
			}
			w.Header().Set("Content-Type", "application/json")
			json.NewEncoder(w).Encode(response)
			return
		}

		// Check if user already exists
		if _, exists := users[user.Email]; exists {
			response := Response{
				Success: false,
				Error:   "Email sudah terdaftar",
			}
			w.Header().Set("Content-Type", "application/json")
			w.WriteHeader(http.StatusConflict)
			json.NewEncoder(w).Encode(response)
			return
		}

		// Validate password strength
		if len(user.Password) < 6 {
			response := Response{
				Success: false,
				Error:   "Password harus minimal 6 karakter",
			}
			w.Header().Set("Content-Type", "application/json")
			w.WriteHeader(http.StatusBadRequest)
			json.NewEncoder(w).Encode(response)
			return
		}

		// Register user
		users[user.Email] = user.Password
		fmt.Printf("✅ User registered: %s\n", user.Email)

		response := Response{
			Success: true,
			Message: "Registrasi berhasil",
			Data: map[string]interface{}{
				"email": user.Email,
			},
		}
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(response)
	})

	// API: Get registered users (for debugging)
	http.HandleFunc("/api/users", func(w http.ResponseWriter, r *http.Request) {
		setCORSHeaders(w)
		handlePreflight(w, r)
		if r.Method == "OPTIONS" {
			return
		}

		if r.Method != "GET" {
			http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
			return
		}

		var userList []string
		for email := range users {
			userList = append(userList, email)
		}

		response := Response{
			Success: true,
			Message: "Daftar user berhasil diambil",
			Data: map[string]interface{}{
				"users": userList,
				"count": len(userList),
			},
		}
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(response)
	})
}

func setupFileServer() {
	// Get current directory
	pwd, err := os.Getwd()
	if err != nil {
		log.Fatal(err)
	}

	// Set up file server with custom handler
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		// Add security headers
		w.Header().Set("X-Content-Type-Options", "nosniff")
		w.Header().Set("X-Frame-Options", "DENY")
		w.Header().Set("X-XSS-Protection", "1; mode=block")

		// Handle root path
		if r.URL.Path == "/" {
			http.ServeFile(w, r, filepath.Join(pwd, "login.html"))
			return
		}

		// Handle file requests
		filePath := filepath.Join(pwd, r.URL.Path)

		// Check if file exists
		if _, err := os.Stat(filePath); os.IsNotExist(err) {
			// For SPA routing, serve index.html for non-file requests
			if !strings.Contains(r.URL.Path, ".") {
				http.ServeFile(w, r, filepath.Join(pwd, "index.html"))
				return
			}
			http.NotFound(w, r)
			return
		}

		// Set content type for specific files
		if strings.HasSuffix(r.URL.Path, ".css") {
			w.Header().Set("Content-Type", "text/css")
		} else if strings.HasSuffix(r.URL.Path, ".js") {
			w.Header().Set("Content-Type", "application/javascript")
		} else if strings.HasSuffix(r.URL.Path, ".html") {
			w.Header().Set("Content-Type", "text/html")
		}

		// Serve the file
		http.ServeFile(w, r, filePath)
	})

	// Health check endpoint
	http.HandleFunc("/health", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		w.Write([]byte(`{"status":"OK","message":"Dashboard server is running"}`))
	})

	// API status endpoint
	http.HandleFunc("/api/status", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		w.Write([]byte(`{"status":"OK","server":"Go HTTP Server","version":"1.0"}`))
	})

	// Handle API requests for products (demo data)
	http.HandleFunc("/api/products", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")

		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusOK)
			return
		}

		// Demo response
		response := Response{
			Success: true,
			Message: "Products retrieved successfully",
			Data: map[string]interface{}{
				"products": []map[string]interface{}{
					{"id": 1, "name": "Product 1", "price": 100000},
					{"id": 2, "name": "Product 2", "price": 200000},
				},
				"count": 2,
			},
		}
		json.NewEncoder(w).Encode(response)
	})

	// Handle API requests for orders (demo data)
	http.HandleFunc("/api/orders", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")

		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusOK)
			return
		}

		response := Response{
			Success: true,
			Message: "Orders retrieved successfully",
			Data: map[string]interface{}{
				"orders": []map[string]interface{}{
					{"id": 1, "customer": "Customer 1", "total": 100000},
					{"id": 2, "customer": "Customer 2", "total": 200000},
				},
				"count": 2,
			},
		}
		json.NewEncoder(w).Encode(response)
	})

	// Handle API requests for customers (demo data)
	http.HandleFunc("/api/customers", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")

		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusOK)
			return
		}

		response := Response{
			Success: true,
			Message: "Customers retrieved successfully",
			Data: map[string]interface{}{
				"customers": []map[string]interface{}{
					{"id": 1, "name": "Customer 1", "email": "customer1@example.com"},
					{"id": 2, "name": "Customer 2", "email": "customer2@example.com"},
				},
				"count": 2,
			},
		}
		json.NewEncoder(w).Encode(response)
	})
}
