import express from "express";
const app = express();
import mongoose from "mongoose";
import env from "dotenv";
import Song from "./model/Song.js";
import Album from "./model/Album.js";
import Artist from "./model/Artist.js";
import User from "./model/User.js"

env.config();
mongoose.set("strictQuery", false);

app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded());
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://localhost:5173");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");
    next();
});
// register
app.post('/register', async (req, res) => {
    try {
        const username = req.body.username;
        const password = req.body.password;
        const email = req.body.email;
        const registDate = Date.now();
        const checkExistingUsername = await User.findOne({ username: username });
        const checkExistingEmail = await User.findOne({ email: email });
        if (checkExistingEmail) {
            res.send({ msg: "The email already exist" });
        } else if (checkExistingUsername) {
            res.send({ msg: "The username already exist" });
        } else {
            const user = new User({
                username: username,
                password: password,
                email: email,
                registDate: registDate,
            });
            user.save()
                .then(() => res.send({ msg: "You registered successfully! Now you can log in" }))
                .catch(() => res.status(500).send({ msg: "Something went wrong" }));
        };
    } catch (error) {
        res.status(500).send({ msg: "Something went wrong" });
    };
});
// log in
app.post('/login', async (req, res) => {
    try {
        const user = await User.findOne({ username: req.body.username, password: req.body.password });
        if (user) {
            res.send({ user: user, status: "OK" });
        } else {
            res.send({ msg: "Wrong username or password" });
        }
    } catch (error) {
        res.status(500).send({ error: error });
    };
});
// HISTORY
app.get('/history/:username', async (req, res) => {
    try {
        const user = await User.findOne({ username: req.params.username });
        res.send({ user: user, history: user.history });
    } catch (error) {
        res.status(500).send({ msg: "Something went wrong" });
    };
});

app.post('/history/:username', async (req, res, next) => {
    try {
        const user = await User.findOne({ username: req.params.username });
        const { artists, albums, songs } = user.history;
        const { songArtist, songAlbum, songTitle } = req.body;
        songArtist ? artists.push(songArtist) : null;
        songAlbum ? albums.push(songAlbum) : null;
        songTitle ? songs.push(`${songTitle} by ${songArtist}`) : null;
        user.save();
        res.status(200).send({ msg: "updated" });
    } catch (err) {
        console.log(err);
    };
});

app.delete('/history/:username', async (req, res) => {
    try {
        let user = await User.findOneAndUpdate({ username: req.params.username }, {
            history: {
                songs: [],
                artists: [],
            },
        });
        res.send({ user: user, msg: "history deleted" });
    } catch (error) {
        res.status(500).send({ msg: "Something went wrong" });
    };
});
// songs
app.get("/api/v1/:username/favoriteSongs", async (req, res, next) => {
    try {
        const favoriteSongs = await Song.find({ user: req.params.username });
        res.send(favoriteSongs);
    } catch (err) {
        console.log(err);
    };
});

app.post("/api/v1/:username/favoriteSongs", async (req, res, next) => {
    try {
        const { key, playlist, title, subtitle, images, url, artists, genres, albumadamid, youtubeurl, play } = req.body;
        const newFavoriteSong = {
            user: req.params.username,
            key,
            playlist,
            title,
            subtitle,
            images,
            url,
            artists,
            genres,
            albumadamid,
            youtubeurl,
            play,
        };

        await Song.create(newFavoriteSong);
        res.send({ msg: "Successfully added a new song" });
    } catch (err) {
        console.log(err);
    };
});

app.delete("/api/v1/:username/favoriteSongs/:key", async (req, res, next) => {
    try {
        await Song.deleteOne({ key: req.params.key, user: req.params.username });
        res.send({ msg: "Song successfully deleted" });
    } catch (err) {
        console.log(err);
    };
});

// albums
app.get("/api/v1/:username/favoriteAlbums", async (req, res, next) => {
    try {
        const favoriteAlbums = await Album.find({ user: req.params.username });
        res.send(favoriteAlbums);
    } catch (err) {
        console.log(err);
    };
});

app.post("/api/v1/:username/favoriteAlbums", async (req, res, next) => {
    try {
        const { id, attributes } = req.body.data[0];
        const newFavoriteAlbum = {
            user: req.params.username,
            id,
            attributes: {
                genreNames: attributes.genreNames,
                releaseDate: attributes.releaseDate,
                artwork: attributes.artwork,
                url: attributes.url,
                recordLabel: attributes.recordLabel,
                trackCount: attributes.trackCount,
                name: attributes.name,
                artistName: attributes.artistName,
                tracks: attributes.tracks,
            },
        };
        await Album.create(newFavoriteAlbum);
        res.send({ msg: "Successfully added a new album" });
    } catch (err) {
        console.log(err);
    };
});

app.delete("/api/v1/:username/favoriteAlbums/:id", async (req, res, next) => {
    try {
        await Album.deleteOne({ id: req.params.id, user: req.params.username });
        res.send({ msg: "Album successfully deleted" });
    } catch (err) {
        console.log(err);
    };
});

// artists
app.get("/api/v1/:username/favoriteArtists", async (req, res, next) => {
    try {
        const favoriteArtists = await Artist.find({ user: req.params.username });
        res.send(favoriteArtists);
    } catch (err) {
        console.log(err);
    };
});

app.post("/api/v1/:username/favoriteArtists", async (req, res, next) => {
    try {
        const { resources } = req.body;
        const newFavoriteArtist = {
            user: req.params.username,
            artistId: req.body.data[0].id,
            resources,
        };

        await Artist.create(newFavoriteArtist);
        res.send({ msg: "Successfully added a new artist" });
    } catch (err) {
        console.log(err);
    };
});

app.delete("/api/v1/:username/favoriteArtists/:id", async (req, res, next) => {
    try {
        await Artist.deleteOne({ artistId: req.params.id, user: req.params.username });
        res.send({ msg: "Artist successfully deleted" });
    } catch (err) {
        console.log(err);
    };
});

//profile
app.get('/profile/:username', async (req, res) => {
    try {
        const user = await User.findOne({ username: req.params.username });
        res.send(user);
    } catch (error) {
        res.status(500).send({ msg: "Something went wrong" });
    };
});
//edit profile
app.post('/profile/edit/:username', async (req, res) => {
    try {
        const user = await User.findOne({ username: req.params.username });
        if (user.password === req.body.password) {
            try {
                await Song.updateMany({ user: req.params.username }, { user: req.body.username });
                let user = await User.findOneAndUpdate({ username: req.params.username }, {
                    username: req.body.username,
                    password: req.body.newPassword,
                    email: req.body.email,
                });
                res.send({ user: user, msg: "DONE" });
            } catch (error) {
                res.status(500).send({ msg: "Something went wrong" });
            }
        } else {
            res.send({ msg: "wrong password" });
        }
    } catch (error) {
        res.status(500).send({ msg: "Something went wrong" });
    };
});

mongoose.connect(process.env.MONGO_URL).then(() => {
    console.log("Connection to the database have been successful!");
    app.listen(3000, () => {
        console.log("App is running at port: 3000");
    });
}).catch((err) => {
    console.log(err);
});
