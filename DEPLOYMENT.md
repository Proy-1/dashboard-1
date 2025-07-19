# 🚀 Deployment Guide

## 📋 Prerequisites

### System Requirements
- **Operating System**: Windows 10/11, macOS 10.14+, Linux (Ubuntu 18.04+)
- **Go Version**: 1.16 or higher
- **Memory**: Minimum 512MB RAM
- **Storage**: 100MB free space
- **Network**: Internet connection for dependencies

### Development Tools
- **Code Editor**: VS Code, GoLand, or any text editor
- **Terminal**: Command Prompt, PowerShell, or Terminal
- **Browser**: Chrome, Firefox, Safari, or Edge (latest versions)

## 🔧 Installation Methods

### Method 1: Quick Start (Recommended)
```bash
# Clone or download project
git clone <repository-url>
cd dashboard-1

# Run the server
go run server.go
```

### Method 2: Build and Run
```bash
# Build executable
go build -o dashboard-server server.go

# Run executable
./dashboard-server
```

### Method 3: Production Build
```bash
# Build for production
go build -ldflags "-s -w" -o dashboard-server server.go

# Run with specific port
./dashboard-server -port=8080
```

## 🌐 Deployment Environments

### 1. Local Development
```bash
# Default configuration
go run server.go

# Custom port
go run server.go -port=3000

# Access dashboard
http://localhost:8080
```

### 2. Production Server

#### Linux/Ubuntu
```bash
# Install Go
sudo apt update
sudo apt install golang-go

# Create service user
sudo useradd -r -s /bin/false dashboard

# Copy files
sudo cp -r /path/to/dashboard-1 /opt/dashboard
sudo chown -R dashboard:dashboard /opt/dashboard

# Create systemd service
sudo nano /etc/systemd/system/dashboard.service
```

**Service file content:**
```ini
[Unit]
Description=Dashboard Server
After=network.target

[Service]
Type=simple
User=dashboard
WorkingDirectory=/opt/dashboard
ExecStart=/opt/dashboard/dashboard-server
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

**Enable and start service:**
```bash
sudo systemctl enable dashboard
sudo systemctl start dashboard
sudo systemctl status dashboard
```

#### Windows Server
```powershell
# Install Go from https://golang.org/dl/

# Create service directory
New-Item -ItemType Directory -Path "C:\Services\Dashboard"

# Copy files
Copy-Item -Path "C:\path\to\dashboard-1\*" -Destination "C:\Services\Dashboard" -Recurse

# Build service
cd C:\Services\Dashboard
go build -o dashboard-server.exe server.go

# Install as Windows service (using NSSM)
nssm install DashboardServer "C:\Services\Dashboard\dashboard-server.exe"
nssm start DashboardServer
```

### 3. Cloud Deployment

#### Docker Deployment
```dockerfile
# Dockerfile
FROM golang:1.19-alpine AS builder

WORKDIR /app
COPY . .
RUN go build -o dashboard-server server.go

FROM alpine:latest
RUN apk --no-cache add ca-certificates
WORKDIR /root/
COPY --from=builder /app/dashboard-server .
COPY --from=builder /app/assets ./assets/
COPY --from=builder /app/*.html ./

EXPOSE 8080
CMD ["./dashboard-server"]
```

**Docker commands:**
```bash
# Build image
docker build -t dashboard-app .

# Run container
docker run -p 8080:8080 dashboard-app

# Run with custom port
docker run -p 3000:8080 dashboard-app
```

#### Heroku Deployment
```bash
# Install Heroku CLI
# https://devcenter.heroku.com/articles/heroku-cli

# Create app
heroku create your-dashboard-app

# Add Go buildpack
heroku buildpacks:set heroku/go

# Deploy
git push heroku main
```

**Procfile:**
```
web: dashboard-server
```

#### AWS EC2 Deployment
```bash
# Connect to EC2 instance
ssh -i your-key.pem ec2-user@your-ec2-ip

# Install Go
sudo yum update -y
sudo yum install -y golang

# Upload and run application
scp -i your-key.pem -r dashboard-1 ec2-user@your-ec2-ip:~/
ssh -i your-key.pem ec2-user@your-ec2-ip
cd dashboard-1
go run server.go
```

## 🔐 Security Configuration

### 1. Firewall Settings
```bash
# Ubuntu/Debian
sudo ufw allow 8080/tcp
sudo ufw enable

# CentOS/RHEL
sudo firewall-cmd --add-port=8080/tcp --permanent
sudo firewall-cmd --reload

# Windows
netsh advfirewall firewall add rule name="Dashboard" dir=in action=allow protocol=TCP localport=8080
```

### 2. SSL/TLS Certificate
```bash
# Generate self-signed certificate
openssl req -x509 -newkey rsa:4096 -keyout key.pem -out cert.pem -days 365 -nodes

# Update server.go for HTTPS
# Replace http.ListenAndServe with http.ListenAndServeTLS
```

### 3. Environment Variables
```bash
# Create .env file
echo "PORT=8080" > .env
echo "ENV=production" >> .env
echo "SECRET_KEY=your-secret-key" >> .env

# Load in application
# Use godotenv or similar library
```

## 📊 Monitoring & Logging

### 1. Basic Logging
```go
// Add to server.go
import "log"

func main() {
    log.SetOutput(os.Stdout)
    log.SetFlags(log.LstdFlags | log.Lshortfile)
    
    log.Println("Server starting on port:", port)
    log.Fatal(http.ListenAndServe(":"+port, nil))
}
```

### 2. Access Logs
```bash
# Redirect logs to file
./dashboard-server > access.log 2>&1

# Rotate logs (Linux)
sudo logrotate -f /etc/logrotate.conf
```

### 3. Health Check Endpoint
```go
// Add to server.go
func healthCheck(w http.ResponseWriter, r *http.Request) {
    w.WriteHeader(http.StatusOK)
    w.Write([]byte("OK"))
}

// Register handler
http.HandleFunc("/health", healthCheck)
```

## 🔄 Backup & Recovery

### 1. Database Backup
```bash
# For future database implementation
# PostgreSQL
pg_dump -U username -h localhost database_name > backup.sql

# MySQL
mysqldump -u username -p database_name > backup.sql
```

### 2. Application Backup
```bash
# Create backup
tar -czf dashboard-backup-$(date +%Y%m%d).tar.gz /opt/dashboard

# Restore backup
tar -xzf dashboard-backup-20231201.tar.gz -C /opt/
```

### 3. Configuration Backup
```bash
# Backup configuration
cp /opt/dashboard/assets/js/config.js /backup/config.js.backup

# Restore configuration
cp /backup/config.js.backup /opt/dashboard/assets/js/config.js
```

## 📈 Performance Optimization

### 1. Go Optimization
```bash
# Build with optimizations
go build -ldflags "-s -w" -o dashboard-server server.go

# Use Go modules
go mod init dashboard
go mod tidy
```

### 2. Static File Serving
```bash
# Use nginx for static files
sudo apt install nginx

# Configure nginx
sudo nano /etc/nginx/sites-available/dashboard
```

**Nginx configuration:**
```nginx
server {
    listen 80;
    server_name your-domain.com;
    
    location /assets/ {
        root /opt/dashboard/;
        expires 30d;
    }
    
    location / {
        proxy_pass http://localhost:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

### 3. Database Optimization
```bash
# For future database implementation
# PostgreSQL tuning
sudo nano /etc/postgresql/13/main/postgresql.conf

# MySQL tuning
sudo nano /etc/mysql/mysql.conf.d/mysqld.cnf
```

## 🚨 Troubleshooting

### Common Issues

#### 1. Port Already in Use
```bash
# Find process using port
lsof -i :8080
netstat -ano | findstr :8080

# Kill process
kill -9 <PID>
taskkill /PID <PID> /F
```

#### 2. Permission Denied
```bash
# Fix file permissions
chmod +x dashboard-server
sudo chown -R dashboard:dashboard /opt/dashboard
```

#### 3. Go Module Issues
```bash
# Clear module cache
go clean -modcache

# Reinitialize modules
go mod init dashboard
go mod tidy
```

#### 4. Static Files Not Loading
```bash
# Check file paths
ls -la assets/
dir assets\

# Fix permissions
chmod -R 755 assets/
```

## 📱 Mobile Access

### 1. Mobile-Responsive Design
- Dashboard automatically adapts to mobile screens
- Touch-friendly interface
- Responsive navigation

### 2. PWA (Progressive Web App)
```html
<!-- Add to index.html -->
<link rel="manifest" href="/manifest.json">
<meta name="theme-color" content="#4e73df">
```

### 3. Mobile Testing
```bash
# Test on different devices
# Use browser developer tools
# Chrome DevTools -> Toggle Device Toolbar
```

## 🎯 Production Checklist

### Before Deployment
- [ ] Update configuration for production
- [ ] Set up SSL/TLS certificate
- [ ] Configure firewall rules
- [ ] Set up monitoring and logging
- [ ] Create backup strategy
- [ ] Test all functionality
- [ ] Optimize static assets
- [ ] Set up error handling

### After Deployment
- [ ] Verify all endpoints work
- [ ] Test authentication system
- [ ] Check performance metrics
- [ ] Validate security settings
- [ ] Monitor server logs
- [ ] Set up automated backups
- [ ] Document deployment process

---

**Deployment Status**: ✅ **READY FOR PRODUCTION**

For support, check the [README.md](README.md) file or create an issue.
