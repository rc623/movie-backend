export default function Favorites({ favorites }) {
    return (
        <div className="mt-6">
            <h2 className="text-xl mb-2">Your Favorites</h2>
            <div className="grid grid-cols-3 gap-4">
                {favorites.map((fav) => (
                    <div key={fav.imdbID} className="border rounded p-2 shadow">
                        <img src={fav.poster} alt={fav.title} className="w-32 h-48 object-cover mb-1" />
                        <h3 className="font-bold">{fav.title}</h3>
                        <p>{fav.year}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
