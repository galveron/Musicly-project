import React from 'react';

class AudioPlayer extends React.Component {
    state = {
        playing: false,
        currentTime: 0,
        duration: 0,
        currentTimeSeconds: 0,
        durationSeconds: 0
    }

    audioRef = React.createRef()

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
        }
    }

    handlePrevTrack = () => {
        if (this.state.currentTrack > 0) {
            this.setState(prevState => ({ currentTrack: prevState.currentTrack - 1 }));
        }
    }

    render() {
        const { playing, currentTime, duration, volume, currentTrack, tracks } = this.state
        const { src } = this.props

        return (
            <div id='audioContainer'>
                <audio
                    ref={this.audioRef}
                    src={src}
                    onTimeUpdate={this.handleTimeUpdate}
                />
                <div className='playButtonContainer'>
                    <button disabled={src ? false : true} onClick={playing ? this.handlePause : this.handlePlay} className='playButton'>
                        {playing ? <i className="fa-solid fa-pause"></i> : <i className="fa-solid fa-play"></i>}
                    </button>
                </div>
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

export default AudioPlayer
