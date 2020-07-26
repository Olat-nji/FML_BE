const BlogSrv = require('../services/Blog');
const response = require('../utils/response');


class BlogController{

  async createBlog(req, res){

    const {data} = await BlogSrv.createBlog(req);

    return res.status(200).send(response("Post Created Successfully", data, true));
    
  }

  async getBlogs(req, res){

    const {data} = await BlogSrv.getBlogs(req);

    return res.status(200).send(response("All Blogs Fetched", data, true));

  }

  async getBlog(req, res){

    const {data} = await BlogSrv.getBlog(req);

    return res.status(200).send(response("A Blog Fetched", data, true));
  }

  async createBlogComment(req, res){

    const {data} = await BlogSrv.createBlogComment(req);

    return res.status(200).send(response("Blog Comment Posted", data, true));
  }

  async getBlogComments(req, res){

    const {data} = await BlogSrv.getBlogComments(req);

    return res.status(200).send(response("A Blog Comment Fetched", data, true));
  }

}

module.exports = new BlogController();