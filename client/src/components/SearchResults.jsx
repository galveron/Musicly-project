import SongCard from './SongCard';
import ArtistCard from './ArtistCard';
import { useState, useEffect } from 'react'
import AudioPlayer from './AudioPlayer';

function SearchResults(props) {
    const { songResults, artistResults } = props;
    // const [playSong, setPlaySong] = useState(null)
    // const [audio, setAudio] = useState(null)

    // useEffect(() => {
    //     if (playSong) {
    //         console.log(playSong);
    //         const song = new Audio(playSong)
    //         setAudio(song)
    //     }
    // }, [playSong])

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
            {/* {
                playSong ?
                    <section className='audioplayer'>
                        <AudioPlayer src={playSong} />
                    </section>
                    : (
                        <></>
                    )
            } */}
        </>
    )
}

export default SearchResults;