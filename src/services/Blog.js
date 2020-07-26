const User = require('../models/User');
const Blog = require('../models/Blog');
const Comment = require('../models/Comment');
const CustomError = require('../utils/CustomError');


class BlogService{

  async createBlog(req){
    /** Collect form data from the request body
     *  Reassign the data to the model properties
     * Store the data to the data base
     * Return the new data back
     */
    const formData = req.body;

    this.logger(req.user, "Logged In User");

    let newBlogPost = {
      title: formData['article_title'],
      description: formData['article_description'],
      post: formData['article_post'],
      imgSrc: formData['article_img_src'],
      imgAlt: formData['article_img_alt'],
      author: {
        id: req.user._id,
        name: req.user.firstName,
        email: req.user.email
      }
    }

    const myBlogPost = await Blog.create(newBlogPost);

    this.logger(myBlogPost, "New blogpost");

    if(!myBlogPost){
      throw new CustomError("Post could not be created. Check your data.", 400);
    }

    return {
      data: myBlogPost
    }       

  } // end createBlog

  async getBlogs(req){

    const allBlogs = await Blog.find({});

    this.logger(allBlogs, "Get allblogs");

    if(!allBlogs)
      throw new CustomError("Could not fetch blogs. Try again!!!", 400);

    return {
      data: allBlogs
    }

  } // end getBlogs

  async getBlog(req){

    const blog = await (await Blog.findById(req.params.id)
                                  .populate("comments"))
                                  .execPopulate();

    this.logger(blog, "Blog")

    if(!blog)
      throw new CustomError("Could Not Load Blog Details. Try Again!!!", 400);

    return {
      data: blog
    }

  } // end getBlog

  async createBlogComment(req){
    /**
     * Get the id of the blog post
     * Query for the blog post using the id
     * if found, create a new comment for it
     * Assign author to the comment
     * push the comment to blog array of comment
     * Save comment and save blog
     */

    const blogId = req.params.id;
    const newComment = req.body.comment;

    let myBlog = await Blog.findById(blogId);
    let myComment = await Comment.create(newComment);

    this.logger(myBlog, "Blog in comment");
    this.logger(myComment, "Comment in comment");

    if (!(myBlog && myComment)) {
      throw new CustomError("Comment Could Not Be Added. Try Again!!!", 400);
    }
    
    myComment.author.id = req.user._id;
    myComment.author.name = req.user.firstName;
    myComment.author.email = req.user.email;
    myComment.save();

    myBlog.comments.push(myComment);
    myBlog.save();
    
    this.logger(myBlog, "Blog in comment");
    this.logger(myComment, "Comment in comment");

    return {
      data: myComment
    }

  } // end createBlogComment

  async getBlogComments(req){
    /* Not needed for now. Maybe later. Thanks */
  }

  // ===========================================
  logger(msg, title){
    let debug = true;

    if(debug){
      console.log('===='+title+'====');
      console.log(msg);
    }

  }

}

module.exports = new BlogService();