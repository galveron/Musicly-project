import { useState, useEffect } from 'react';
import SearchBar from '../components/SearchBar';
import SearchResults from '../components/SearchResults';
import AudioPlayer from '../components/AudioPlayer';

function Search() {
    const [songResults, setSongResults] = useState(null);
    const [artistResults, setArtistResults] = useState(null);
    const [playSong, setPlaySong] = useState(null)
    const [audio, setAudio] = useState(null)


    useEffect(() => {
        if (playSong) {
            console.log(playSong);
            const song = new Audio(playSong)
            setAudio(song)
        }
    }, [playSong])


    return (
        <>
            <section id="section" className='col'>
                <SearchBar setSongResults={setSongResults} setArtistResults={setArtistResults} />
                <SearchResults songResults={songResults} artistResults={artistResults} setPlaySong={setPlaySong} />
            </section>
            {
                playSong ?
                    <section id="audioplayer" className='row'>
                        <AudioPlayer src={playSong} />
                    </section >
                    : <section id="audioplayer" className='row'>
                        <AudioPlayer />
                    </section>
            }
        </>
    )
}

export default Search;