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

    handleBackSeek = () => {
        this.audioRef.current.currentTime -= 15
    }

    handleForwardSeek = () => {
        this.audioRef.current.currentTime += 15
    }

    render() {
        const { playing, currentTime, duration, volume, currentTrack, tracks } = this.state

        if (tracks) {
            if (tracks.length > 0) {
                return (
                    <div id='audioContainer' className='row'>
                        <audio
                            ref={this.audioRef}
                            src={tracks[currentTrack].src}
                            onTimeUpdate={this.handleTimeUpdate}
                            onEnded={this.handleNextTrack}
                        />
                        <div id="left-col" className='col-4'>
                            {tracks[currentTrack].name ?
                                <div className='row' id='textContainer'><p className='tracks'>{tracks[currentTrack].name}</p>
                                    {
                                        tracks[currentTrack].artist ?
                                            <p className='tracks'>{tracks[currentTrack].artist}</p>
                                            : <></>
                                    }
                                </div>
                                : <></>
                            }
                        </div>
                        <div id="middle-col" className='col-6'>
                            <div className='row' id='playButtonContainer'>
                                <button className="simple-1" onClick={this.handlePrevTrack}><i className="fa-solid fa-backward-step"></i></button>
                                <button className="simple-2" onClick={this.handleBackSeek}><i className="fa-solid fa-arrow-rotate-left"></i> 15</button>

                                <button className="simple-1" id="playbutton" disabled={tracks[currentTrack].src ? false : true} onClick={playing ? this.handlePause : this.handlePlay}>
                                    {playing ? <i className="fa-solid fa-pause"></i> : <i className="fa-solid fa-play"></i>}
                                </button>

                                <button className="simple-2" onClick={this.handleForwardSeek}>15 <i className="fa-solid fa-arrow-rotate-right"></i></button>
                                <button className="simple-1" onClick={this.handleNextTrack}><i className="fa-solid fa-forward-step"></i></button>
                            </div>


                            <label className='row' id='durationLabel'>
                                <div id="duartion-time">{this.state.currentTimeSeconds + ' / ' + this.state.durationSeconds}</div>
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
                        <div id="right-col" className='col-2'>
                            <label className='row' id='volumeLabel'>Volume
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
                        </div>
                    </div>
                )
            }
        }
    }
}

export default AudioPlayer
