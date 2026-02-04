import {useState, useEffect} from "react";

export default function MovieForm(props) {
    const [title, setTitle] = useState('');
    const [year, setYear] = useState('');
    const [director, setDirector] = useState('');
    const [description, setDescription] = useState('');
    const [actors, setActors] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Jeśli edytujemy film, uzupełnij formularz
    useEffect(() => {
        if (props.initialMovie) {
            setTitle(props.initialMovie.title);
            setYear(props.initialMovie.year);
            setDirector(props.initialMovie.director || '');
            setDescription(props.initialMovie.description || '');
            setActors(props.initialMovie.actors || '');
        }
    }, [props.initialMovie]);

    function addMovie(event) {
        event.preventDefault();
        
        if (title.trim().length < 3) {
            alert('❌ Title must contain at least 3 characters');
            return;
        }
        
        if (!year || isNaN(year) || year < 1800 || year > 2100) {
            alert('❌ Year must be a valid number between 1800 and 2100');
            return;
        }

        setIsSubmitting(true);
        props.onMovieSubmit({
            title: title.trim(), 
            year: parseInt(year), 
            director: director.trim(), 
            description: description.trim(),
            actors: actors.trim()
        });
        
        // Reset formularza tylko jeśli nie edytujemy
        if (!props.initialMovie) {
            setTitle('');
            setYear('');
            setDirector('');
            setDescription('');
            setActors('');
        }
        setIsSubmitting(false);
    }

    return <form onSubmit={addMovie} className="movie-form">
        <div>
            <label>Title * <span style={{fontSize: '0.8em', color: '#999'}}>(required)</span></label>
            <input 
                type="text" 
                value={title} 
                onChange={(event) => setTitle(event.target.value)}
                placeholder="e.g., The Matrix"
                disabled={isSubmitting}
            />
        </div>
        <div>
            <label>Year * <span style={{fontSize: '0.8em', color: '#999'}}>(required)</span></label>
            <input 
                type="number" 
                value={year} 
                onChange={(event) => setYear(event.target.value)}
                placeholder="e.g., 1999"
                disabled={isSubmitting}
                min="1800"
                max="2100"
            />
        </div>
        <div>
            <label>Director</label>
            <input 
                type="text" 
                value={director} 
                onChange={(event) => setDirector(event.target.value)}
                placeholder="e.g., Lana Wachowski"
                disabled={isSubmitting}
            />
        </div>
        <div>
            <label>Actors <span style={{fontSize: '0.8em', color: '#999'}}>(comma separated)</span></label>
            <input 
                type="text"
                value={actors}
                onChange={(event) => setActors(event.target.value)}
                placeholder="e.g., Keanu Reeves, Laurence Fishburne"
                disabled={isSubmitting}
            />
        </div>
        <div>
            <label>Description</label>
            <textarea 
                value={description} 
                onChange={(event) => setDescription(event.target.value)}
                placeholder="Write a description..."
                disabled={isSubmitting}
                rows="4"
            />
        </div>
        <div className="form-actions">
            <button type="submit" disabled={isSubmitting} className="btn-primary">
                {isSubmitting ? '⏳ Processing...' : (props.buttonLabel || '✅ Submit')}
            </button>
            {props.onCancel && <button 
                type="button" 
                onClick={props.onCancel}
                disabled={isSubmitting}
                className="btn-secondary"
            >
                ✖️ Cancel
            </button>}
        </div>
    </form>;
}
