import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import axios from "axios"; // Ensure axios is imported

import userRoute from "./routes/userRoute.js";
import stockRoute from "./routes/stockRoute.js";
import productRoute from "./routes/productRoute.js";
import authRoute from "./routes/authRoute.js";
import livreurRoute from "./routes/livreurRoute.js";
import invoiceRoute from "./routes/invoiceRoute.js";
import clientRoute from "./routes/clientRoute.js";
import supplierRoute from "./routes/supplierRoute.js";
import livraisonRoute from "./routes/livraisonRoute.js";
import roleRoute from "./routes/roleRoute.js";
import categoryRoute from "./routes/categoryRoute.js";
import orderRoute from "./routes/orderRoute.js";
import markRoute from "./routes/markRoute.js";
import subcategoryRoute from "./routes/subcategoryRoute.js";
import subsubcategoryRoute from "./routes/subsubcategoryRoute.js";

const IMAGE_BASE_URL = process.env.IMAGE_BASE_URL;

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Express app

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Parse URL-encoded bodies (as sent by HTML forms)
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

// Serve static files from the 'uploads' directory
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const PORT = process.env.PORT || 7000;
const BASE_URL = process.env.BASE_URL || `http://localhost:${PORT}`;

// Middleware to parse JSON bodies
app.use(express.json());

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, "public")));

// Set the views directory
app.set("views", path.join(__dirname, "views"));

// Connect to db
const URL = process.env.MONGOURL;
mongoose
  .connect(URL)
  .then(() => {
    console.log("DB connected successfully");
    app.listen(PORT, () => {
      console.log(`Server is running on port: ${PORT} `);
    });
  })
  .catch((error) => console.log(error));

// Auth
app.use("/api/auth", authRoute);

// Routes
app.use("/api/user", userRoute);
app.use("/api/role", roleRoute);
app.use("/api/stock", stockRoute);
app.use("/api/product", productRoute);
app.use("/api/invoice", invoiceRoute);
app.use("/api/client", clientRoute);
app.use("/api/supplier", supplierRoute);
app.use("/api/livraison", livraisonRoute);
app.use("/api/livreur", livreurRoute);
app.use("/api/category", categoryRoute);
app.use("/api/subcategory", subcategoryRoute);
app.use("/api/subsubcategory", subsubcategoryRoute);
app.use("/api/order", orderRoute);
app.use("/api/mark", markRoute);

app.get("/", async (req, res) => {
  try {
    const [categoriesResponse, marksResponse, productsResponse] =
      await Promise.all([
        axios.get(`${BASE_URL}/api/category/getcatg`),
        axios.get(`${BASE_URL}/api/mark/getall`),
        axios.get(`${BASE_URL}/api/product/get10products`),
      ]);

    const categories = categoriesResponse.data;
    const marks = marksResponse.data;
    const products = productsResponse.data;

    //console.log("Fetched categories:", categories);
    //console.log("Fetched marked categories:", marks);
    //console.log("Fetched products:", products);

    res.render("index", { categories, marks, products, IMAGE_BASE_URL });
  } catch (error) {
    console.error("Error fetching data:", error.message);
    res.status(500).send("Error loading data");
  }
});

app.get("/a-propos", async (req, res) => {
  try {
    console.log(`Fetching categories and products from ${BASE_URL}`);
    const [categoriesResponse, marksResponse] = await Promise.all([
      axios.get(`${BASE_URL}/api/category/getcatg`),
      axios.get(`${BASE_URL}/api/mark/getall`),
    ]);

    const categories = categoriesResponse.data;
    const marks = marksResponse.data;

    res.render("about", { categories, marks });
  } catch (error) {
    console.error("Error fetching data:", error.message);
    res.status(500).send("Error loading data");
  }
});

app.get("/produit/:id", async (req, res) => {
  try {
    const [
      categoriesResponse,
      productResponse,
      marksResponse,
      relatedProductsResponse,
    ] = await Promise.all([
      axios.get(`${BASE_URL}/api/category/getcatg`),
      axios.get(`${BASE_URL}/api/product/details/${req.params.id}`),
      axios.get(`${BASE_URL}/api/mark/getall`),
      axios.get(`${BASE_URL}/api/product/related/${req.params.id}`),
    ]);

    const categories = categoriesResponse.data;
    const product = productResponse.data;
    const relatedProducts = relatedProductsResponse.data;
    const marks = marksResponse.data;

    res.render("productDetails", {
      product,
      products: relatedProducts,
      categories,
      marks,
      IMAGE_BASE_URL,
    });
  } catch (error) {
    console.error("Error fetching product:", error.message);
    res.status(500).send("Error loading product details");
  }
});

app.get("/marque/:markId", async (req, res) => {
  try {
    const [categoriesResponse, marksResponse] = await Promise.all([
      axios.get(`${BASE_URL}/api/category/getcatg`),
      axios.get(`${BASE_URL}/api/mark/getall`),
    ]);

    const markId = req.params.markId;
    const response = await axios.get(
      `${BASE_URL}/api/category/detailsmarked/${markId}`
    );

    const categories = categoriesResponse.data;
    const marks = marksResponse.data;

    const { mark, products } = response.data;

    res.render("mark", {
      mark,
      products,
      categories,
      marks, // Pass marks here
      IMAGE_BASE_URL,
    });
  } catch (error) {
    console.error("Error fetching products for category:", error.message);
    res.status(500).send("Error loading products for category");
  }
});

app.get("/categorie/:categoryId", async (req, res) => {
  try {
    const [categoriesResponse, marksResponse] = await Promise.all([
      axios.get(`${BASE_URL}/api/category/getcatg`),
      axios.get(`${BASE_URL}/api/mark/getall`),
    ]);

    const categoryId = req.params.categoryId;
    const response = await axios.get(
      `${BASE_URL}/api/category/details/${categoryId}`
    );

    const categories = categoriesResponse.data;
    const marks = marksResponse.data;

    const { category, products } = response.data;

    res.render("category", {
      category,
      products,
      categories,
      marks,
      IMAGE_BASE_URL,
    });
  } catch (error) {
    console.error("Error fetching products for category:", error.message);
    res.status(500).send("Error loading products for category");
  }
});

app.get("/subcategorie/:subcategoryId", async (req, res) => {
  try {
    const [categoriesResponse, marksResponse] = await Promise.all([
      axios.get(`${BASE_URL}/api/category/getcatg`),
      axios.get(`${BASE_URL}/api/mark/getall`),
    ]);

    const subcategoryId = req.params.subcategoryId;
    const response = await axios.get(
      `${BASE_URL}/api/subcategory/details/${subcategoryId}`
    );

    const categories = categoriesResponse.data;
    const marks = marksResponse.data;

    const { subcategory, products } = response.data;

    res.render("subcategory", {
      subcategory,
      products,
      categories,
      marks,
      IMAGE_BASE_URL,
    });
  } catch (error) {
    console.error("Error fetching products for subcategory:", error.message);
    res.status(500).send("Error loading products for subcategory");
  }
});

app.get("/contact", async (req, res) => {
  try {
    console.log(`Fetching categories and products from ${BASE_URL}`);
    const [categoriesResponse, marksResponse] = await Promise.all([
      axios.get(`${BASE_URL}/api/category/getcatg`),
      axios.get(`${BASE_URL}/api/mark/getall`),
    ]);

    const categories = categoriesResponse.data;
    const marks = marksResponse.data;

    res.render("contact", { categories, marks, IMAGE_BASE_URL });
  } catch (error) {
    console.error("Error fetching data:", error.message);
    res.status(500).send("Error loading data");
  }
});

app.get("/produits", async (req, res) => {
  try {
    const [categoriesResponse, marksResponse, productsResponse] =
      await Promise.all([
        axios.get(`${BASE_URL}/api/category/getcatg`),
        axios.get(`${BASE_URL}/api/mark/getall`),
        axios.get(`${BASE_URL}/api/product/getall`),
      ]);

    const categories = categoriesResponse.data;
    const marks = marksResponse.data;
    const products = productsResponse.data;

    //console.log("Fetched categories:", categories);
    //console.log("Fetched marked categories:", marks);
    //console.log("Fetched products:", products);

    res.render("shop", { categories, marks, products, IMAGE_BASE_URL });
  } catch (error) {
    console.error("Error fetching data:", error.message);
    res.status(500).send("Error loading data");
  }
});

app.get("/filter/subcategorie/:subcategoryId", async (req, res) => {
  try {
    const [categoriesResponse, marksResponse] = await Promise.all([
      axios.get(`${BASE_URL}/api/category/getcatg`),
      axios.get(`${BASE_URL}/api/mark/getall`),
    ]);

    const subcategoryId = req.params.subcategoryId;
    const response = await axios.get(
      `${BASE_URL}/api/subcategory/details/${subcategoryId}`
    );

    const categories = categoriesResponse.data;
    const marks = marksResponse.data;

    const { subcategory, products } = response.data;

    res.render("shop", {
      subcategory,
      products,
      categories,
      marks,
      IMAGE_BASE_URL,
    });
  } catch (error) {
    console.error("Error fetching products for subcategory:", error.message);
    res.status(500).send("Error loading products for subcategory");
  }
});

app.get("/filter/marque/:categoryId", async (req, res) => {
  try {
    const [categoriesResponse, marksResponse] = await Promise.all([
      axios.get(`${BASE_URL}/api/category/getcatg`),
      axios.get(`${BASE_URL}/api/mark/getall`),
    ]);

    const categoryId = req.params.categoryId;
    const response = await axios.get(
      `${BASE_URL}/api/category/detailsmarked/${categoryId}`
    );

    const categories = categoriesResponse.data;
    const marks = marksResponse.data;

    const { category, products } = response.data;

    res.render("shop", {
      category,
      products,
      categories,
      marks,
      IMAGE_BASE_URL,
    });
  } catch (error) {
    console.error("Error fetching products for category:", error.message);
    res.status(500).send("Error loading products for category");
  }
});

app.get("/filter/categorie/:categoryId", async (req, res) => {
  try {
    const [categoriesResponse, marksResponse] = await Promise.all([
      axios.get(`${BASE_URL}/api/category/getcatg`),
      axios.get(`${BASE_URL}/api/mark/getall`),
    ]);

    const categoryId = req.params.categoryId;
    const response = await axios.get(
      `${BASE_URL}/api/category/details/${categoryId}`
    );

    const categories = categoriesResponse.data;
    const marks = marksResponse.data;

    const { category, products } = response.data;

    res.render("shop", {
      category,
      products,
      categories,
      marks,
      IMAGE_BASE_URL,
    });
  } catch (error) {
    console.error("Error fetching products for category:", error.message);
    res.status(500).send("Error loading products for category");
  }
});

app.use((req, res, next) => {
  console.log(`Unhandled request: ${req.method} ${req.url}`);
  res.status(404).send("Not Found");
});
