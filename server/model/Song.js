import mongoose from "mongoose";

const { Schema, model } = mongoose;

const songSchema = new Schema({
        user: String,
        playlist: String,
        key: String,
        title: String,
        subtitle: String,
        images: Object,
        url: String,
        artists: Array,
        genres: Object,
        albumadamid: String,
        youtubeurl: Object,
        play: String,
});

export default model('Song', songSchema);
