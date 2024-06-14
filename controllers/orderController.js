import nodemailer from "nodemailer";
import { readFileSync } from "fs";
import path from "path";
import handlebars from "handlebars";
import Order from "../models/orderModel.js";
import Product from "../models/productModel.js";
import Client from "../models/clientModel.js";

// Setup Nodemailer transport
const transporter = nodemailer.createTransport({
  host: "smtp.titan.email",
  port: 587, // or 465 for SSL/TLS
  secure: false, // true for SSL/TLS
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Load and compile email templates
const adminTemplateSource = readFileSync(
  path.resolve("emails", "orderConfirmationAdmin.html"),
  "utf8"
);
const clientTemplateSource = readFileSync(
  path.resolve("emails", "orderConfirmationClient.html"),
  "utf8"
);

// Configure Handlebars runtime options to allow prototype property access
const handlebarOptions = {
  allowedProtoMethods: {
    name: true,
    quantity: true,
  },
  allowedProtoProperties: {
    name: true,
    quantity: true,
  },
};

const adminTemplate = handlebars.compile(adminTemplateSource, handlebarOptions);
const clientTemplate = handlebars.compile(
  clientTemplateSource,
  handlebarOptions
);

export const createOrderWithClient = async (req, res) => {
  try {
    const { clientDetails, orderDetails } = req.body;

    // Create a new client
    const client = new Client(clientDetails);
    const savedClient = await client.save();

    // Create a new order with the client ID
    const orderData = {
      client_id: savedClient._id,
      products: await Promise.all(
        orderDetails.products.map(async (product) => {
          const productInfo = await Product.findById(product.product_id);
          if (!productInfo) {
            throw new Error(`Product with ID ${product.product_id} not found`);
          }
          return {
            product_id: product.product_id,
            name: productInfo.name,
            quantity: product.quantity,
          };
        })
      ),
      totalQuantity: orderDetails.products.reduce(
        (sum, product) => sum + product.quantity,
        0
      ),
      sendNotif: orderDetails.sendNotif,
      notes: clientDetails.message,
    };

    const order = new Order(orderData);
    const savedOrder = await order.save();

    // Prepare email data
    const emailData = {
      clientName: savedClient.fullname,
      orderId: savedOrder._id,
      products: savedOrder.products.map((product) => ({
        name: product.name,
        quantity: product.quantity,
      })),
      totalQuantity: savedOrder.totalQuantity,
    };

    // Send email to admin
    const adminEmailHtml = adminTemplate(emailData);
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.ADMIN_EMAIL,
      subject: "New Order Received",
      html: adminEmailHtml,
    });

    // Send email to client if sendNotif is true
    if (orderDetails.sendNotif) {
      const clientEmailHtml = clientTemplate(emailData);
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: savedClient.email,
        subject: "Order Confirmation",
        html: clientEmailHtml,
      });
    }

    res
      .status(201)
      .json({ msg: "Order created successfully", order: savedOrder });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ error: error.message });
  }
};

export const create = async (req, res) => {
  try {
    const { client_id, products, sendNotif, notes } = req.body;

    const populatedProducts = await Promise.all(
      products.map(async (item) => {
        const product = await Product.findById(item.product_id);
        if (!product) {
          throw new Error(`Product with ID ${item.product_id} not found`);
        }
        return {
          product_id: product._id,
          name: product.name,
          quantity: item.quantity,
        };
      })
    );

    const totalQuantity = populatedProducts.reduce(
      (acc, product) => acc + product.quantity,
      0
    );

    const orderData = {
      client_id,
      products: populatedProducts,
      totalQuantity,
      sendNotif,
      notes,
    };

    const order = new Order(orderData);
    const savedOrder = await order.save();

    // Fetch client information
    const client = await Client.findById(client_id);
    if (!client) {
      throw new Error(`Client with ID ${client_id} not found`);
    }

    // Prepare email data
    const emailData = {
      clientName: client.fullname,
      orderId: savedOrder._id,
      products: savedOrder.products.map((product) => ({
        name: product.name,
        quantity: product.quantity,
      })),
      totalQuantity: savedOrder.totalQuantity,
    };

    // Send email to admin
    const adminEmailHtml = adminTemplate(emailData);
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.ADMIN_EMAIL,
      subject: "New Order Received",
      html: adminEmailHtml,
    });

    // Send email to client if sendNotif is true
    if (sendNotif) {
      const clientEmailHtml = clientTemplate(emailData);
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: client.email,
        subject: "Order Confirmation",
        html: clientEmailHtml,
      });
    }

    res.status(201).json(savedOrder);
  } catch (error) {
    console.error("Error adding order:", error);
    res.status(500).json({ error: error.message });
  }
};

export const getAll = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("client_id", "fullname")
      .populate("products.product_id", "name");
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getById = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id)
      .populate("client_id")
      .populate("products.product_id");
    if (!order) {
      return res.status(404).json({ msg: "Order not found" });
    }
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;
    const updatedOrder = await Order.findByIdAndUpdate(id, updatedData, {
      new: true,
    })
      .populate("client_id")
      .populate("products.product_id");
    if (!updatedOrder) {
      return res.status(404).json({ msg: "Order not found" });
    }
    res.status(200).json(updatedOrder);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedOrder = await Order.findByIdAndDelete(id);
    if (!deletedOrder) {
      return res.status(404).json({ msg: "Order not found" });
    }
    res.status(200).json({ msg: "Order deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
