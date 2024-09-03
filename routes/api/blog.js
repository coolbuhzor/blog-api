import express from "express";
import {
  addBlog,
  deleteBlog,
  getBlog,
  updateBlog,
} from "../../controllers/blogController.js";
const router = express.Router();

router.route("/").get(getBlog).post(addBlog);
router.route("/:id").put(updateBlog).delete(deleteBlog);

// router.use("/:id").put().get().delete();

export default router;
