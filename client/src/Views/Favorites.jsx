import SongCard from '../components/SongCard';
import ArtistCard from '../components/ArtistCard';
import AlbumCard from '../components/AlbumCard';
import { Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import AudioPlayer from '../components/AudioPlayer';
import PlaylistSection from '../components/PlaylistSection';

import { useState, useEffect } from 'react';

function Favorites() {
    const [user, setUser] = useState(Cookies.get('username'))
    const [favoriteSongs, setFavoriteSongs] = useState(null);
    const [playlists, setPlaylists] = useState(null);
    const [favoriteAlbums, setFavoriteAlbums] = useState(null);
    const [favoriteArtists, setFavoriteArtists] = useState(null);
    const [playSong, setPlaySong] = useState(null)
    const [removed, setRemoved] = useState(false);
    const [currentPlaylist, setCurrentPlaylist] = useState([{src: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview112/v4/fa/c6/23/fac62369-02ae-6451-1942-76f38e2a61b0/mzaf_1964475913263690754.plus.aac.p.m4a", name: "Doja"},{src: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview123/v4/6b/0b/21/6b0b219c-8f51-95cb-3e8f-11492d521421/mzaf_5836981206976882775.plus.aac.ep.m4a", name:"Woman"}])

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
        }

        const fetchFavoriteAlbums = async () => {
            const response = await fetch(`http://localhost:3000/api/v1/${user}/favoriteAlbums`);
            const data = await response.json();
            setFavoriteAlbums(data);
        }

        const fetchFavoriteArtists = async () => {
            const response = await fetch(`http://localhost:3000/api/v1/${user}/favoriteArtists`);
            const data = await response.json();
            setFavoriteArtists(data);
        }

        fetchFavoriteSongs();
        fetchFavoriteAlbums();
        fetchFavoriteArtists();

    }, [user, removed]);

    return user ? (
        <section id='section' className='col'>
            {playlists?.length > 0 ? playlists.map(playlist => <PlaylistSection key={playlist} name={playlist} songs={favoriteSongs.filter(song => song.playlist === playlist)} setPlaySong={setPlaySong} removed={removed} setRemoved={setRemoved} />) : null }
                <section id="audioplayer" className='row'>
                    <AudioPlayer tracks={currentPlaylist} />
                </section>
        </section>
    )
        : (
            <section>
                <Navigate to='/login' replace={true} />
            </section>
        )
}

export default Favorites;
