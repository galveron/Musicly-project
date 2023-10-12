import SongCard from '../components/SongCard';
import { Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import PlaylistSection from '../components/PlaylistSection';

import { useState, useEffect } from 'react';
import { useGlobalContext } from '../Views/Layout';

function Favorites() {
    const [user, setUser] = useState(Cookies.get('username'));
    const [favoriteSongs, setFavoriteSongs] = useState(null);
    const [playlists, setPlaylists] = useState(null);
    const [favoriteAlbums, setFavoriteAlbums] = useState(null);
    const [favoriteArtists, setFavoriteArtists] = useState(null);
    const [removed, setRemoved] = useState(false);

    useEffect(() => {
        const fetchFavoriteSongs = async () => {
            const response = await fetch(`http://localhost:3000/api/v1/${user}/favoriteSongs`);
            const data = await response.json();
            setFavoriteSongs(data);

            let allPlaylists = [];
            for (let song of data) {
                allPlaylists.push(song.playlist);
            }

            if (allPlaylists.length > 0) {
                const uniquePlaylists = [...new Set(allPlaylists)];
                setPlaylists(uniquePlaylists)
            }
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
            {playlists?.length > 0 ? playlists.map(playlist => <PlaylistSection key={playlist} name={playlist} songs={favoriteSongs.filter(song => song.playlist === playlist)} setPlaySong={setPlaySong} removed={removed} setRemoved={setRemoved} />) : null }
        </section>
    )
        : (
            <section>
                <Navigate to='/login' replace={true} />
            </section>
        )
};

export default Favorites;
