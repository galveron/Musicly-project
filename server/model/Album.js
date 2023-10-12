import mongoose from "mongoose";

const { Schema, model } = mongoose;

const albumSchema = new Schema({
  user: String,
  id: String,
  attributes: {
    genreNames: Array,
    releaseDate: String,
    artwork: Object,
    url: String,
    recordLabel: String,
    trackCount: Number,
    name: String,
    artistName: String,
    tracks: Object,
  },
});

export default model('Album', albumSchema);
