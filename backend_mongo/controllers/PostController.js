const PostModel = require('../models/PostModel');
const LikeModel = require('../models/LikeModel');
const CommentModel = require('../models/CommentModel');
const LikeCountModel = require('../models/LikeCountModel');
const FollowModel = require('../models/FollowModel');
const FollowerCountModel = require('../models/FollowerCountModel');
const FollowingCountModel = require('../models/FollowingCountModel');
const UserFavTagModel = require('../models/UserFavTagModel');


async function setting_up_following_schema_on_creating_new_profile(req, res) {
    const { username } = req.body;

    let count = 0;
    let info = await FollowerCountModel.create({ username, count });
    info = await FollowingCountModel.create({ username, count });
    let tag_arr = [];
    info = await UserFavTagModel.create({ username, tag_arr });
    res.status(200).json(info);
}

async function get_post_count(req, res) {
    const { username } = req.params;

    try {
        const count = await PostModel.countDocuments({ username: username });
        res.status(200).json({ count: count });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

async function get_all_post(req, res) {
    const { username, offset } = req.params;

    try {
        const post = await PostModel.find({ username }).sort({ createdAt: -1 }).skip(offset).limit(10);
        res.status(200).json(post);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

async function update_fav_tag_array(username, new_tag) {
    const user_fav_tags = await UserFavTagModel.findOne({ username: username });
    const user_love_tag = user_fav_tags.tag;

    for (let i = 0; i < new_tag.length; i++) {
        if (user_love_tag.includes(new_tag[i])) continue;
        user_love_tag.push(new_tag[i]);
    }

    await UserFavTagModel.updateOne({ username: username }, { $set: { tag: user_love_tag } });
}

async function add_post(req, res) {
    try {
        const { post_id, username, post_description, post_image, tag, upload_date, upload_time } = req.body;

        let post = await PostModel.create({ post_id, username, post_description, post_image, tag, upload_date, upload_time });
        let count = 0;
        await LikeCountModel.create({ post_id, count });
        update_fav_tag_array(username, tag);
        res.status(200).json(post);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

async function delete_post(req, res) {
    try {
        const { post_id } = req.body;

        const result = await PostModel.deleteOne({ post_id: post_id });
        await LikeCountModel.deleteOne({ post_id: post_id });
        res.status(200).json(result);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

async function like_control(req, res) {
    const { post_id, username } = req.body;

    try {
        const existingLike = await LikeModel.findOne({ post_id, username });
        const like_count = await LikeCountModel.findOne({ post_id });

        if (existingLike) {
            await LikeModel.deleteOne({ post_id, username });
            await LikeCountModel.updateOne({ post_id: post_id }, { $set: { count: like_count.count - 1 } });
            res.status(200).json({ post_id: post_id, username: username, is_liked: false, count: like_count.count - 1 });
        } else {
            let newLike = await LikeModel.create({ post_id, username });
            await LikeCountModel.updateOne({ post_id: post_id }, { $set: { count: like_count.count + 1 } });
            res.status(200).json({ post_id: post_id, username: username, is_liked: true, count: like_count.count + 1 });
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

async function is_liked(req, res) {
    const { username, post_id } = req.params;
    try {
        const existingLike = await LikeModel.findOne({ post_id, username });

        if (existingLike) {
            res.status(200).json({ message: "true" });
        } else {
            res.status(200).json({ message: "false" });
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

async function get_like_count(req, res) {
    const { post_id } = req.params;

    try {
        const like_count = await LikeCountModel.findOne({ post_id });
        res.status(200).json({ count: like_count.count });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

async function get_all_like_list(req, res) {
    const { post_id, offset } = req.params;

    try {
        const like = await LikeModel.find({ post_id }).sort({ createdAt: -1 }).skip(offset).limit(10);
        res.status(200).json(like);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

async function do_comment(req, res) {
    try {
        const { comment_id, post_id, username, comment_description, upload_date, upload_time } = req.body;

        let comment = await CommentModel.create({ comment_id, post_id, username, comment_description, upload_date, upload_time });
        res.status(200).json(comment);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

async function get_comment(req, res) {
    const { post_id, offset } = req.params;

    try {
        const comment = await CommentModel.find({ post_id }).sort({ createdAt: -1 }).skip(offset).limit(10);
        res.status(200).json(comment);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

async function do_follow(req, res) {
    try {
        const { username, followed_by_username } = req.body;

        const existingFollow = await FollowModel.findOne({ username, followed_by_username });
        const follower_count = await FollowerCountModel.findOne({ username });
        const following_count = await FollowingCountModel.findOne({ username: followed_by_username });

        if (existingFollow) {
            await FollowModel.deleteOne({ username, followed_by_username });
            await FollowerCountModel.updateOne({ username: username }, { $set: { count: follower_count.count - 1 } });
            await FollowingCountModel.updateOne({ username: followed_by_username }, { $set: { count: following_count.count - 1 } });
            res.status(200).json({
                username: username, followed_by_username: followed_by_username, is_followed: false,
                follower_count: follower_count.count - 1, following_count: following_count.count - 1
            });
        } else {
            await FollowModel.create({ username, followed_by_username });
            await FollowerCountModel.updateOne({ username: username }, { $set: { count: follower_count.count + 1 } });
            await FollowingCountModel.updateOne({ username: followed_by_username }, { $set: { count: following_count.count + 1 } });
            res.status(200).json({
                username: username, followed_by_username: followed_by_username, is_followed: true,
                follower_count: follower_count.count + 1, following_count: following_count.count + 1
            });
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

async function get_follower_and_following_info(req, res) {
    const { username } = req.params;

    try {
        const follower_count = await FollowerCountModel.findOne({ username });
        const following_count = await FollowingCountModel.findOne({ username });
        res.status(200).json({ username: username, follower_count: follower_count.count, following_count: following_count.count });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

async function is_followerd(req, res) {
    const { username, followed_by_username } = req.params;

    try {
        const existingFollow = await FollowModel.findOne({ username, followed_by_username });
        if (existingFollow) {
            res.status(200).json({ is_followed: true });
        } else {
            res.status(200).json({ is_followed: false });
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

async function get_follower_list(req, res) {
    const { username, offset } = req.params;

    try {
        const follower_list = await FollowModel.find({ username: username }).skip(offset).limit(10);
        res.status(200).json(follower_list);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

async function get_following_list(req, res) {
    const { username, offset } = req.params;

    try {
        const following_list = await FollowModel.find({ followed_by_username: username }).skip(offset).limit(10);
        res.status(200).json(following_list);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

async function update_post(req, res) {
    const { username, post_id, updated_post_description, tags } = req.body;

    try {
        await PostModel.updateOne({ post_id: post_id }, { $set: { post_description: updated_post_description, tag: tags } });
        update_fav_tag_array(username, tags);
        res.status(200).json({ updation_status: true });
    } catch (ex) {
        console.log(ex);
        res.status(400).json({ error: ex });
    }
}

async function get_feed(req, res) {
    const { username, offset } = req.params;
    console.log(username, offset);
    let key_for_tag = "tag_redis|" + username;

    try {
        const users = await FollowModel.find({ followed_by_username: username });
        const following_people = users.map(user => user.username);

        const user_fav_tags = await UserFavTagModel.findOne({ username: username });
        const user_love_tag = user_fav_tags.tag;

        //set_data_to_cache(key_for_tag, tag, 60)
        console.log("FROM DB");

        const query = {
            $and: [
                {
                    $or: [
                        { tag: { $in: user_love_tag } },
                        { username: { $in: following_people } }
                    ]
                },
                { username: { $ne: username } }
            ]
        };

        const posts = await PostModel.find(query).skip(offset).limit(10);
        const x = posts.map(post => post.username);
        res.status(200).json(posts);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

module.exports = {
    get_all_post, add_post, delete_post, get_post_count,
    like_control, is_liked, do_comment, get_comment, get_like_count,
    get_all_like_list, do_follow, setting_up_following_schema_on_creating_new_profile,
    get_follower_and_following_info, is_followerd, update_post, get_follower_list,
    get_following_list, get_feed
}