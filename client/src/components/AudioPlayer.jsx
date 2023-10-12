import React from 'react';
import { GlobalContext } from '../Views/Layout';

class AudioPlayer extends React.Component {
    state = {
        playing: false,
        currentTime: 0,
        duration: 0,
        volume: 1,
        currentTimeSeconds: 0,
        durationSeconds: 0,
        currentTrack: 0,
        tracks: [],
        newTrack: 0,
    }
    
    audioRef = React.createRef()

    componentDidMount() {
        
        this.setState({ tracks: this.props.tracks });
    }

    componentDidUpdate(prevProps) {
        if (prevProps.tracks !== this.props.tracks) {
            this.setState({ tracks: this.props.tracks });
        }
    }

    automaticPLay() {
        console.log("automatic play called");
        if (this.state.playing === true) {
            this.audioRef.current.play()
        }
    }


    handlePlay = () => {
        this.audioRef.current.play()
        this.setState({ playing: true })
    }

    handlePause = () => {
        this.audioRef.current.pause()
        this.setState({ playing: false })
    }

    time_convert = (num) => {
        if (isFinite(num)) {
            let minutes = Math.floor(num / 60);
            let seconds = num % 60
            return minutes + ":" + seconds;
        }
        return 0
    }

    handleTimeUpdate = () => {
        this.setState({
            currentTime: this.audioRef.current.currentTime,
            duration: this.audioRef.current.duration,
            currentTimeSeconds: this.time_convert(Math.round(this.audioRef.current.currentTime)),
            durationSeconds: this.time_convert(Math.round(this.audioRef.current.duration))
        })
    }

    handleVolumeChange = (e) => {
        this.setState({ volume: e.target.value });
        this.audioRef.current.volume = e.target.value;
    }

    handleSeek = (e) => {
        this.audioRef.current.currentTime = e.target.value;
    }

    handleNextTrack = () => {
        if (this.state.currentTrack < this.state.tracks.length - 1) {
            this.setState(prevState => ({ currentTrack: prevState.currentTrack + 1 }));
            this.audioRef.current.src = this.state.tracks[this.state.currentTrack + 1].src
            this.audioRef.current.onloadedmetadata = (e) => {
                this.setState({ duration: e.target.duration })
                if (this.state.playing === true) {
                   this.handlePlay() 
                }
            }
        }
    }

    handlePrevTrack = () => {
        if (this.state.currentTrack > 0) {
            this.setState(prevState => ({ currentTrack: prevState.currentTrack - 1 }));
            this.audioRef.current.src = this.state.tracks[this.state.currentTrack - 1].src
            this.audioRef.current.onloadedmetadata = (e) => {
                this.setState({ duration: e.target.duration })
                if (this.state.playing === true) {
                   this.handlePlay() 
                }
            }
        }
    }

    render() {
        const { playing, currentTime, duration, volume, currentTrack, tracks } = this.state
        
        if (tracks) {
            if (tracks.length > 0) {
                return (
                    <div id='audioContainer'>
                        <audio
                            ref={this.audioRef}
                            src={tracks[currentTrack].src}
                            onTimeUpdate={this.handleTimeUpdate}
                            onEnded={this.handleNextTrack}
                        />
                        <div className='playButtonContainer'>
                            <button onClick={this.handlePrevTrack}>Prev</button>
                            <div >
                                <button disabled={tracks[currentTrack].src ? false : true} onClick={playing ? this.handlePause : this.handlePlay} className='playButton'>
                                    {playing ? <i className="fa-solid fa-pause"></i> : <i className="fa-solid fa-play"></i>}
                                </button>
                            </div>
                            <button onClick={this.handleNextTrack}>Next</button>
                        </div>
                        {tracks[currentTrack].name ?
                            <><p>{tracks[currentTrack].name}</p>
                            {
                                tracks[currentTrack].artist ? 
                                <p>{tracks[currentTrack].artist}</p>
                                : <></>
                            }
                            </>
                            : <></>
                        }
                        <div className='volumeDuration'>
                            <label className='volumeLabel'>Volume
                                <input
                                    className='volume'
                                    type="range"
                                    min={0}
                                    max={1}
                                    step={0.01}
                                    value={volume}
                                    onChange={this.handleVolumeChange}
                                />
                            </label>
                            <label className='durationLabel'>{this.state.currentTimeSeconds + ' / ' + this.state.durationSeconds}
                                <input
                                    className='duration'
                                    type="range"
                                    min={0}
                                    max={duration}
                                    step={0.01}
                                    value={currentTime}
                                    onChange={this.handleSeek}
                                />
                            </label>
                        </div>
                    </div>
                )
            }
        }
    }
}

export default AudioPlayer
