# Aplikacja React-Python Movies

Nowoczesna aplikacja webowa do zarządzania bazą filmów. Połączenie frontend'u React z backend'iem FastAPI. Umożliwia dodawanie, usuwanie, edycję filmów oraz zarządzanie aktorami.

## Stos technologiczny

### Frontend
- React 18.3
- React-Toastify (powiadomienia)
- Milligram CSS Framework
- CSS z Flexbox i Grid

### Backend
- FastAPI
- SQLite3
- Python 3.9+
- Obsługa CORS

## Wymagania

- Node.js 18+
- Python 3.9+
- npm lub yarn
- Docker (do deployment'u w kontenerze)

## Uruchomienie lokalnie

### Setup Backend

```bash
cd api
pip install -r requirements.txt
fastapi dev main.py
```

Backend dostępny na: http://localhost:8000

### Setup Frontend (w nowym terminalu)

```bash
cd ui
npm install
npm start
```

Frontend dostępny na: http://localhost:3000

Uwaga: Backend musi być uruchomiony, aby frontend mógł pobierać dane.

## Deployment za pomocą Docker

### Budowanie i uruchamianie lokalnie

```bash
docker build -t react-python-movies .
docker run -p 8000:80 react-python-movies
```

Aplikacja dostępna na: http://localhost:8000

## Deployment na Render.com

### Krok 1: Przygotowanie repozytorium

Upewnij się, że wszystkie zmiany są zacommitowane i spushowane do GitHub.

```bash
git add .
git commit -m "Aplikacja gotowa do deploymentu"
git push origin main
```

### Krok 2: Wdrożenie na Render

1. Wejdź na https://render.com
2. Zaloguj się lub utwórz konto
3. Kliknij "New+" a następnie "Web Service"
4. Wybierz swoje repozytorium (react-python-movies)
5. Skonfiguruj następujące parametry:
   - Name: react-python-movies
   - Region: Oregon (darmowy tier)
   - Environment: Docker
   - Branch: main
6. Kliknij "Create Web Service"
7. Czekaj około 10 minut na zbudowanie i deployment

Po ukończeniu deployment'u aplikacja będzie dostępna pod adresem:
```
https://react-python-movies-[kod].onrender.com
```

## Endpointy API

### Filmy
- GET /movies - Pobierz wszystkie filmy (obsługuje parametr ?search=szukany_tekst)
- GET /movies/{id} - Pobierz konkretny film
- POST /movies - Dodaj nowy film
- PUT /movies/{id} - Edytuj film
- DELETE /movies/{id} - Usuń film
- DELETE /movies - Usuń wszystkie filmy

### Wyszukiwanie
- GET /search?q=szukany_tekst - Wyszukaj filmy

### Pliki statyczne Frontend
- GET / - Serwuje aplikację React
- GET /static/* - Serwuje zasoby statyczne

## Struktura projektu

```
react-python-movies/
├── api/
│   ├── main.py                 # Aplikacja FastAPI
│   ├── requirements.txt         # Zależności Python
│   ├── movies.db               # Baza danych SQLite
│   ├── check_schema.py          # Skrypt sprawdzający schemat
│   ├── migrate_db.py            # Skrypt migracji bazy
│   └── test_main.http           # Plik do testowania API
├── ui/
│   ├── src/
│   │   ├── App.js               # Główny komponent React
│   │   ├── MovieForm.js         # Komponent formularza
│   │   ├── MoviesList.js        # Komponent listy filmów
│   │   ├── MovieListItem.js     # Komponent karty filmu
│   │   └── App.css              # Style aplikacji
│   ├── package.json
│   └── public/
│       ├── index.html           # Główny plik HTML
│       └── manifest.json
├── Dockerfile                   # Konfiguracja kontenera Docker
├── build.sh                     # Skrypt budowania
├── DOKUMENTACJA.md              # Dokumentacja techniczna
└── README.md                    # Informacje o projekcie
```

## Schemat bazy danych

### Tabela movies

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

### Pola

| Pole | Typ | Opis |
|------|-----|------|
| id | INTEGER | Unikalny identyfikator (auto-inkrementacja) |
| title | TEXT | Nazwa filmu (wymagane) |
| year | INTEGER | Rok wydania |
| director | TEXT | Imię i nazwisko reżysera |
| description | TEXT | Opis fabułki |
| actors | TEXT | Aktorzy (rozdzieleni przecinkami) |

## Testowanie aplikacji

### Lokalnie
1. Otwórz http://localhost:3000
2. Kliknij przycisk "Dodaj film"
3. Wypełnij formularz danymi
4. Kliknij przycisk dodawania
5. Powinno wyświetlić się powiadomienie o pomyślnym dodaniu
6. Film powinien pojawić się na liście

### Online
Odwiedź: https://react-python-movies-varw.onrender.com

## Rozwiązywanie problemów

### Frontend nie wyświetla filmów

Przyczyna: Backend nie jest uruchomiony

Rozwiązanie: Upewnij się, że terminal z backendem działa
```bash
cd api
fastapi dev main.py
```

### Błąd "Connection refused"

Przyczyna: Port jest już zajęty lub usługa nie słucha

Rozwiązanie: Zmień port lub zabij proces na danym porcie

### Build nie powiódł się na Render

Przyczyna: Brak zależności lub błąd w konfiguracji

Rozwiązanie: Sprawdź logi na dashboard Render.com i upewnij się, że:
- package.json zawiera wszystkie zależności
- Dockerfile jest poprawny
- requirements.txt zawiera właściwe wersje pakietów

## Notki deweloperskie

### Bezpieczeństwo
- Wszystkie zapytania do bazy danych używają parametryzowanych zapytań
- Frontend waliduje dane przed wysłaniem do backendu
- Backend dodatkowo waliduje wszystkie dane wejściowe

### Performance
- SQLite jest wystarczająco wydajny dla aplikacji edukacyjnej
- Dla większych aplikacji rozważ migrację na PostgreSQL
- Wyszukiwanie wykorzystuje LIKE, dla dużych zbiorów danych rozważ full-text search

### Rozszerzalność
- Architektura umożliwia łatwe dodanie autoryzacji
- Można rozszerzyć o inne zasoby (reżyserzy, gatunki, itp.)
- Frontend jest modularny - łatwo dodać nowe komponenty

## Szybki start

```bash
# Sklonuj repozytorium
git clone https://github.com/KarolK94-sys/react-python-movies
cd react-python-movies

# Terminal 1 - Backend
cd api
pip install -r requirements.txt
fastapi dev main.py

# Terminal 2 - Frontend
cd ui
npm install
npm start

# Aplikacja będzie dostępna na http://localhost:3000
```

## Licencja

MIT License - do użytku edukacyjnego

## Autor

Karol Kempski
Uniwersytet AGH w Krakowie
Przedmiot: Technologia Aplikacji Internetowych
