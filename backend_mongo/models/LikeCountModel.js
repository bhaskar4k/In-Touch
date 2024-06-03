const mongoose = require('mongoose');
const schema = mongoose.Schema;

const likeCountSchema = new schema(
    {
        post_id: { type: String },
        count: { type: Number }
    }
)

module.exports = mongoose.model("like_counts", likeCountSchema);