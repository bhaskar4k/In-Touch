const mongoose = require('mongoose');
const schema = mongoose.Schema;

const likeSchema = new schema(
    {
        post_id: { type: String },
        username: { type: String }
    }, { timestamps: true }
)

module.exports = mongoose.model("like_controls", likeSchema);