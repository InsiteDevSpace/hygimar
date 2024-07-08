import Product from "../models/productModel.js";
import multer from "multer";
import path from "path";
import fs from "fs";

// Setup multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Adjust the destination as per your project structure
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`);
  },
});

const upload = multer({ storage });

export const uploadFiles = upload.fields([
  { name: "images", maxCount: 5 },
  { name: "tec_sheet", maxCount: 1 },
]);

// Create Product
export const create = async (req, res) => {
  try {
    const {
      name,
      description,
      id_catg,
      id_subcatg,
      id_subsubcatg,
      id_mark,
      quantity,
      inStock,
      primaryImage: bodyPrimaryImage,
    } = req.body;

    const images = req.files?.images
      ? req.files.images.map((file) => file.path)
      : [];
    const tec_sheet = req.files?.tec_sheet ? req.files.tec_sheet[0].path : null;

    // Ensure primaryImage is a valid path from the uploaded images or default to the first image
    const primaryImage =
      bodyPrimaryImage && images.includes(`uploads/${bodyPrimaryImage}`)
        ? `uploads/${bodyPrimaryImage}`
        : images.length > 0
        ? images[0]
        : null;

    const product = new Product({
      name,
      description,
      images,
      primaryImage,
      tec_sheet,
      id_catg,
      id_subcatg: id_subcatg === "null" ? null : id_subcatg,
      id_subsubcatg: id_subsubcatg === "null" ? null : id_subsubcatg,
      id_mark: id_mark === "null" ? null : id_mark,
      quantity,
      inStock,
    });

    const savedProduct = await product.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    console.error("Error adding product:", error);
    res.status(500).json({ error: error.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      description,
      id_catg,
      id_subcatg,
      id_subsubcatg,
      id_mark,
      quantity,
      inStock,
      primaryImage,
    } = req.body;

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Update the product fields
    product.name = name;
    product.description = description;
    product.id_catg = id_catg;
    product.id_subcatg =
      id_subcatg === "null" || id_subcatg === "" ? null : id_subcatg;
    product.id_subsubcatg =
      id_subsubcatg === "null" || id_subsubcatg === "" ? null : id_subsubcatg;
    product.id_mark = id_mark === "null" || id_mark === "" ? null : id_mark;
    product.quantity = quantity;
    product.inStock = inStock;
    product.primaryImage = primaryImage;

    // Handle image files
    if (req.files && req.files.images) {
      // Delete the old image files if they exist
      product.images.forEach((image) => {
        fs.unlinkSync(image);
      });
      product.images = req.files.images.map((file) => file.path);
    }

    // Handle technical sheet file
    if (req.files && req.files.tec_sheet) {
      // Delete the old technical sheet file if it exists
      if (product.tec_sheet) {
        fs.unlinkSync(product.tec_sheet);
      }
      product.tec_sheet = req.files.tec_sheet[0].path;
    }

    const updatedProduct = await product.save();
    res.status(200).json(updatedProduct);
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ error: error.message });
  }
};

export const getAll = async (req, res) => {
  try {
    const productData = await Product.find()
      .populate("id_catg")
      .populate("id_subcatg")
      .populate("id_subsubcatg")
      .populate("id_mark")
      .sort({ createdAt: -1 }); // Sort by creation date in descending order

    if (!productData) {
      return res.status(404).json({ msg: "Product data not found" });
    }

    res.status(200).json(productData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getById = async (req, res) => {
  try {
    const id = req.params.id;
    const productData = await Product.findById(id)
      .populate("id_catg")
      .populate("id_subcatg")
      .populate("id_subsubcatg")
      .populate("id_mark");

    if (!productData) {
      return res.status(404).json({ msg: "Product not found" });
    }

    res.status(200).json(productData);
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const id = req.params.id;
    const productData = await Product.findById(id);

    if (!productData) {
      return res.status(404).json({ msg: "Product not found" });
    }

    // Delete the old image files if they exist
    productData.images.forEach((image) => {
      fs.unlinkSync(image);
    });

    // Delete the old technical sheet file if it exists
    if (productData.tec_sheet) {
      fs.unlinkSync(productData.tec_sheet);
    }

    await Product.findByIdAndDelete(id);
    res.status(200).json({ msg: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate("id_catg")
      .populate("id_subcatg")
      .populate("id_subsubcatg")
      .populate("id_mark");

    if (!product) {
      return res.status(404).send("Product not found");
    }

    // console.log(product); // Debugging line to check the product object
    res.json(product); // Send product as JSON response
  } catch (error) {
    console.error("Error fetching product:", error.message);
    res.status(500).send("Error loading product details");
  }
};

export const getRelatedProducts = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate("id_catg")
      .populate("id_subcatg")
      .sort({ createdAt: -1 }); // Sort by creation date in descending order

    if (!product) {
      return res.status(404).send("Product not found");
    }

    let relatedProductsQuery = {
      id_catg: product.id_catg._id,
      _id: { $ne: product._id },
    };

    // Add subcategory condition only if the product has a subcategory
    if (product.id_subcatg) {
      relatedProductsQuery.id_subcatg = product.id_subcatg._id;
    }

    // Find related products by the same category and subcategory, excluding the current product
    const relatedProducts = await Product.find(relatedProductsQuery).limit(5); // Limit the number of related products returned

    res.json(relatedProducts);
  } catch (error) {
    console.error("Error fetching related products:", error.message);
    res.status(500).send("Error fetching related products");
  }
};

// Get products by category ID
export const getProductsByCategory = async (req, res) => {
  try {
    const categoryId = req.params.categoryId;
    const products = await Product.find({ id_catg: categoryId })
      .populate("id_catg")
      .populate("id_subcatg")
      .populate("id_subsubcatg")
      .populate("id_mark")
      .sort({ createdAt: -1 }); // Sort by creation date in descending order

    if (!products) {
      return res
        .status(404)
        .json({ msg: "No products found for this category" });
    }

    res.status(200).json(products);
  } catch (error) {
    console.error("Error fetching products:", error.message);
    res.status(500).json({ error: error.message });
  }
};
