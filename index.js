const express = require('express');
const {connectToMongoDB} = require('./connect');
const URL = require('./models/url');
const dotenv= require('dotenv')
dotenv.config();
const urlRoute = require('./routes/url')

const app = express();

const port  =  process.env.PORT || 8000;

connectToMongoDB(process.env.MONGO_URI)
.then(() => {console.log('Mongodb connected!!') });

app.use(express.json());

app.use("/url", urlRoute);

app.get('/:shortId', async (req, res) => {
    const shortId = req.params.shortId;
    const entry = await URL.findOneAndUpdate(
        {shortId}, 
        {$push: {visitHistory: {timestamp: Date.now()}, },},
    )
    res.redirect(entry.redirectURL);
});

app.listen(port, ()=>console.log(`Server started at PORT: ${port}`))

