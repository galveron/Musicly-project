import SongCard from './SongCard';

function PlaylistSection(props) {
    const {name, songs} = props;
    const {setPlaySong, removed, setRemoved } = props;

    return (
    <>
        <h2>{name}: </h2>
        <div className='favorite-songs category'>{songs.map(song =>
            <SongCard key={song.key} song={song} setPlaySong={setPlaySong} removed={removed} setRemoved={setRemoved} />)}
        </div>
    </>
    )
}

export default PlaylistSection;