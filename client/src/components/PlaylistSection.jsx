import SongCard from './SongCard';
import { useGlobalContext } from '../Views/Layout';

function PlaylistSection(props) {
    const {name, songs} = props;
    const {removed, setRemoved } = props;

    const { setCurrentPlaylist } = useGlobalContext();

    function addCurrentPlaylist(e) {
        e.preventDefault();
        songs && songs.forEach(song => {
            song.key && song.actions ?
            setCurrentPlaylist(prevPlaylist => [...prevPlaylist, { src: song.actions[1].uri, name: song.title, artist: song.subtitle }])
            : song.key && !song.actions && song.hub ?
                setCurrentPlaylist(prevPlaylist => [...prevPlaylist, { src: song.hub.actions[1].uri, name: song.title, artist: song.subtitle }])
                : song.play ?
                    setCurrentPlaylist(prevPlaylist => [...prevPlaylist, { src: song.play, name: song.title, artist: song.subtitle }])
                    : setCurrentPlaylist(prevPlaylist => [...prevPlaylist, { src: song.tracks.actions[1].uri, name: song.tracks.title, artist: song.tracks.subtitle }])
        })
    }

    return (
    <>
        <div>
            <h2>{name}: </h2>
            <button type='button' onClick={addCurrentPlaylist}>Add Playlist to Queue</button>
        </div>
        <div className='favorite-songs category'>{songs.map(song =>
            <SongCard key={song.key} song={song} removed={removed} setRemoved={setRemoved} />)}
        </div>
    </>
    )
}

export default PlaylistSection;