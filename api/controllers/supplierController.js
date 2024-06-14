import Supplier from "../models/supplierModel.js";

export const create = async (req, res) => {
  try {
    const { fullname, products_type, email, address, store, city, phone } =
      req.body;

    const newSupplier = new Supplier({
      fullname,
      phone,
      email,
      address,
      store,
      products_type,
      city,
    });

    const savedSupplier = await newSupplier.save();
    res.status(200).json(savedSupplier); // Return the full supplier data
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getAll = async (req, res) => {
  try {
    const allSuppliers = await Supplier.find();
    res.status(200).json(allSuppliers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getById = async (req, res) => {
  try {
    const id = req.params.id;
    const supplier = await Supplier.findById(id);
    if (!supplier) {
      return res.status(404).json({ msg: "Supplier not found" });
    }
    res.status(200).json(supplier);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updatesupplier = async (req, res) => {
  try {
    const id = req.params.id;
    const updatedSupplier = await Supplier.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!updatedSupplier) {
      return res.status(404).json({ msg: "Supplier not found" });
    }
    res
      .status(200)
      .json({ msg: "Supplier updated successfully", data: updatedSupplier });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deletesupplier = async (req, res) => {
  try {
    const id = req.params.id;
    const deletedSupplier = await Supplier.findByIdAndDelete(id);
    if (!deletedSupplier) {
      return res.status(404).json({ msg: "Supplier not found" });
    }
    res
      .status(200)
      .json({ msg: "Supplier deleted successfully", data: deletedSupplier });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
