import livraison from "../models/livraisonModel.js";

export const create = async (req, res) => {
  try {
    const livraisonData = new livraison(req.body);
    if (!livraisonData) {
      return res.status(404).json({ msg: "livraison data not found" });
    }
    const savedData = await livraisonData.save();
    //res.status(200).json(savedData);

    res.status(200).json({ msg: "livraison created successfully" });
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

export const getAll = async (req, res) => {
  try {
    const livraisonData = await livraison.find();

    if (!livraisonData) {
      return res.status(404).json({ msg: "livraison data not found" });
    }

    res.status(200).json(livraisonData);
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

export const getById = async (req, res) => {
  try {
    const id = req.params.id;
    const livraisonData = await livraison.findById(id);

    if (!livraisonData) {
      return res.status(404).json({ msg: "livraison not found" });
    }

    res.status(200).json(livraisonData);
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

export const updatelivraison = async (req, res) => {
  try {
    const id = req.params.id;
    const livraisonData = await livraison.findById(id);

    if (!livraisonData) {
      return res.status(404).json({ msg: "livraison not found" });
    }
    const livraison = await livraison.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    res.status(200).json({ msg: "livraison updated successfully" });
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

export const deletelivraison = async (req, res) => {
  try {
    const id = req.params.id;
    const livraisonData = await livraison.findById(id);

    if (!livraisonData) {
      return res.status(404).json({ msg: "livraison not found" });
    }
    const livraison = await livraison.findByIdAndDelete(id);

    res.status(200).json({ msg: "livraison deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error });
  }
};
