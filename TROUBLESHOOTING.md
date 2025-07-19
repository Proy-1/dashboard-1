# 🔧 Troubleshooting Guide

## 🚨 Common Problems & Solutions

### 1. Server Won't Start

#### Problem: "Port already in use"
```
Error: listen tcp :8080: bind: address already in use
```

**Solutions:**
```bash
# Windows
netstat -ano | findstr :8080
taskkill /PID <PID> /F

# Linux/Mac
lsof -i :8080
kill -9 <PID>

# Use different port
go run server.go -port=3000
```

#### Problem: "Permission denied"
```
Error: listen tcp :8080: bind: permission denied
```

**Solutions:**
```bash
# Use port > 1024
go run server.go -port=8080

# Or run with elevated privileges
sudo go run server.go -port=80
```

#### Problem: "Go command not found"
```
Error: 'go' is not recognized as an internal or external command
```

**Solutions:**
```bash
# Install Go from https://golang.org/dl/
# Add Go to PATH environment variable

# Windows
setx PATH "%PATH%;C:\Go\bin"

# Linux/Mac
export PATH=$PATH:/usr/local/go/bin
```

### 2. Authentication Issues

#### Problem: "Login not working"
**Symptoms:**
- No alert on wrong credentials
- Page refreshes without response
- Console errors

**Solutions:**
```javascript
// Check browser console (F12)
// Look for these errors:

// 1. Network errors
fetch('http://localhost:8080/api/login', ...)
// Solution: Make sure server is running

// 2. CORS errors
Access to fetch at 'http://localhost:8080/api/login' from origin 'null' has been blocked by CORS policy
// Solution: Already handled in server.go

// 3. Config errors
Cannot read property 'API_BASE_URL' of undefined
// Solution: Check config.js is loaded properly
```

**Debug Steps:**
```javascript
// 1. Test API directly
fetch('http://localhost:8080/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: 'admin', password: 'admin' })
})
.then(response => response.json())
.then(data => console.log(data));

// 2. Check localStorage
console.log(localStorage.getItem('userSession'));

// 3. Test with default credentials
Username: admin
Password: admin
```

#### Problem: "Registration not working"
**Symptoms:**
- Form submits but no response
- User not created
- Server errors

**Solutions:**
```javascript
// Check if API endpoint is correct
console.log('API URL:', BACKEND_CONFIG.API_BASE_URL + '/api/register');

// Test password strength
// Password must be at least 8 characters
// Include uppercase, lowercase, number, special character

// Check form validation
const form = document.getElementById('registerForm');
console.log('Form valid:', form.checkValidity());
```

### 3. File Loading Issues

#### Problem: "CSS not loading"
**Symptoms:**
- Page appears unstyled
- Missing fonts or icons
- Layout broken

**Solutions:**
```html
<!-- Check file paths in HTML -->
<link rel="stylesheet" href="assets/css/dashboard.css">
<link rel="stylesheet" href="assets/css/login.css">

<!-- Check if files exist -->
<!-- Open browser Network tab (F12) -->
<!-- Look for 404 errors -->
```

**Debug Steps:**
```bash
# Check file structure
ls -la assets/css/
dir assets\css\

# Check file permissions
chmod -R 755 assets/

# Test direct file access
http://localhost:8080/assets/css/dashboard.css
```

#### Problem: "JavaScript not loading"
**Symptoms:**
- Interactive features not working
- Console errors
- Functions undefined

**Solutions:**
```html
<!-- Check script tags -->
<script src="assets/js/config.js"></script>
<script src="assets/js/api-service.js"></script>
<script src="assets/js/admin-script-tailwind.js"></script>

<!-- Check loading order -->
<!-- config.js must load first -->
<!-- api-service.js must load before admin-script-tailwind.js -->
```

### 4. API Connection Issues

#### Problem: "API not responding"
**Symptoms:**
- Network timeout errors
- 500 server errors
- No response from server

**Solutions:**
```javascript
// 1. Check server status
fetch('http://localhost:8080/health')
.then(response => console.log('Server status:', response.status));

// 2. Check API endpoints
const testEndpoints = [
    '/api/login',
    '/api/register', 
    '/api/users'
];

testEndpoints.forEach(endpoint => {
    fetch('http://localhost:8080' + endpoint)
    .then(response => console.log(endpoint, response.status))
    .catch(error => console.error(endpoint, error));
});

// 3. Check request format
const validRequest = {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({
        username: 'admin',
        password: 'admin'
    })
};
```

#### Problem: "CORS errors"
**Symptoms:**
- Cross-origin request blocked
- Preflight request failed
- Access control errors

**Solutions:**
```go
// Already handled in server.go
func enableCORS(w http.ResponseWriter, r *http.Request) {
    w.Header().Set("Access-Control-Allow-Origin", "*")
    w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
    w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
    
    if r.Method == "OPTIONS" {
        w.WriteHeader(http.StatusOK)
        return
    }
}
```

### 5. Browser-Specific Issues

#### Problem: "Not working in Internet Explorer"
**Solutions:**
```javascript
// Replace modern JavaScript with IE-compatible code
// Use fetch polyfill
// Use Promise polyfill
// Avoid arrow functions
// Use var instead of let/const
```

#### Problem: "Safari caching issues"
**Solutions:**
```javascript
// Add cache-busting parameters
const timestamp = Date.now();
fetch(`/api/login?_=${timestamp}`, ...)

// Or use no-cache headers
fetch('/api/login', {
    cache: 'no-cache',
    headers: {
        'Cache-Control': 'no-cache'
    }
})
```

### 6. Mobile Issues

#### Problem: "Mobile layout broken"
**Solutions:**
```css
/* Check viewport meta tag */
<meta name="viewport" content="width=device-width, initial-scale=1.0">

/* Check responsive CSS */
@media (max-width: 768px) {
    .sidebar {
        transform: translateX(-100%);
    }
}
```

#### Problem: "Touch events not working"
**Solutions:**
```javascript
// Add touch event listeners
element.addEventListener('touchstart', handleTouch, false);
element.addEventListener('touchmove', handleTouch, false);
element.addEventListener('touchend', handleTouch, false);

// Or use click events (work on touch devices)
element.addEventListener('click', handleClick);
```

## 🔍 Debug Tools

### 1. Browser Developer Tools
```javascript
// Open with F12 or right-click -> Inspect

// Console tab - Check for errors
console.log('Debug info');
console.error('Error message');

// Network tab - Check API calls
// Look for failed requests (red)
// Check request/response headers

// Elements tab - Check HTML structure
// Verify CSS is applied
// Check element styles

// Application tab - Check localStorage
localStorage.getItem('userSession');
```

### 2. Server Logging
```go
// Add to server.go
import "log"

func main() {
    log.SetFlags(log.LstdFlags | log.Lshortfile)
    log.Println("Server starting...")
    
    // Log all requests
    http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
        log.Printf("%s %s %s", r.Method, r.URL.Path, r.RemoteAddr)
        // ... rest of handler
    })
}
```

### 3. API Testing Tools
```javascript
// Built-in test page
// Open: http://localhost:8080/api-test.html

// Manual API testing
// Use Postman, curl, or browser fetch

// Test login
curl -X POST http://localhost:8080/api/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin"}'

// Test register
curl -X POST http://localhost:8080/api/register \
  -H "Content-Type: application/json" \
  -d '{"username":"newuser","password":"password123"}'
```

## 📱 Mobile Debugging

### 1. Remote Debugging
```javascript
// Chrome DevTools for Android
// chrome://inspect/#devices

// Safari Web Inspector for iOS
// Settings -> Safari -> Advanced -> Web Inspector
```

### 2. Console Logging
```javascript
// Add visual console for mobile
function mobileLog(message) {
    const logDiv = document.getElementById('mobile-log') || 
                  document.createElement('div');
    logDiv.id = 'mobile-log';
    logDiv.style.cssText = `
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        background: black;
        color: white;
        padding: 10px;
        z-index: 9999;
        font-size: 12px;
        max-height: 200px;
        overflow-y: auto;
    `;
    logDiv.innerHTML += message + '<br>';
    document.body.appendChild(logDiv);
}

// Use instead of console.log
mobileLog('Debug message');
```

## 🔧 Performance Issues

### 1. Slow Loading
**Solutions:**
```javascript
// Optimize images
// Use WebP format where possible
// Compress CSS/JS files
// Enable gzip compression

// Lazy load non-critical resources
const script = document.createElement('script');
script.src = 'non-critical.js';
script.async = true;
document.head.appendChild(script);
```

### 2. Memory Issues
**Solutions:**
```javascript
// Remove event listeners
element.removeEventListener('click', handler);

// Clear intervals/timeouts
clearInterval(intervalId);
clearTimeout(timeoutId);

// Remove DOM references
element = null;
```

### 3. CPU Usage
**Solutions:**
```javascript
// Use requestAnimationFrame for animations
function animate() {
    // Animation code
    requestAnimationFrame(animate);
}

// Debounce frequent events
function debounce(func, delay) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), delay);
    };
}

const debouncedHandler = debounce(handleInput, 300);
```

## 🛠️ Advanced Debugging

### 1. Error Boundaries
```javascript
window.addEventListener('error', function(event) {
    console.error('Global error:', event.error);
    // Log error to server
    fetch('/api/error', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            message: event.error.message,
            stack: event.error.stack,
            url: window.location.href
        })
    });
});
```

### 2. Performance Monitoring
```javascript
// Measure page load time
window.addEventListener('load', function() {
    const loadTime = performance.now();
    console.log('Page loaded in:', loadTime, 'ms');
});

// Measure API response time
const startTime = performance.now();
fetch('/api/users')
.then(response => {
    const endTime = performance.now();
    console.log('API call took:', endTime - startTime, 'ms');
});
```

### 3. Memory Monitoring
```javascript
// Check memory usage
if (performance.memory) {
    console.log('Memory usage:', {
        used: performance.memory.usedJSHeapSize,
        total: performance.memory.totalJSHeapSize,
        limit: performance.memory.jsHeapSizeLimit
    });
}
```

## 🆘 Getting Help

### 1. Documentation
- [README.md](README.md) - Project overview
- [DEVELOPMENT.md](DEVELOPMENT.md) - Development notes
- [DEPLOYMENT.md](DEPLOYMENT.md) - Deployment guide

### 2. Error Reporting
When reporting issues, include:
- Browser version and OS
- Complete error message
- Steps to reproduce
- Expected vs actual behavior
- Console logs
- Network request/response

### 3. Community Support
- GitHub Issues (if applicable)
- Stack Overflow
- Go community forums
- Web development communities

---

**Quick Fix Checklist:**
1. ✅ Server running on correct port
2. ✅ All files in correct locations
3. ✅ Browser console clear of errors
4. ✅ API endpoints responding
5. ✅ Authentication working
6. ✅ Static files loading
7. ✅ Mobile responsive
8. ✅ Cross-browser compatible
