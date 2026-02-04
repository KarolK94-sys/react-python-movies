from fastapi import FastAPI, Body, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel
from typing import Any
import sqlite3


class Movie(BaseModel):
    title: str
    year: int
    director: str = ""
    description: str = ""
    actors: str = ""

app = FastAPI()

# CORS - umożliwia komunikację frontendu z backendem
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/static", StaticFiles(directory="../ui/build/static", check_dir=False), name="static")

@app.get("/")
def serve_react_app():
   return FileResponse("../ui/build/index.html")

@app.get('/movies')
def get_movies(search: str = ""):
    try:
        db = sqlite3.connect('movies.db')
        cursor = db.cursor()
        
        if search:
            query = '''
                SELECT * FROM movies 
                WHERE title LIKE ? OR director LIKE ? OR actors LIKE ? OR description LIKE ?
            '''
            search_term = f"%{search}%"
            movies = cursor.execute(query, (search_term, search_term, search_term, search_term))
        else:
            movies = cursor.execute('SELECT * FROM movies')

        output = []
        for movie in movies:
            movie_dict = {
                'id': movie[0], 
                'title': movie[1], 
                'year': movie[2], 
                'director': movie[3] if len(movie) > 3 else "",
                'description': movie[4] if len(movie) > 4 else "",
                'actors': movie[5] if len(movie) > 5 else ""
            }
            output.append(movie_dict)
        db.close()
        return output
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get('/movies/{movie_id}')
def get_single_movie(movie_id: int):
    try:
        db = sqlite3.connect('movies.db')
        cursor = db.cursor()
        movie = cursor.execute("SELECT * FROM movies WHERE id = ?", (movie_id,)).fetchone()
        db.close()
        
        if movie is None:
            raise HTTPException(status_code=404, detail="Movie not found")
        
        return {
            'id': movie[0],
            'title': movie[1], 
            'year': movie[2], 
            'director': movie[3] if len(movie) > 3 else "",
            'description': movie[4] if len(movie) > 4 else "",
            'actors': movie[5] if len(movie) > 5 else ""
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/movies")
def add_movie(movie: Movie):
    try:
        db = sqlite3.connect('movies.db')
        cursor = db.cursor()
        cursor.execute(
            "INSERT INTO movies (title, year, director, description, actors) VALUES (?, ?, ?, ?, ?)",
            (movie.title, movie.year, movie.director, movie.description, movie.actors)
        )
        db.commit()
        movie_id = cursor.lastrowid
        db.close()
        
        return {
            "message": f"Movie added successfully",
            "id": movie_id,
            "movie": {
                "id": movie_id,
                "title": movie.title,
                "year": movie.year,
                "director": movie.director,
                "description": movie.description,
                "actors": movie.actors
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.put("/movies/{movie_id}")
def update_movie(movie_id: int, movie: Movie):
    try:
        db = sqlite3.connect('movies.db')
        cursor = db.cursor()
        cursor.execute(
            "UPDATE movies SET title = ?, year = ?, director = ?, description = ?, actors = ? WHERE id = ?",
            (movie.title, movie.year, movie.director, movie.description, movie.actors, movie_id)
        )
        db.commit()
        
        if cursor.rowcount == 0:
            db.close()
            raise HTTPException(status_code=404, detail=f"Movie with id = {movie_id} not found")
        
        db.close()
        return {"message": f"Movie with id = {movie_id} updated successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.delete("/movies/{movie_id}")
def delete_movie(movie_id: int):
    try:
        db = sqlite3.connect('movies.db')
        cursor = db.cursor()
        cursor.execute("DELETE FROM movies WHERE id = ?", (movie_id,))
        db.commit()
        
        if cursor.rowcount == 0:
            db.close()
            raise HTTPException(status_code=404, detail=f"Movie with id = {movie_id} not found")
        
        db.close()
        return {"message": f"Movie with id = {movie_id} deleted successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.delete("/movies")
def delete_all_movies():
    try:
        db = sqlite3.connect('movies.db')
        cursor = db.cursor()
        cursor.execute("DELETE FROM movies")
        db.commit()
        count = cursor.rowcount
        db.close()
        return {"message": f"Deleted {count} movies"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/search")
def search_movies(q: str):
    """Wyszukaj filmy po tytule, reżyserie, aktorach lub opisie"""
    try:
        db = sqlite3.connect('movies.db')
        cursor = db.cursor()
        search_term = f"%{q}%"
        cursor.execute(
            """SELECT * FROM movies 
               WHERE title LIKE ? OR director LIKE ? OR actors LIKE ? OR description LIKE ?
               ORDER BY title ASC""",
            (search_term, search_term, search_term, search_term)
        )
        
        output = []
        for movie in cursor.fetchall():
            output.append({
                'id': movie[0],
                'title': movie[1],
                'year': movie[2],
                'director': movie[3] if len(movie) > 3 else "",
                'description': movie[4] if len(movie) > 4 else "",
                'actors': movie[5] if len(movie) > 5 else ""
            })
        db.close()
        return output
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# if __name__ == '__main__':
#     app.run()
