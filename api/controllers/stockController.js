import Stock from "../models/stockModel.js";

// Create new stock
export const create = async (req, res) => {
  try {
    const stockData = new Stock(req.body);
    await stockData.save();
    res
      .status(200)
      .json({ msg: "Stock created successfully", stock: stockData });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all stocks
export const getAll = async (req, res) => {
  try {
    const stockData = await Stock.find().populate("id_supplier");
    if (!stockData) {
      return res.status(404).json({ msg: "No stock data found" });
    }
    res.status(200).json(stockData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get stock by ID
export const getById = async (req, res) => {
  try {
    const id = req.params.id;
    const stockData = await Stock.findById(id).populate("id_supplier");
    if (!stockData) {
      return res.status(404).json({ msg: "Stock not found" });
    }
    res.status(200).json(stockData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update stock
export const updatestock = async (req, res) => {
  try {
    const id = req.params.id;
    const stockData = await Stock.findById(id);

    if (!stockData) {
      return res.status(404).json({ msg: "Stock not found" });
    }
    const updatedStock = await Stock.findByIdAndUpdate(id, req.body, {
      new: true,
    }).populate("id_supplier");
    res
      .status(200)
      .json({ msg: "Stock updated successfully", stock: updatedStock });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete stock
export const deletestock = async (req, res) => {
  try {
    const id = req.params.id;
    const stockData = await Stock.findById(id);

    if (!stockData) {
      return res.status(404).json({ msg: "Stock not found" });
    }
    await Stock.findByIdAndDelete(id);
    res.status(200).json({ msg: "Stock deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
