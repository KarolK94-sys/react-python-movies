import {useState} from "react";

export default function MovieListItem(props) {
    const [isDeleting, setIsDeleting] = useState(false);
    
    async function handleDelete() {
        if (window.confirm(`🤔 Are you sure you want to delete "${props.movie.title}"?`)) {
            setIsDeleting(true);
            await props.onDelete();
            setIsDeleting(false);
        }
    }

    return (
        <div className="movie-card">
            <div className="movie-header">
                <div>
                    <h3>{props.movie.title}</h3>
                    <p className="movie-year">📅 {props.movie.year}</p>
                </div>
            </div>
            
            {props.movie.director && (
                <p className="movie-director">
                    <strong>🎬 Director:</strong> {props.movie.director}
                </p>
            )}
            
            {props.movie.actors && (
                <p className="movie-actors">
                    <strong>🎭 Actors:</strong> {props.movie.actors}
                </p>
            )}
            
            {props.movie.description && (
                <p className="movie-description">
                    {props.movie.description}
                </p>
            )}
            
            <div className="movie-actions">
                <button 
                    onClick={() => props.onEditMovie(props.movie)}
                    className="btn-edit"
                >
                    ✏️ Edit
                </button>
                <button 
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="btn-delete"
                >
                    {isDeleting ? '⏳ Deleting...' : '🗑️ Delete'}
                </button>
            </div>
        </div>
    );
}
