import fs from 'fs';
import imagekit from '../config/imageKit.js';
import Blog from '../models/Blog.js';
import Comment from '../models/Comment.js';
import main from '../config/gemini.js';

export const addBlog = async (req, res) => {
    try {
        const { title, subTitle, description, category, isPublished } = JSON.parse
            (req.body.blog);
        const imageFile = req.file;

        // check if all fields are present
        if (!title || !description || !category || !imageFile) {
            return res.json({ success: false, message: "Missing Required Fields." })
        }
        const fileBuffer = fs.readFileSync(imageFile.path)
        // upload image on imagekit
        const response = await imagekit.upload({
            file: fileBuffer,
            fileName: imageFile,
            folder: "/blogs"
        })
        // optimization through imagekit url transformation..
        const optimizedImageUrl = imagekit.url({
            path: response.filePath,
            transformation: [
                { quality: 'auto' }, //Auto Compression
                { format: 'webp' },  //Convert  to modern format
                { width: '1280' }    //Width resizing
            ]
        });
        const image = optimizedImageUrl;

        await Blog.create({ title, subTitle, description, category, image, isPublished })
        res.json({ success: true, message: "Blogg added successfully!" })
    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}

// controller to get the list of all blogs..
export const getAllBlog = async (req, res) => {
    try {
        const blogs = await Blog.find({ isPublished: true })

        res.json({ success: true, blogs })
    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}
// controller for getting blog by id

export const getBlogById = async (req, res) => {
  
  try {
    const { blogId } = req.params;
    const blog = await Blog.findById(blogId);

    if (!blog) {
      return res.json({ success: false, message: "Blog not found" });
    }

    res.json({ success: true, blog });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// controller to delete the blog..
export const deleteBlogById = async (req, res) => {
    try {
        const { id } = req.body;
        await Blog.findByIdAndDelete(id);

        // Delete  all comments associated with blog
        await Comment.deleteMany({ blog: id })
        res.json({ success: true, message: "Blog is deleted successfully" })
    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}

// controller to update the blog status..
export const togglePublish = async (req, res) => {
    try {
        const { id } = req.body;
        const blog = await Blog.findById(id);
        blog.isPublished = !blog.isPublished;
        await blog.save()
        res.json({ success: true, message: "Blog status updated" })
    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}

// controller to add comment in blog..
export const addComment = async (req, res) => {
    try {
        const { blog, name, content } = req.body
        await Comment.create({ blog, name, content });
        res.json({ success: true, message: "Comment Added for Review" })
    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}

// controller to  get blog comments..
export const getBlogComments = async (req, res) => {
    try {
        const { blogId } = req.body;
        const comments = await Comment.find({ blog: blogId, isApproved: true }).sort({ createdAt: -1 });
        res.json({ success: true, comments })
    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}
// controller to generate content through ai
export const generateContent=async(req,res)=>{
    try {
        const {prompt}=req.body;
        const content=await main(prompt+'Generate a blog content  for this topic in simple text format')
        res.json({success:true,content})
    } catch (error) {
        res.json({success:false,message:error.message})
    }
}