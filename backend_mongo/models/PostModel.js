const mongoose = require('mongoose');
const schema = mongoose.Schema;

const postSchema = new schema(
    {
        post_id: { type: String },
        username: { type: String },
        post_description: { type: String },
        post_image: { type: String },
        tag: { type: Array },
        upload_date: { type: String },
        upload_time: { type: String }
    }, { timestamps: true }
)

module.exports = mongoose.model("post_infos", postSchema);