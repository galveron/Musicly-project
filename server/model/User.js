import mongoose from "mongoose";

const { Schema, model } = mongoose;

const userschema = new Schema({
    username: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    registDate: Date,
    history: {
        artists: [],
        albums: [],
        songs: [],
    },
});

export default model('User', userschema, 'users');
