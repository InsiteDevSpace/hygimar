import Livreur from "../models/livreurModel.js";

export const create = async (req, res) => {
  try {
    const { fname, lname, email, password, phone, city } = req.body;

    const newLivreur = new Livreur({
      fname,
      lname,
      email,
      password,
      phone,
      city,
    });

    const savedLivreur = await newLivreur.save();
    res.status(201).json(savedLivreur); // Return the full livreur data
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getAll = async (req, res) => {
  try {
    const livreurData = await Livreur.find();

    if (!livreurData) {
      return res.status(404).json({ msg: "Livreur data not found" });
    }

    res.status(200).json(livreurData);
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

export const getById = async (req, res) => {
  try {
    const id = req.params.id;
    const livreurData = await Livreur.findById(id);

    if (!livreurData) {
      return res.status(404).json({ msg: "Livreur not found" });
    }

    res.status(200).json(livreurData);
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

export const updateLivreur = async (req, res) => {
  try {
    const updatedLivreur = await Livreur.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedLivreur) {
      return res.status(404).json({ msg: "Livreur not found" });
    }
    res.json(updatedLivreur);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteLivreur = async (req, res) => {
  try {
    const deletedLivreur = await Livreur.findByIdAndDelete(req.params.id);
    if (!deletedLivreur) {
      return res.status(404).json({ msg: "Livreur not found" });
    }
    res.json({ msg: "Livreur deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
