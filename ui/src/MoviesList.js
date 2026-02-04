import MovieListItem from "./MovieListItem";

export default function MoviesList(props) {
    return <div className="movies-container">
        <h2>🎥 Your Collection ({props.movies.length} {props.movies.length === 1 ? 'movie' : 'movies'})</h2>
        <div className="movies-grid">
            {props.movies.map(movie => (
                <MovieListItem 
                    key={movie.id} 
                    movie={movie} 
                    onDelete={() => props.onDeleteMovie(movie)}
                    onEditMovie={props.onEditMovie}
                />
            ))}
        </div>
    </div>;
}
