function ArtistCard(props) {
    const { album } = props;

    return (
        <div>Album name: {album.attributes.name} </div>
    );
};

export default ArtistCard;
