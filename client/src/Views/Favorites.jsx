import SongCard from '../components/SongCard';
import { Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { useState, useEffect } from 'react';
import { useGlobalContext } from '../Views/Layout';

function Favorites() {
    const [user, setUser] = useState(Cookies.get('username'));
    const [favoriteSongs, setFavoriteSongs] = useState(null);
    const [favoriteAlbums, setFavoriteAlbums] = useState(null);
    const [favoriteArtists, setFavoriteArtists] = useState(null);
    const [removed, setRemoved] = useState(false);

    useEffect(() => {
        const fetchFavoriteSongs = async () => {
            const response = await fetch(`http://localhost:3000/api/v1/${user}/favoriteSongs`);
            const data = await response.json();
            setFavoriteSongs(data);
        };

        const fetchFavoriteAlbums = async () => {
            const response = await fetch(`http://localhost:3000/api/v1/${user}/favoriteAlbums`);
            const data = await response.json();
            setFavoriteAlbums(data);
        };

        const fetchFavoriteArtists = async () => {
            const response = await fetch(`http://localhost:3000/api/v1/${user}/favoriteArtists`);
            const data = await response.json();
            setFavoriteArtists(data);
        };

        fetchFavoriteSongs();
        fetchFavoriteAlbums();
        fetchFavoriteArtists();

    }, [user, removed]);

    return user ? (
        <section id='section' className='col'>
            <h2>Favorite songs: </h2>
            <div className='favorite-songs category'>{favoriteSongs && favoriteSongs.map(song =>
                <SongCard key={song.key} song={song} removed={removed} setRemoved={setRemoved} />)}
            </div>
            {/* <h4>Favorite albums: </h4>
            <div className='favorite-albums category'>{favoriteAlbums && favoriteAlbums.map(album => <AlbumCard key={album.id} album={album} />)}</div>
            <h4>Favorite artists: </h4>
            <div className='favorite-artists category'>{favoriteArtists && favoriteArtists.map(artist => <ArtistCard key={artist.id} artist={artist} />)}</div> */}
        </section>
    )
        : (
            <section>
                <Navigate to='/login' replace={true} />
            </section>
        )
};

export default Favorites;
