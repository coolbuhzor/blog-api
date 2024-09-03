import { sendResponse } from "../utils/index.js";
import { db } from "../index.js";
// import { FileStorage } from "../models/fileStorage/index.js";
// const db = new FileStorage();

export const getBlog = (req, res) => {
  const data = db.all();
  // console.log(data, "dadadada");
  // const blogs = Object.entries(data).map(([k, v]) => {
  //   if (k === "blogs") return console.log(k);
  // });
  const { blogs } = data;
  sendResponse(res, 200, "Blogs fetched successfully", blogs);
};

export const addBlog = (req, res) => {
  try {
    const blogPost = req.body;
    // check if blog contains all required body
    if (!blogPost?.title || blogPost?.title === "")
      return sendResponse(res, 400, "title is required", null);
    if (!blogPost?.content || blogPost?.content === "")
      return sendResponse(res, 400, "content is required", null);
    // if blog contains all required body, create an id, save blogs to db and return a response
    const newPost = { id: Date.now(), ...blogPost };
    db.new("blogs", newPost);
    sendResponse(res, 201, "Blog posted successfully", newPost);
  } catch (error) {
    sendResponse(res, 500, error.message, error);
  }
};

export const updateBlog = (req, res) => {
  try {
    const blogId = req.params.id;
    const updatedData = req.body;

    if (!updatedData?.title || updatedData?.title === "")
      return sendResponse(res, 400, "title is required", null);
    if (!updatedData?.content || updatedData?.content === "")
      return sendResponse(res, 400, "content is required", null);

    const updatedBlog = db.update("blogs", blogId, updatedData);
    if (!updatedBlog) return sendResponse(res, 404, "Blog not found", null);

    sendResponse(res, 200, "Blog updated successfully", updatedBlog);
  } catch (error) {
    sendResponse(res, 500, error.message, error);
  }
};

export const deleteBlog = (req, res) => {
  try {
    const blogId = req.params.id;
    const deletedBlog = db.delete("blogs", blogId);
    if (!deletedBlog) return sendResponse(res, 404, "Blog not found", null);

    sendResponse(res, 200, "Blog deleted successfully", deletedBlog);
  } catch (error) {
    sendResponse(res, 500, error.message, error);
  }
};
