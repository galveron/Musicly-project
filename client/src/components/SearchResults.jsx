import SongCard from './SongCard';

function SearchResults(props) {
    const { songResults, artistResults } = props;

    return (
        <>
            {songResults && artistResults ? (
                <>
                    <div className='search'>{songResults.map((song) => <SongCard key={song.track.key} song={song.track} setPlaySong={props.setPlaySong} />)}</div>
                    {/* <div>{artistResults.map(artist => <ArtistCard key={artist.artist.adamid} artist={artist.artist} />)}</div> */}
                </>
            ) : (
                <div></div>
            )}
        </>
    );
};

export default SearchResults;
