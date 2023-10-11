import SongCard from '../components/SongCard';
import ArtistCard from '../components/ArtistCard';
import AlbumCard from '../components/AlbumCard';
import { Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import AudioPlayer from '../components/AudioPlayer';

import { useState, useEffect } from 'react';

function Favorites() {
    const [user, setUser] = useState(Cookies.get('username'))
    const [favoriteSongs, setFavoriteSongs] = useState(null);
    const [favoriteAlbums, setFavoriteAlbums] = useState(null);
    const [favoriteArtists, setFavoriteArtists] = useState(null);
    const [playSong, setPlaySong] = useState(null)
    const [removed, setRemoved] = useState(false);
    const [currentPLaylist, setCurrentPlaylist] = useState([{src: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview112/v4/fa/c6/23/fac62369-02ae-6451-1942-76f38e2a61b0/mzaf_1964475913263690754.plus.aac.p.m4a", name: "Doja"},{src: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview123/v4/6b/0b/21/6b0b219c-8f51-95cb-3e8f-11492d521421/mzaf_5836981206976882775.plus.aac.ep.m4a", name:"Woman"}])

    useEffect(() => {
        const fetchFavoriteSongs = async () => {
            const response = await fetch(`http://localhost:3000/api/v1/${user}/favoriteSongs`);
            const data = await response.json();
            setFavoriteSongs(data);
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
            <h2>Favorite songs: </h2>
            <div className='favorite-songs category'>{favoriteSongs && favoriteSongs.map(song =>
                <SongCard key={song.key} song={song} setPlaySong={setPlaySong} removed={removed} setRemoved={setRemoved} />)}
            </div>
            {/* <h4>Favorite albums: </h4>
            <div className='favorite-albums category'>{favoriteAlbums && favoriteAlbums.map(album => <AlbumCard key={album.id} album={album} />)}</div>
            <h4>Favorite artists: </h4>
            <div className='favorite-artists category'>{favoriteArtists && favoriteArtists.map(artist => <ArtistCard key={artist.id} artist={artist} />)}</div> */}
            {
                <section id="audioplayer" className='row'>
                    <AudioPlayer tracks={currentPLaylist} />
                </section>
            }
        </section>
    )
        : (
            <section>
                <Navigate to='/login' replace={true} />
            </section>
        )
}

export default Favorites;
