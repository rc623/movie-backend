export default function MovieCard({ movie, onFavorite }) {
    const { Title, Year, Poster, imdbID } = movie;

    return (
        <div className="border rounded p-4 shadow">
            <img src={Poster} alt={Title} className="w-32 h-48 object-cover mb-2" />
            <h3 className="font-bold">{Title}</h3>
            <p>{Year}</p>
            <button
                className="bg-green-500 text-white px-2 py-1 rounded mt-2"
                onClick={() => onFavorite({ imdbID, title: Title, year: Year, poster: Poster })}
            >
                Add to Favorites
            </button>
        </div>
    );
}
