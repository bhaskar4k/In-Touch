const mongoose = require('mongoose');
const schema = mongoose.Schema;

const followerCountSchema = new schema(
    {
        username: { type: String },
        count: { type: Number }
    }
)

module.exports = mongoose.model("follower_counts", followerCountSchema);