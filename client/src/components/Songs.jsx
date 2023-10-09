import SongCard from "./SongCard";
import React from "react";
export default function Songs(props) {
    const { title, topTen } = props
    return (
        <>
            <article className='songs'>
                <h2>{title}</h2>
                <div className='category' >
                    {topTen.length > 0 ?
                        topTen.map((song) => <SongCard song={song} setPlaySong={props.setPlaySong} key={song.key ? song.key : song.track.key} />)
                        : <h2>Loading...</h2>}
                </div>
            </article>
        </>
    )
}
