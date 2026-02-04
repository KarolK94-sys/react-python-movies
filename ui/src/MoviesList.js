import MovieListItem from "./MovieListItem";

export default function MoviesList(props) {
    return <div>
        <h2>🎥 Movies ({props.movies.length})</h2>
        <div className="movies-list">
            {props.movies.map(movie => (
                <MovieListItem 
                    key={movie.id} 
                    movie={movie} 
                    onDelete={() => props.onDeleteMovie(movie)}
                />
            ))}
        </div>
    </div>;
}
