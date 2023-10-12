import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { useGlobalContext } from '../Views/Layout';

export default function SongCard(props) {
    const { song, removed, setRemoved } = props;
    const [user, setUser] = useState(Cookies.get('username'));
    const [favorites, setFavorites] = useState(null);
    const [playlists, setPlaylists] = useState(null);
    const [choosePlaylist, setChoosePlaylist] = useState(false);
    const [creatingNewPlaylist, setCreatingNewPlaylist] = useState(false);
    const [selectedPlaylist, setSelectedPlaylist] = useState(null);
    const [isFavorite, setIsFavorite] = useState(false);

    const { currentPlaylist, setCurrentPlaylist } = useGlobalContext();

    useEffect(() => {
        const fetchFavorites = async () => {
            const response = await fetch(`http://localhost:3000/api/v1/${user}/favoriteSongs`);
            const favoriteSongs = await response.json();
            setFavorites(favoriteSongs);

            const playlists = [];
            for (let favoriteSong of favoriteSongs) {
                playlists.push(favoriteSong.playlist);
            }
            console.log(playlists);
            const uniquePlaylists = [...new Set(playlists)];
            if (uniquePlaylists.length > 0) {
                setPlaylists(uniquePlaylists);
            }
        }
        fetchFavorites();
    }, [song, user, removed]);

    useEffect(() => {
        if (favorites !== null && song) {
            for (let favoriteSong of favorites) {
                if (favoriteSong.key == song.key) {
                    setIsFavorite(true);
                };
            };
        };
    }, [favorites, song]);

    async function addToHistory() {
        const { title, subtitle } = song;
        const newSong = {
            songArtist: subtitle,
            songTitle: title,
        };

        await fetch(`http://localhost:3000/history/${user}`, {
            method: "POST",
            headers: {
                "Content-type": "application/json",
            },
            body: JSON.stringify(newSong),
        });
    };

    function playClick(e) {
        e.preventDefault();
        song.key && song.actions ?
            setCurrentPlaylist([{ src: song.actions[1].uri, name: song.title, artist: song.subtitle }])
            : song.key && !song.actions && song.hub ?
                setCurrentPlaylist([{ src: song.hub.actions[1].uri, name: song.title, artist: song.subtitle }])
                : song.play ?
                    setCurrentPlaylist([{ src: song.play, name: song.title, artist: song.subtitle }])
                    : setCurrentPlaylist([{ src: song.tracks.actions[1].uri, name: song.title, artist: song.subtitle }])
        addToHistory();
    }

    function addCurrentPlaylist(e) {
        e.preventDefault();
        song.key && song.actions ?
            setCurrentPlaylist([...currentPlaylist, { src: song.actions[1].uri, name: song.title, artist: song.subtitle }])
            : song.key && !song.actions && song.hub ?
                setCurrentPlaylist([...currentPlaylist, { src: song.hub.actions[1].uri, name: song.title, artist: song.subtitle }])
                : song.play ?
                    setCurrentPlaylist([...currentPlaylist, { src: song.play, name: song.title, artist: song.subtitle }])
                    : setCurrentPlaylist([...currentPlaylist, { src: song.tracks.actions[1].uri, name: song.tracks.title, artist: song.tracks.subtitle }])
    };

    const handlePlaylistSelection = () => {
        setChoosePlaylist(true);
    }

    const addToFavorites = async (event) => {
        event.preventDefault();
        if (event.target.value !== 'newPlaylist') {
            try {
                const newSong = song.key ? {
                    key: song.key,
                    playlist: event.target.value ? event.target.value : event.target.newplaylist.value,
                    title: song.title,
                    subtitle: song.subtitle,
                    images: song.images,
                    url: song.url,
                    artists: song.artists,
                    genres: song.genres,
                    albumadamid: song.albumadamid,
                    youtubeurl: song.youtubeurl,
                    play: song.hub ? song.hub.actions[1].uri : 'no data'
                } : {
                    key: song.track.key,
                    playlist: event.target.value ? event.target.value : event.target.newplaylist.value,
                    title: song.track.title,
                    subtitle: song.track.subtitle,
                    images: song.track.images,
                    url: song.track.url,
                    artists: song.track.artists,
                    genres: song.track.genres,
                    albumadamid: song.track.albumadamid,
                    youtubeurl: song.track.youtubeurl,
                    play: song.track.actions[1].uri ? song.track.actions[1].uri : song.track.hub.actions[1].uri
                };

                console.log(newSong);

                await fetch(`http://localhost:3000/api/v1/${user}/favoriteSongs`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json"
                    },
                    body: JSON.stringify(newSong)
                })

                console.log('Song successfully added');
                setIsFavorite(true);
                setChoosePlaylist(false);
                event.target.innerHTML = 'Added to Favorites';
                event.target.disabled = true;
            } catch (err) {
                console.log(err);
            }
        } else {
            setCreatingNewPlaylist(true);
        }
    }

    const removeFromFavorites = async () => {
        try {
            await fetch(`http://localhost:3000/api/v1/${user}/favoriteSongs/${song.key}`, {
                method: "DELETE",
            });
            console.log('Song deleted from favorites');
            setRemoved(!removed);
        } catch (err) {
            console.log(err);
        };
    };

    const playlistSelection = !creatingNewPlaylist ? (
        <select onChange={addToFavorites} name='playlists' defaultValue={selectedPlaylist}>
            {playlists ? playlists.map(playlist => <option key={playlist} value={playlist}>{playlist}</option>) : <option value={'newPlaylist'}>Create new</option>}
            <option value={'newPlaylist'}>Create new playlist</option>
        </select>
    ) : (
        <form action='' onSubmit={addToFavorites}>
            <input type='text' required name='newplaylist' placeholder='Name your playlist'></input>
            <button type='submit'>Add Playlist</button>
        </form>
    )

    return song.key ? (
        <div key={song.key} className="card">
            <img src={song.images ? song.images.coverart : '/placeholder.png'} className="img" />
            <div className="container">
                <h4><b>{song.title}</b></h4>
                <button onClick={playClick}>Play</button>
                <button onClick={addCurrentPlaylist}>Add to current playlist</button>
                {song.artists ? song.artists.map(artist => <p key={artist.adamid}>{artist.alias}</p>) : <div>no data </div>}
                {isFavorite ? <button onClick={removeFromFavorites}>Remove Favorite</button> : choosePlaylist ? playlistSelection : <button onClick={handlePlaylistSelection}>Add to favourites</button>}
            </div>
        </div>
    ) : (
        <div key={song.track.key} className="card">
            <img src={song.track.images.coverart} className="img" />
            <div className="container">
                <h4><b>{song.track.title}</b></h4>
                {song.track.artists.map(artist => <p key={artist.adamid}>{artist.alias}</p>)}
                {isFavorite ? <button onClick={removeFromFavorites}>Remove Favorite</button> : <button onClick={addToFavorites}>Add to favourites</button>}
            </div>
        </div>
    );
};
