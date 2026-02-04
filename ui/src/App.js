import './App.css';
import {useState, useEffect} from "react";
import "milligram";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import MovieForm from "./MovieForm";
import MoviesList from "./MoviesList";

function App() {
    const [movies, setMovies] = useState([]);
    const [filteredMovies, setFilteredMovies] = useState([]);
    const [addingMovie, setAddingMovie] = useState(false);
    const [editingMovie, setEditingMovie] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");

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
                setFilteredMovies(data);
                setError(null);
            } catch (err) {
                setError(err.message);
                toast.error('Failed to load movies');
            } finally {
                setLoading(false);
            }
        };

        fetchMovies();
    }, []);

    // Filtruj filmy podczas wyszukiwania
    useEffect(() => {
        if (searchTerm.trim() === "") {
            setFilteredMovies(movies);
        } else {
            const term = searchTerm.toLowerCase();
            const filtered = movies.filter(movie =>
                movie.title.toLowerCase().includes(term) ||
                movie.director.toLowerCase().includes(term) ||
                movie.actors.toLowerCase().includes(term) ||
                movie.description.toLowerCase().includes(term)
            );
            setFilteredMovies(filtered);
        }
    }, [searchTerm, movies]);

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
            toast.success('🎬 Movie added successfully!');
        } catch (err) {
            setError(err.message);
            toast.error('Failed to add movie');
        }
    }

    // Edytuj film
    async function handleEditMovie(movie) {
        try {
            const response = await fetch(`/movies/${movie.id}`, {
                method: 'PUT',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(movie)
            });

            if (!response.ok) {
                throw new Error('Błąd przy edycji filmu');
            }

            setMovies(movies.map(m => m.id === movie.id ? movie : m));
            setEditingMovie(null);
            setError(null);
            toast.success('✏️ Movie updated successfully!');
        } catch (err) {
            setError(err.message);
            toast.error('Failed to update movie');
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
            toast.success('🗑️ Movie deleted successfully!');
        } catch (err) {
            setError(err.message);
            toast.error('Failed to delete movie');
        }
    }

    return (
        <div className="container">
            <header>
                <h1>🎬 My Favorite Movies</h1>
                <p>Discover, manage and share your favorite films</p>
            </header>
            
            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={true}
            />
            
            <main>
                {error && <div className="error-message">⚠️ {error}</div>}
                
                <div className="search-section">
                    <input
                        type="text"
                        placeholder="🔍 Search by title, director, actors or description..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-input"
                    />
                </div>
                
                {loading 
                    ? <div className="loading">Loading movies...</div>
                    : filteredMovies.length === 0 && searchTerm === ""
                        ? <div className="empty-state">
                            <p>🎞️ No movies yet</p>
                            <p>Add your first movie to get started!</p>
                          </div>
                        : filteredMovies.length === 0
                            ? <div className="empty-state">
                                <p>🔍 No movies found for "{searchTerm}"</p>
                              </div>
                            : <MoviesList 
                                movies={filteredMovies}
                                onDeleteMovie={handleDeleteMovie}
                                onEditMovie={setEditingMovie}
                            />}
                
                {editingMovie
                    ? <>
                        <h2>Edit Movie</h2>
                        <MovieForm 
                            initialMovie={editingMovie}
                            onMovieSubmit={(movie) => {
                                handleEditMovie({...movie, id: editingMovie.id});
                            }}
                            onCancel={() => setEditingMovie(null)}
                            buttonLabel="Update movie"
                        />
                    </>
                    : addingMovie
                        ? <>
                            <h2>Add New Movie</h2>
                            <MovieForm 
                                onMovieSubmit={handleAddMovie}
                                onCancel={() => setAddingMovie(false)}
                                buttonLabel="Add a movie"
                            />
                        </>
                        : <button className="add-btn" onClick={() => setAddingMovie(true)}>
                            ➕ Add a new movie
                        </button>
                }
            </main>
        </div>
    );
}

export default App;
