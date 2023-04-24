
require('dotenv').config();
const { TwitterApi } = require('twitter-api-v2');
const cron = require('node-cron');
const { QuickDB } = require("quick.db");
const db = new QuickDB({ filePath: `./json.sqlite` });






const nameOfTheRose = require('./output.json')
const userClient = new TwitterApi({
    appKey: process.env.TWITTER_CONSUMER_KEY,
    appSecret: process.env.TWITTER_CONSUMER_SECRET,
    accessToken: process.env.TWITTER_ACCESS_TOKEN_KEY,
    accessSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});


const rwClient = userClient.readWrite;

async function getUniqueRanNum() {
    if (!(await db.has('quotes'))) {
        await db.set('quotes', [0]);
    }
    let randomNum = Math.floor(Math.random() * 4089)
    let cache = await db.get('quotes');
    if (cache.length === 4089) return
    if (cache.includes(randomNum)) {
        return getUniqueRanNum()
    }
    await db.push('quotes', randomNum);
    return randomNum
}



async function doTweet() {
    const randomNum = await getUniqueRanNum()
    await rwClient.v2.tweet(`${ nameOfTheRose[randomNum] }`);

}

cron.schedule('0 * * * *', () => {
    doTweet();
});


