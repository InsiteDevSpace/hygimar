import Invoice from "../models/invoiceModel.js";

export const create = async (req, res) => {
  try {
    const invoiceData = new Invoice(req.body);
    if (!invoiceData) {
      return res.status(404).json({ msg: "Invoice data not found" });
    }
    const savedData = await invoiceData.save();
    //res.status(200).json(savedData);

    res.status(200).json({ msg: "Invoice created successfully" });
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

export const getAll = async (req, res) => {
  try {
    const invoiceData = await Invoice.find();

    if (!invoiceData) {
      return res.status(404).json({ msg: "Invoice data not found" });
    }

    res.status(200).json(invoiceData);
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

export const getById = async (req, res) => {
  try {
    const id = req.params.id;
    const invoiceData = await Invoice.findById(id);

    if (!invoiceData) {
      return res.status(404).json({ msg: "Invoice not found" });
    }

    res.status(200).json(invoiceData);
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

export const updateInvoice = async (req, res) => {
  try {
    const id = req.params.id;
    const invoiceData = await Invoice.findById(id);

    if (!invoiceData) {
      return res.status(404).json({ msg: "Invoice not found" });
    }
    const invoice = await Invoice.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    res.status(200).json({ msg: "Invoice updated successfully" });
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

export const deleteInvoice = async (req, res) => {
  try {
    const id = req.params.id;
    const invoiceData = await Invoice.findById(id);

    if (!invoiceData) {
      return res.status(404).json({ msg: "Invoice not found" });
    }
    const invoice = await Invoice.findByIdAndDelete(id);

    res.status(200).json({ msg: "Invoice deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error });
  }
};
