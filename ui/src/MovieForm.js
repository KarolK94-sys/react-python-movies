import {useState} from "react";

export default function MovieForm(props) {
    const [title, setTitle] = useState('');
    const [year, setYear] = useState('');
    const [director, setDirector] = useState('');
    const [description, setDescription] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    function addMovie(event) {
        event.preventDefault();
        
        if (title.length < 3) {
            return alert('Tytuł musi zawierać co najmniej 3 znaki');
        }
        
        if (!year || isNaN(year)) {
            return alert('Rok musi być liczbą');
        }

        setIsSubmitting(true);
        props.onMovieSubmit({title, year: parseInt(year), director, description});
        
        setTitle('');
        setYear('');
        setDirector('');
        setDescription('');
        setIsSubmitting(false);
    }

    return <form onSubmit={addMovie}>
        <h2>Add a new movie</h2>
        <div>
            <label>Title *</label>
            <input 
                type="text" 
                value={title} 
                onChange={(event) => setTitle(event.target.value)}
                placeholder="e.g., The Matrix"
                disabled={isSubmitting}
            />
        </div>
        <div>
            <label>Year *</label>
            <input 
                type="number" 
                value={year} 
                onChange={(event) => setYear(event.target.value)}
                placeholder="e.g., 1999"
                disabled={isSubmitting}
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
            <label>Description</label>
            <textarea 
                value={description} 
                onChange={(event) => setDescription(event.target.value)}
                placeholder="Write a description..."
                disabled={isSubmitting}
            />
        </div>
        <button disabled={isSubmitting}>
            {isSubmitting ? 'Adding...' : (props.buttonLabel || 'Submit')}
        </button>
        {props.onCancel && <button 
            type="button" 
            onClick={props.onCancel}
            disabled={isSubmitting}
            style={{marginLeft: '10px'}}
        >
            Cancel
        </button>}
    </form>;
}
