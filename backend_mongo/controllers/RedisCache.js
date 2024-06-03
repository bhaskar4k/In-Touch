const redis = require('redis');

const redisClient = redis.createClient(6379);


const check_cache = (req, res, next) => {
    const { username } = req.params;
    let key_for_tag = "tag_redis|" + username;

    redisClient.get(key_for_tag, (err, data) => {
        if (err) {
            return res.status(400).json({ error: 'Internal Server Error' });
        }

        if (data !== null) {
            console.log("FROM REDIS");
            return res.status(200).json(JSON.parse(data));
        } else {
            next();
        }
    });
};

const set_data_to_cache = (key, data, expiration) => {
    redisClient.set(key, expiration, JSON.stringify(data));
};

module.exports = { check_cache, set_data_to_cache };
