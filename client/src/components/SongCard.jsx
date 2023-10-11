import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';

export default function SongCard(props) {
    const { song, removed, setRemoved, setCurrentPlaylist } = props;
    const [user, setUser] = useState(Cookies.get('username'))
    const [favorites, setFavorites] = useState(null);
    const [isFavorite, setIsFavorite] = useState(false);

    useEffect(() => {
        const fetchFavorites = async () => {
            const response = await fetch(`http://localhost:3000/api/v1/${user}/favoriteSongs`);
            const favoriteSongs = await response.json();
            setFavorites(favoriteSongs);
        }
        fetchFavorites();
    }, [song, user, removed])

    useEffect(() => {
        if (favorites !== null && song) {
            for (let favoriteSong of favorites) {
                if (favoriteSong.key == song.key) {
                    setIsFavorite(true);
                }
            }
        }
    }, [favorites, song])

    async function addToHistory() {
        const { title, subtitle } = song;
        const newSong = {
            songArtist: subtitle,
            songTitle: title,
        }

        await fetch(`http://localhost:3000/history/${user}`, {
            method: "POST",
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify(newSong)
        })

        console.log("Added to history");
    }

    function playClick(e) {
        e.preventDefault();
        console.log(song);
        song.key && song.actions ?
            props.setPlaySong(song.actions[1].uri)
            : song.key && !song.actions && song.hub ?
                props.setPlaySong(song.hub.actions[1].uri)
                : song.play ?
                    props.setPlaySong(song.play)
                    : props.setPlaySong(song.tracks.actions[1].uri)

        addToHistory();
    }

    function addCurrentPlaylist(e) {
        e.preventDefault();
        song.key && song.actions ?
        ([{src: song.actions[1].uri, name: song.title}])
            : song.key && !song.actions && song.hub ?
            ([{src: song.hub.actions[1].uri, name: song.title}])
                : song.play ?
                ([{src: song.play, name: song.title}])
                    : ([{src: song.tracks.actions[1].uri, name: song.title}])
    }

    const addToFavorites = async (event) => {
        try {
            const newSong = song.key ? {
                key: song.key,
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
            event.target.innerHTML = 'Added to Favorites';
            event.target.disabled = true;
        } catch (err) {
            console.log(err);
        }
    }

    const removeFromFavorites = async () => {
        try {
            await fetch(`http://localhost:3000/api/v1/${user}/favoriteSongs/${song.key}`, {
                method: "DELETE"
            });
            console.log('Song deleted from favorites');
            setRemoved(!removed);
        } catch (err) {
            console.log(err);
        }
    }

    return song.key ? (
        <div key={song.key} className="card">
            <img src={song.images ? song.images.coverart : '/placeholder.png'} className="img" />
            <div className="container">
                <h4><b>{song.title}</b></h4>
                <button onClick={playClick}>Play</button>
                <button onClick={addCurrentPlaylist}>Add to current playlist</button>
                {song.artists ? song.artists.map(artist => <p key={artist.adamid}>{artist.alias}</p>) : <div>no data </div>}
                {isFavorite ? <button onClick={removeFromFavorites}>Remove Favorite</button> : <button onClick={addToFavorites}>Add to favourites</button>}
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
    )
}
