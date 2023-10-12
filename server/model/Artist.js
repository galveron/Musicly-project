import mongoose from "mongoose";

const { Schema, model } = mongoose;

const artistSchema = new Schema({
    user: String,
    artistId: String,
    resources: {
        artists: Object,
        songs: Object,
        albums: Object,
    },
});

export default model('Artist', artistSchema);
