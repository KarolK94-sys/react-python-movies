# 🎬 DOKUMENTACJA APLIKACJI MOVIEDB

## Kompletny Przewodnik Techniczny

---

## SPIS TREŚCI
1. Wprowadzenie - co to jest aplikacja
2. Architektura - jak to działa
3. Backend - serwer FastAPI
4. Frontend - interfejs React
5. Baza danych - SQLite
6. Funkcje kluczowe - dodawanie/usuwanie/aktorzy
7. Jak uruchomić lokalnie
8. Deployment
9. Słownik techniczny

---

## 1. WPROWADZENIE - CO TO JEST

**React-Python Movies** to nowoczesna aplikacja webowa do zarządzania kolekcją filmów.

### Co robi aplikacja?
- ✅ Pozwala dodawać nowe filmy do bazy danych
- ✅ Wyświetla listę wszystkich filmów
- ✅ Umożliwia usuwanie filmów
- ✅ Pozwala edytować istniejące filmy
- ✅ Obsługuje aktorów (można dodać wielu aktorów do jednego filmu)
- ✅ Wyszukuje filmy po tytule, reżyserii, aktorach, opisie
- ✅ Wyświetla powiadomienia o akcjach (dodano, usunięto, itp.)

### Gdzie działa?
- **Localhost**: http://localhost:3000 (do testowania)
- **Online**: https://react-python-movies-varw.onrender.com (producja)

---

## 2. ARCHITEKTURA - JAK TO DZIAŁA

Aplikacja ma architekturę **CLIENT-SERVER**:

```
┌─────────────────────────────────────────────────────────────┐
│                    FRONTEND (React)                         │
│              Interfejs użytkownika - GUI                    │
│  - Formularz dodawania filmów                              │
│  - Lista wyświetlanych filmów                              │
│  - Wyszukiwarka                                             │
│  - Przyciski edycji i usuwania                             │
└──────────────────────┬──────────────────────────────────────┘
                       │ HTTP Requests
                       │ JSON (wysyłanie danych)
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                  BACKEND (FastAPI)                          │
│              Serwer - logika aplikacji                      │
│  - Odbiera żądania z frontendu                             │
│  - Przetwarza dane                                          │
│  - Komunikuje się z bazą danych                            │
│  - Wysyła odpowiedzi do frontendu                          │
└──────────────────────┬──────────────────────────────────────┘
                       │ SQL Queries
                       │ (pobieranie/dodawanie danych)
                       ▼
┌─────────────────────────────────────────────────────────────┐
│              BAZA DANYCH (SQLite)                           │
│              Przechowywanie filmów                          │
│  - Tabela "movies" z wszystkimi danymi                     │
└─────────────────────────────────────────────────────────────┘
```

### Przepływ danych - przykład "Dodanie nowego filmu"

```
1. UŻYTKOWNIK wpisuje film w formularzu
   ↓
2. FRONTEND (React) zbiera dane
   ↓
3. FRONTEND wysyła HTTP POST do backendu
   ↓
4. BACKEND (FastAPI) otrzymuje dane
   ↓
5. BACKEND waliduje (sprawdza czy poprawne)
   ↓
6. BACKEND zapisuje w bazie danych (SQLite)
   ↓
7. BACKEND wysyła potwierdzenie do frontendu
   ↓
8. FRONTEND wyświetla powiadomienie "Film dodany!"
   ↓
9. FRONTEND aktualizuje listę filmów
```

---

## 3. BACKEND - SERWER FASTAPI

### Czym jest FastAPI?
FastAPI to nowoczesny framework Pythona do budowania API (interfejsów). 
API = Application Programming Interface = sposób komunikacji programów.

**Język**: Python 3.9+
**Port**: 8000 (http://localhost:8000)

### Jak działa Backend?

Backend czeka na żądania z frontendu. Żądania to:
- **GET** - pobierz dane (lista filmów)
- **POST** - dodaj nowe dane (nowy film)
- **PUT** - zmień istniejące dane (edycja filmu)
- **DELETE** - usuń dane (usunięcie filmu)

### Główny plik: `api/main.py`

```python
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import sqlite3

app = FastAPI()

# CORS - pozwala komunikacji frontend ↔ backend
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"])
```

**Co to CORS?** 
- CORS = Cross-Origin Resource Sharing
- Bez CORS, frontend nie może rozmawiać z backendem
- To mechanizm bezpieczeństwa przeglądarki

---

### ENDPOINT 1: Pobieranie filmów (GET /movies)

```python
@app.get('/movies')
def get_movies(search: str = ""):
    db = sqlite3.connect('movies.db')
    cursor = db.cursor()
    
    # Jeśli jest wyszukiwanie, filtruj
    if search:
        query = '''
            SELECT * FROM movies 
            WHERE title LIKE ? OR director LIKE ? OR actors LIKE ?
        '''
        search_term = f"%{search}%"
        movies = cursor.execute(query, (search_term, search_term, search_term))
    else:
        movies = cursor.execute('SELECT * FROM movies')
    
    output = []
    for movie in movies:
        output.append({
            'id': movie[0],
            'title': movie[1],
            'year': movie[2],
            'director': movie[3],
            'description': movie[4],
            'actors': movie[5]
        })
    
    db.close()
    return output
```

**Co robi?**
1. Łączy się z bazą danych
2. Jeśli jest szukanie - filtruje po tytule, reżyserii, aktorach
3. Pobiera wszystkie filmy
4. Konwertuje na format JSON
5. Wysyła do frontendu

**Przykład requestu**: 
```
GET http://localhost:8000/movies
GET http://localhost:8000/movies?search=Matrix
```

---

### ENDPOINT 2: Dodawanie filmu (POST /movies)

```python
@app.post("/movies")
def add_movie(movie: Movie):
    db = sqlite3.connect('movies.db')
    cursor = db.cursor()
    
    # Wstaw nowy film do bazy
    cursor.execute(
        "INSERT INTO movies (title, year, director, description, actors) 
         VALUES (?, ?, ?, ?, ?)",
        (movie.title, movie.year, movie.director, movie.description, movie.actors)
    )
    
    db.commit()
    movie_id = cursor.lastrowid  # Pobierz ID nowo dodanego filmu
    db.close()
    
    return {
        "message": "Movie added successfully",
        "id": movie_id,
        "movie": { ... }
    }
```

**Co robi?**
1. Otrzymuje dane nowego filmu z frontendu
2. Wstawia do bazy danych (INSERT)
3. Zatwierdza transakcję (COMMIT)
4. Zwraca ID nowego filmu
5. Wysyła potwierdzenie do frontendu

**Bezpieczeństwo**: Używamy `?` (placeholders) zamiast formatowania stringów!
- ❌ ZŁE:   `f"INSERT VALUES ('{title}', ...)"` - podatne na SQL Injection
- ✅ DOBRE: `"INSERT VALUES (?, ...)", (title, ...)`  - bezpieczne

---

### ENDPOINT 3: Usuwanie filmu (DELETE /movies/{movie_id})

```python
@app.delete("/movies/{movie_id}")
def delete_movie(movie_id: int):
    db = sqlite3.connect('movies.db')
    cursor = db.cursor()
    
    # Usuń film o danym ID
    cursor.execute("DELETE FROM movies WHERE id = ?", (movie_id,))
    
    db.commit()
    
    if cursor.rowcount == 0:
        db.close()
        raise HTTPException(status_code=404, detail="Film nie znaleziony")
    
    db.close()
    return {"message": f"Film o ID {movie_id} usunięty"}
```

**Co robi?**
1. Otrzymuje ID filmu do usunięcia
2. Usuwa z bazy (DELETE)
3. Jeśli film nie istnieje - zwraca błąd 404
4. Zwraca potwierdzenie usunięcia

**Przykład requestu**:
```
DELETE http://localhost:8000/movies/5
```

---

### ENDPOINT 4: Edycja filmu (PUT /movies/{movie_id})

```python
@app.put("/movies/{movie_id}")
def update_movie(movie_id: int, movie: Movie):
    db = sqlite3.connect('movies.db')
    cursor = db.cursor()
    
    # Zaktualizuj film
    cursor.execute(
        "UPDATE movies SET title = ?, year = ?, director = ?, 
         description = ?, actors = ? WHERE id = ?",
        (movie.title, movie.year, movie.director, 
         movie.description, movie.actors, movie_id)
    )
    
    db.commit()
    
    if cursor.rowcount == 0:
        db.close()
        raise HTTPException(status_code=404, detail="Film nie znaleziony")
    
    db.close()
    return {"message": f"Film o ID {movie_id} zaktualizowany"}
```

**Co robi?**
1. Otrzymuje ID filmu i nowe dane
2. Aktualizuje film w bazie (UPDATE)
3. Zwraca potwierdzenie

---

### Model danych: klasa Movie

```python
from pydantic import BaseModel

class Movie(BaseModel):
    title: str              # Tekst - wymagane
    year: int              # Liczba - wymagane
    director: str = ""     # Tekst - opcjonalne
    description: str = ""  # Tekst - opcjonalne
    actors: str = ""       # Tekst - opcjonalne (comma-separated)
```

**Pydantic** - biblioteka do walidacji danych
- Sprawdza czy dane są poprawnego typu
- Jeśli `title` będzie liczbą zamiast tekstu - zwróci błąd

---

## 4. FRONTEND - INTERFEJS REACT

### Czym jest React?
React to biblioteka JavaScriptu do budowania interfejsów użytkownika.
- Renderuje komponenty (części interfejsu)
- Aktualizuje widok gdy zmienią się dane
- Wysyła żądania do backendu

**Port**: 3000 (http://localhost:3000)

### Główny plik: `ui/src/App.js`

```javascript
import {useState, useEffect} from "react";
import { ToastContainer, toast } from 'react-toastify';

function App() {
    const [movies, setMovies] = useState([]);      // Przechowuje listę filmów
    const [searchTerm, setSearchTerm] = useState(""); // Szukany tekst
    const [addingMovie, setAddingMovie] = useState(false); // Czy pokazać formularz
    const [editingMovie, setEditingMovie] = useState(null); // Edytowany film
    
    // Pobierz filmy gdy komponent się załaduje
    useEffect(() => {
        fetchMovies();
    }, []);
    
    // Pobierz filmy z backendu
    async function fetchMovies() {
        const response = await fetch('/movies');
        const data = await response.json();
        setMovies(data);
    }
    
    // Dodaj nowy film
    async function handleAddMovie(movie) {
        const response = await fetch('/movies', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(movie)
        });
        
        if (response.ok) {
            const data = await response.json();
            setMovies([...movies, data.movie]);
            toast.success('🎬 Film dodany!');
        } else {
            toast.error('❌ Błąd przy dodawaniu');
        }
    }
    
    // Usuń film
    async function handleDeleteMovie(movie) {
        const response = await fetch(`/movies/${movie.id}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            setMovies(movies.filter(m => m.id !== movie.id));
            toast.success('🗑️ Film usunięty!');
        }
    }
    
    return (
        <div>
            <header>
                <h1>🎬 Moje Ulubione Filmy</h1>
            </header>
            
            <main>
                {/* Wyszukiwarka */}
                <input 
                    placeholder="🔍 Szukaj..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                
                {/* Lista filmów */}
                <MoviesList movies={movies} />
                
                {/* Przycisk dodawania */}
                <button onClick={() => setAddingMovie(true)}>
                    ➕ Dodaj film
                </button>
                
                {/* Formularz */}
                {addingMovie && (
                    <MovieForm onSubmit={handleAddMovie} />
                )}
            </main>
        </div>
    );
}

export default App;
```

### Komponenty (budujące bloki)

**1. MovieForm.js** - Formularz do dodawania/edycji

```javascript
import {useState} from "react";

export default function MovieForm({initialMovie, onSubmit}) {
    const [title, setTitle] = useState(initialMovie?.title || '');
    const [year, setYear] = useState(initialMovie?.year || '');
    const [director, setDirector] = useState(initialMovie?.director || '');
    const [actors, setActors] = useState(initialMovie?.actors || '');
    const [description, setDescription] = useState(initialMovie?.description || '');
    
    function handleSubmit(e) {
        e.preventDefault();
        
        // Walidacja
        if (title.length < 3) {
            alert('Tytuł musi mieć co najmniej 3 znaki!');
            return;
        }
        
        if (!year || year < 1800 || year > 2100) {
            alert('Rok musi być między 1800 a 2100!');
            return;
        }
        
        // Wyślij dane
        onSubmit({
            title,
            year: parseInt(year),
            director,
            actors,
            description
        });
    }
    
    return (
        <form onSubmit={handleSubmit}>
            <input 
                placeholder="Tytuł"
                value={title}
                onChange={e => setTitle(e.target.value)}
            />
            
            <input 
                type="number"
                placeholder="Rok"
                value={year}
                onChange={e => setYear(e.target.value)}
            />
            
            <input 
                placeholder="Reżyser"
                value={director}
                onChange={e => setDirector(e.target.value)}
            />
            
            <input 
                placeholder="Aktorzy (oddzieleni przecinkami)"
                value={actors}
                onChange={e => setActors(e.target.value)}
            />
            
            <textarea 
                placeholder="Opis"
                value={description}
                onChange={e => setDescription(e.target.value)}
            />
            
            <button type="submit">✅ Dodaj</button>
        </form>
    );
}
```

**Co robi?**
- Tworzy formularz z polami
- Waliduje dane (sprawdza czy poprawne)
- Wysyła dane do funkcji `onSubmit`

**Walidacja:**
- ✅ Tytuł: minimum 3 znaki
- ✅ Rok: liczba między 1800 a 2100
- ✅ Aktorzy: oddzieleni przecinkami

---

**2. MoviesList.js** - Lista filmów

```javascript
import MovieListItem from "./MovieListItem";

export default function MoviesList({movies}) {
    return (
        <div>
            <h2>🎥 Moja kolekcja ({movies.length} filmów)</h2>
            <div className="movies-grid">
                {movies.map(movie => (
                    <MovieListItem 
                        key={movie.id} 
                        movie={movie}
                    />
                ))}
            </div>
        </div>
    );
}
```

**Co robi?**
- Przyjmuje tablicę filmów
- Wyświetla każdy film jako `MovieListItem`
- `.map()` = pętla przez wszystkie filmy

---

**3. MovieListItem.js** - Karta pojedynczego filmu

```javascript
export default function MovieListItem({movie, onDelete, onEdit}) {
    return (
        <div className="movie-card">
            <h3>{movie.title}</h3>
            
            <p className="year">📅 {movie.year}</p>
            
            {movie.director && (
                <p>🎬 Reżyser: {movie.director}</p>
            )}
            
            {movie.actors && (
                <p>🎭 Aktorzy: {movie.actors}</p>
            )}
            
            {movie.description && (
                <p className="description">{movie.description}</p>
            )}
            
            <button onClick={() => onEdit(movie)}>✏️ Edytuj</button>
            <button onClick={() => onDelete(movie)}>🗑️ Usuń</button>
        </div>
    );
}
```

**Co robi?**
- Wyświetla informacje o jednym filmie
- Pokazuje przyciski edycji i usuwania
- Warunkowo wyświetla opcjonalne pola (reżyser, aktorzy, opis)

---

### Stan (State) w React

**Co to?** State to dane które mogą się zmienić.

```javascript
const [movies, setMovies] = useState([]);
```

- `movies` = aktualna wartość
- `setMovies` = funkcja żeby zmienić wartość
- `useState([])` = wartość początkowa (pusta tablica)

**Przykład:**
```javascript
// Dodaj film do listy
setMovies([...movies, newMovie]);

// Usuń film z listy
setMovies(movies.filter(m => m.id !== movieIdToDelete));

// Aktualizuj film
setMovies(movies.map(m => m.id === movieToUpdate.id ? movieToUpdate : m));
```

---

### Hooki React

**useEffect** - Uruchom kod w określonym momencie

```javascript
useEffect(() => {
    fetchMovies(); // Pobierz filmy
}, []); // [] = uruchom raz przy załadowaniu
```

**useState** - Przechowaj stan

```javascript
const [searchTerm, setSearchTerm] = useState("");
```

---

## 5. BAZA DANYCH - SQLITE

### Czym jest SQLite?
SQLite to lekka baza danych oparta na plikach (nie wymaga serwera).
- Plik: `api/movies.db`
- Zawiera tabelę "movies"

### Struktura tabeli

```
movies
├── id (INTEGER) - unikalny numer, auto-inkrementujący
├── title (TEXT) - nazwa filmu
├── year (INTEGER) - rok wydania
├── director (TEXT) - reżyser
├── description (TEXT) - opis fabułki
└── actors (TEXT) - aktorzy (rozdzieleni przecinkami)
```

### Przykładowe dane

| id | title | year | director | actors | description |
|----|-------|------|----------|--------|-------------|
| 1 | The Matrix | 1999 | Lana Wachowski | Keanu Reeves, Laurence Fishburne | A hacker discovers reality is a simulation |
| 2 | Inception | 2010 | Christopher Nolan | Leonardo DiCaprio, Ellen Page | A thief who steals corporate secrets |

### SQL Queries

**Pobierz wszystkie filmy**
```sql
SELECT * FROM movies
```

**Pobierz konkretny film**
```sql
SELECT * FROM movies WHERE id = 1
```

**Szukaj filmów**
```sql
SELECT * FROM movies 
WHERE title LIKE '%Matrix%' 
   OR actors LIKE '%Reeves%'
```

**Dodaj film**
```sql
INSERT INTO movies (title, year, director, actors, description)
VALUES ('The Matrix', 1999, 'Lana Wachowski', 'Keanu Reeves', '...')
```

**Edytuj film**
```sql
UPDATE movies 
SET title = 'New Title', year = 2020
WHERE id = 1
```

**Usuń film**
```sql
DELETE FROM movies WHERE id = 1
```

---

## 6. FUNKCJE KLUCZOWE

### FUNKCJA 1: Dodawanie filmów

**Jak to działa?**

```
1. Użytkownik wpisuje dane w formularzu
   │
   ├─ Tytuł: "The Matrix"
   ├─ Rok: 1999
   ├─ Reżyser: "Lana Wachowski"
   ├─ Aktorzy: "Keanu Reeves, Laurence Fishburne"
   └─ Opis: "..."
   
2. Frontend waliduje dane:
   ✅ Tytuł ma co najmniej 3 znaki
   ✅ Rok jest między 1800 a 2100
   
3. Frontend wysyła POST do backendu:
   POST /movies
   {
       "title": "The Matrix",
       "year": 1999,
       "director": "Lana Wachowski",
       "actors": "Keanu Reeves, Laurence Fishburne",
       "description": "..."
   }
   
4. Backend odbiera dane
   
5. Backend waliduje dane (zabezpieczenie)
   
6. Backend wysyła SQL:
   INSERT INTO movies (title, year, director, actors, description)
   VALUES ('The Matrix', 1999, '...', '...', '...')
   
7. Baza danych dodaje film
   
8. Backend wysyła odpowiedź:
   {"message": "Film dodany!", "id": 123}
   
9. Frontend otrzymuje odpowiedź
   
10. Frontend dodaje film do listy:
    setMovies([...movies, newMovie])
    
11. Frontend wyświetla powiadomienie:
    toast.success("🎬 Film dodany!")
    
12. Ekran aktualizuje się - widać nowy film
```

**Kod React (dodawanie):**
```javascript
async function handleAddMovie(movie) {
    const response = await fetch('/movies', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(movie)
    });
    
    if (response.ok) {
        const data = await response.json();
        setMovies([...movies, data.movie]); // Dodaj do listy
        toast.success('🎬 Film dodany!');
    }
}
```

**Kod Python (backend):**
```python
@app.post("/movies")
def add_movie(movie: Movie):
    db = sqlite3.connect('movies.db')
    cursor = db.cursor()
    
    cursor.execute(
        "INSERT INTO movies (title, year, director, actors, description) 
         VALUES (?, ?, ?, ?, ?)",
        (movie.title, movie.year, movie.director, movie.actors, movie.description)
    )
    
    db.commit()
    return {"message": "Film dodany!"}
```

---

### FUNKCJA 2: Usuwanie filmów

**Jak to działa?**

```
1. Użytkownik klika przycisk "Usuń" przy filmie
   
2. Frontend prosi o potwierdzenie:
   "Czy na pewno chcesz usunąć 'The Matrix'?"
   
3. Użytkownik potwierdza
   
4. Frontend wysyła DELETE do backendu:
   DELETE /movies/1
   (gdzie 1 to ID filmu)
   
5. Backend odbiera żądanie usunięcia
   
6. Backend wysyła SQL:
   DELETE FROM movies WHERE id = 1
   
7. Baza danych usuwa film
   
8. Backend wysyła potwierdzenie:
   {"message": "Film usunięty!"}
   
9. Frontend otrzymuje potwierdzenie
   
10. Frontend usuwa film z listy:
    setMovies(movies.filter(m => m.id !== 1))
    
11. Frontend wyświetla powiadomienie:
    toast.success("🗑️ Film usunięty!")
    
12. Ekran aktualizuje się - filmu już nie ma
```

**Kod React (usuwanie):**
```javascript
async function handleDeleteMovie(movie) {
    if (!window.confirm(`Usunąć "${movie.title}"?`)) {
        return; // Anuluj
    }
    
    const response = await fetch(`/movies/${movie.id}`, {
        method: 'DELETE'
    });
    
    if (response.ok) {
        setMovies(movies.filter(m => m.id !== movie.id)); // Usuń z listy
        toast.success('🗑️ Film usunięty!');
    }
}
```

**Kod Python (backend):**
```python
@app.delete("/movies/{movie_id}")
def delete_movie(movie_id: int):
    db = sqlite3.connect('movies.db')
    cursor = db.cursor()
    
    cursor.execute("DELETE FROM movies WHERE id = ?", (movie_id,))
    
    db.commit()
    
    if cursor.rowcount == 0:
        raise HTTPException(status_code=404, detail="Film nie znaleziony")
    
    return {"message": "Film usunięty!"}
```

---

### FUNKCJA 3: Obsługa aktorów

**Co to znaczy?**
- Każdy film ma wielu aktorów
- Aktorzy są przechowywani jako tekst rozdzielony przecinkami
- Format: "Imię1 Nazwisko1, Imię2 Nazwisko2, ..."

**Przykład:**
```
"Keanu Reeves, Laurence Fishburne, Carrie-Anne Moss"
```

**W formularzu:**
```javascript
<input 
    placeholder="Aktorzy (oddzieleni przecinkami)"
    value={actors}
    onChange={e => setActors(e.target.value)}
/>
```

**W bazie danych:**
```
Kolumna "actors" przechowuje to jako zwykły tekst:
"Keanu Reeves, Laurence Fishburne, Carrie-Anne Moss"
```

**W wyświetlaniu:**
```javascript
<p>🎭 Aktorzy: {movie.actors}</p>
```

**W wyszukiwaniu:**
```sql
SELECT * FROM movies WHERE actors LIKE '%Keanu%'
```

**Dodawanie aktorów do nowego filmu:**
```python
# Frontend wysyła:
{
    "title": "The Matrix",
    "actors": "Keanu Reeves, Laurence Fishburne"
}

# Backend zapisuje do bazy:
INSERT INTO movies (..., actors)
VALUES (..., 'Keanu Reeves, Laurence Fishburne')
```

---

## 7. JAK URUCHOMIĆ LOKALNIE

### Wymagania
- Python 3.9+
- Node.js 18+
- Git

### Krok 1: Pobierz kod

```bash
git clone https://github.com/KarolK94-sys/react-python-movies
cd react-python-movies
```

### Krok 2: Uruchom backend

```bash
cd api
pip install -r requirements.txt
fastapi dev main.py
```

Backend będzie dostępny na: **http://localhost:8000**

### Krok 3: Uruchom frontend (nowy terminal)

```bash
cd ui
npm install
npm start
```

Frontend będzie dostępny na: **http://localhost:3000**

### Testowanie

1. Wejdź na http://localhost:3000
2. Kliknij "Dodaj film"
3. Wpisz dane
4. Kliknij "Dodaj"
5. Powinno się pojawić powiadomienie: "🎬 Film dodany!"
6. Film powinien się pojawić na liście

---

## 8. DEPLOYMENT NA RENDER.COM

### Krok 1: Przygotowanie na GitHub

```bash
git add .
git commit -m "Aplikacja ready do deploymentu"
git push origin main
```

### Krok 2: Render.com

1. Wejdź na https://render.com
2. Zaloguj się (GitHub)
3. Kliknij **"New +"** → **"Web Service"**
4. Wybierz: **KarolK94-sys/react-python-movies**
5. Uzupełnij:
   - **Name**: `react-python-movies`
   - **Region**: `Oregon`
   - **Environment**: `Docker`
   - **Branch**: `main`
6. Kliknij **"Create Web Service"**
7. Czekaj ~10 minut

### URL aplikacji
Po deploymencie będzie dostępna na:
```
https://react-python-movies-[kod].onrender.com
```

---

## 9. SŁOWNIK TECHNICZNY

### Frontend / Backend
- **Frontend** = Interfejs użytkownika (to co widzi)
- **Backend** = Serwer, logika, baza danych

### HTTP Metody
- **GET** = Pobierz dane
- **POST** = Dodaj dane
- **PUT** = Zmień dane
- **DELETE** = Usuń dane

### JSON
- Format danych: `{"klucz": "wartość"}`
- Przykład: `{"title": "The Matrix", "year": 1999}`

### API
- Application Programming Interface
- Sposób komunikacji aplikacji
- Zbiór endpointów (URL-ów)

### React
- Biblioteka do tworzenia UI
- Komponenty = części interfejsu
- State = zmienne które mogą się zmienić

### FastAPI
- Framework Pythona do tworzenia API
- Szybki, nowoczesny
- Wymagania: Python 3.6+

### SQLite
- Baza danych
- Plik `movies.db`
- Przechowuje dane

### CORS
- Cross-Origin Resource Sharing
- Pozwala na komunikację frontend ↔ backend
- Bez tego przeglądarza blokuje żądania

### SQL Injection
- Atak polegający na wstawieniu kodu SQL
- Bezpieczeństwo: używać placeholders `?`

### Parameteryzowane Queries
- Bezpieczny sposób na budowanie zapytań SQL
- `"SELECT * FROM users WHERE id = ?", (user_id,)`

### Toast / Notyfikacje
- Małe powiadomienia w rogu ekranu
- Informacja o wykonanej akcji
- Biblioteka: `react-toastify`

### Deployment
- Publikacja aplikacji online
- Render.com = darmowa usługa

### Docker
- Konteneryzacja aplikacji
- Pakowacie całe otoczenie (Python, Node, etc.)
- Plik: `Dockerfile`

---

## PODSUMOWANIE

### Architektura
```
FRONTEND (React) ↔ BACKEND (FastAPI) ↔ BAZA (SQLite)
```

### Operacje
- **Dodaj** → POST /movies
- **Wyświetl** → GET /movies
- **Usuń** → DELETE /movies/{id}
- **Edytuj** → PUT /movies/{id}

### Dane filmu
```javascript
{
    id: 1,                              // Unikalny ID
    title: "The Matrix",                // Nazwa
    year: 1999,                         // Rok
    director: "Lana Wachowski",         // Reżyser
    actors: "Keanu Reeves, ...",       // Aktorzy
    description: "A hacker discovers..." // Opis
}
```

### Bezpieczeństwo
- ✅ Walidacja danych (frontend + backend)
- ✅ Parameteryzowane SQL queries
- ✅ CORS configured
- ✅ Error handling

### Funkcje
- ✅ Dodawanie filmów
- ✅ Usuwanie filmów
- ✅ Edycja filmów
- ✅ Wyszukiwarka
- ✅ Obsługa aktorów
- ✅ Notyfikacje
- ✅ Responsive design

---

**Dokumentacja przygotowana dla celów edukacyjnych**
**Przedmiot**: Technologia Aplikacji Internetowych
**Uniwersytet**: AGH
**Data**: Luty 2026
