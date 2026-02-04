export default function MovieListItem(props) {
    const [isDeleting, setIsDeleting] = useState(false);
    
    async function handleDelete() {
        if (window.confirm(`Are you sure you want to delete "${props.movie.title}"?`)) {
            setIsDeleting(true);
            await props.onDelete();
            setIsDeleting(false);
        }
    }

    return (
        <div style={{marginBottom: '15px', padding: '10px', border: '1px solid #ddd', borderRadius: '4px'}}>
            <div>
                <strong>{props.movie.title}</strong>
                {' '}
                <span style={{color: '#666'}}>({props.movie.year})</span>
                {props.movie.director && (
                    <>
                        {' '}
                        <br />
                        directed by <em>{props.movie.director}</em>
                    </>
                )}
            </div>
            {props.movie.description && (
                <p style={{margin: '5px 0', fontSize: '0.95em', color: '#555'}}>
                    {props.movie.description}
                </p>
            )}
            <button 
                onClick={handleDelete}
                disabled={isDeleting}
                style={{
                    background: '#c0392b', 
                    color: 'white',
                    padding: '5px 10px',
                    fontSize: '0.9em',
                    cursor: isDeleting ? 'not-allowed' : 'pointer'
                }}
            >
                {isDeleting ? 'Deleting...' : '🗑️ Delete'}
            </button>
        </div>
    );
}

import {useState} from "react";
