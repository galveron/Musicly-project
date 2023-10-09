function ArtistCard(props) {
    const {artist} = props;

    return (
        <div>Artist name: {artist.name} </div>
    )
}

export default ArtistCard;