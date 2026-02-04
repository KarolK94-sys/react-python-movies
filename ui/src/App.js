import './App.css';
import {useState, useEffect} from "react";
import "milligram";
import MovieForm from "./MovieForm";
import MoviesList from "./MoviesList";

function App() {
    const [movies, setMovies] = useState([]);
    const [addingMovie, setAddingMovie] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Pobierz filmy przy ładowaniu komponentu
    useEffect(() => {
        const fetchMovies = async () => {
            try {
                setLoading(true);
                const response = await fetch('/movies');
                if (!response.ok) {
                    throw new Error('Błąd przy pobieraniu filmów');
                }
                const data = await response.json();
                setMovies(data);
                setError(null);
            } catch (err) {
                setError(err.message);
                console.error('Fetch error:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchMovies();
    }, []);

    // Dodaj film do backendu
    async function handleAddMovie(movie) {
        try {
            const response = await fetch('/movies', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(movie)
            });

            if (!response.ok) {
                throw new Error('Błąd przy dodawaniu filmu');
            }

            const data = await response.json();
            setMovies([...movies, data.movie]);
            setAddingMovie(false);
            setError(null);
        } catch (err) {
            setError(err.message);
            console.error('Add error:', err);
        }
    }

    // Usuń film z backendu
    async function handleDeleteMovie(movie) {
        try {
            const response = await fetch(`/movies/${movie.id}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                throw new Error('Błąd przy usuwaniu filmu');
            }

            setMovies(movies.filter(m => m.id !== movie.id));
            setError(null);
        } catch (err) {
            setError(err.message);
            console.error('Delete error:', err);
        }
    }

    return (
        <div className="container">
            <header>
                <h1>🎬 My favourite movies to watch</h1>
            </header>
            <main>
                {error && <div className="error-message" style={{color: 'red', padding: '10px', marginBottom: '10px'}}>{error}</div>}
                
                {loading 
                    ? <p>Loading...</p>
                    : movies.length === 0
                        ? <p>No movies yet. Maybe add something?</p>
                        : <MoviesList movies={movies}
                                      onDeleteMovie={handleDeleteMovie}
                        />}
                
                {addingMovie
                    ? <MovieForm onMovieSubmit={handleAddMovie}
                                 onCancel={() => setAddingMovie(false)}
                                 buttonLabel="Add a movie"
                        />
                    : <button onClick={() => setAddingMovie(true)}>➕ Add a movie</button>}
            </main>
        </div>
    );
}

export default App;
