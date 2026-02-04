# 🎬 React-Python Movies Application

A modern full-stack movie database application with a beautiful React frontend and FastAPI backend. Manage your favorite movies with features like search, edit, and actor management.

## ✨ Features

### Core Features (Grade 3.0)
- ✅ Add movies to the database
- ✅ Delete movies from the list
- ✅ Display movies in real-time

### Extended Features (Grade 4.0+)
- ✅ **Actors Management** - Add comma-separated actors to each film
- ✅ **Edit Functionality** - Update movie details anytime
- ✅ **Search & Filter** - Find movies by title, director, actors, or description
- ✅ **Toast Notifications** - Real-time feedback on actions
- ✅ **Modern UI** - Beautiful gradient design with smooth animations
- ✅ **Responsive Design** - Works perfectly on mobile, tablet, and desktop

### Bonus Features (Grade 5.0)
- 🎨 **Beautiful Animations** - Smooth transitions and hover effects
- 🔍 **Advanced Search** - Real-time filtering across all fields
- 📱 **Fully Responsive** - Mobile-first design
- 🎭 **Actor Support** - Manage multiple actors per film
- ✏️ **Full CRUD** - Create, Read, Update, Delete operations
- 🛡️ **Error Handling** - Graceful error management
- 🔐 **SQL Injection Prevention** - Parameterized queries

## 🚀 Tech Stack

### Frontend
- React 18.3
- React-Toastify (notifications)
- Milligram CSS Framework
- Modern CSS with Flexbox & Grid

### Backend
- FastAPI
- SQLite3
- Python 3.9+
- CORS support

## 📋 Prerequisites

- Node.js 18+
- Python 3.9+
- npm or yarn
- Docker (for containerized deployment)

## 🔧 Local Development

### Backend Setup
```bash
cd api
pip install -r requirements.txt
fastapi dev main.py
```
Backend runs on `http://localhost:8000`

### Frontend Setup (in new terminal)
```bash
cd ui
npm install
npm start
```
Frontend runs on `http://localhost:3000`

## 🐳 Docker Deployment

### Build and Run Locally
```bash
docker build -t react-python-movies .
docker run -p 8000:80 react-python-movies
```
App runs on `http://localhost:8000`

## 🌐 Deploy to Render.com

1. **Fork this repository** on GitHub
2. **Go to [render.com](https://render.com)**
3. **Create new Web Service**
4. **Connect your GitHub repository**
5. **Configure:**
   - Build Command: `bash build.sh`
   - Start Command: `uvicorn api.main:app --port 80 --host 0.0.0.0`
   - Environment: Docker
6. **Deploy!**

## 📊 API Endpoints

### Movies
- `GET /movies` - Get all movies (supports ?search=query)
- `GET /movies/{id}` - Get single movie
- `POST /movies` - Add new movie
- `PUT /movies/{id}` - Update movie
- `DELETE /movies/{id}` - Delete movie
- `DELETE /movies` - Delete all movies

### Search
- `GET /search?q=query` - Full-text search

### Frontend Static
- `GET /` - Serves React app
- `GET /static/*` - Serves static assets

## 📦 Project Structure

```
react-python-movies/
├── api/
│   ├── main.py           # FastAPI application
│   ├── requirements.txt   # Python dependencies
│   ├── movies.db        # SQLite database
│   └── test_main.http   # HTTP test file
├── ui/
│   ├── src/
│   │   ├── App.js       # Main React component
│   │   ├── MovieForm.js # Form component
│   │   ├── MoviesList.js # List display
│   │   ├── MovieListItem.js # Card component
│   │   └── App.css      # Styling
│   ├── package.json
│   └── public/
├── Dockerfile           # Container configuration
├── build.sh            # Build script
└── README.md           # This file
```

## 🎬 Database Schema

### Movies Table
```sql
CREATE TABLE movies (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    year INTEGER,
    director TEXT,
    description TEXT,
    actors TEXT
);
```

## 🎨 Design Features

- **Color Scheme**: Purple/Blue gradient (#667eea to #764ba2)
- **Typography**: Clean, modern sans-serif
- **Layout**: Responsive grid system
- **Animations**: Smooth transitions and micro-interactions
- **Accessibility**: High contrast, readable fonts

## 🧪 Testing

Use the included `api/test_main.http` file with VS Code REST Client extension or tools like:
- Postman
- Insomnia
- curl

Example:
```bash
# Get all movies
curl http://localhost:8000/movies

# Search movies
curl "http://localhost:8000/search?q=Matrix"

# Add movie
curl -X POST http://localhost:8000/movies \
  -H "Content-Type: application/json" \
  -d '{"title":"The Matrix","year":1999,"director":"Lana Wachowski","actors":"Keanu Reeves","description":"A computer hacker learns about the true nature of reality"}'
```

## 🐛 Troubleshooting

### "Connection refused" on localhost:3000
- Check if frontend is running: `npm start` in `/ui`

### "Connection refused" on localhost:8000
- Check if backend is running: `fastapi dev main.py` in `/api`

### Database errors
- Ensure `movies.db` exists in `/api`
- Check file permissions

### Build fails on Render
- Check `build.sh` has correct paths
- Verify `package.json` has all dependencies
- Check logs on Render dashboard

## 📝 Grade Rubric

| Grade | Requirements |
|-------|--------------|
| **3.0** | Add & delete movies ✅ |
| **4.0** | + Actor management ✅ |
| **5.0** | + Search, Edit, UI/UX, Animations ✅ |

## 👨‍💻 Author

**Karol Kempski**  
AGH University of Science and Technology  
Web Application Technology Course

## 📄 License

MIT License - Feel free to use this project for educational purposes.

---

**🎯 Live Demo:** [Deployed on Render.com]  
**📚 Repository:** [GitHub](https://github.com/KarolK94-sys/react-python-movies)

Made with ❤️ for learning full-stack web development
