import Client from "../models/clientModel.js";

export const create = async (req, res) => {
  try {
    const clientData = new Client(req.body);
    if (!clientData) {
      return res.status(404).json({ msg: "Client data not found" });
    }
    const savedData = await clientData.save();

    res.status(200).json({ msg: "Client created successfully" });
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

export const getAll = async (req, res) => {
  try {
    const clientData = await Client.find();

    if (!clientData) {
      return res.status(404).json({ msg: "Client not found" });
    }

    res.status(200).json(clientData);
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

export const getById = async (req, res) => {
  try {
    const id = req.params.id;
    const clientData = await Client.findById(id);

    if (!clientData) {
      return res.status(404).json({ msg: "Client not found" });
    }

    res.status(200).json(clientData);
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

export const updateClient = async (req, res) => {
  try {
    const id = req.params.id;
    const clientData = await Client.findById(id);

    if (!clientData) {
      return res.status(404).json({ msg: "Client not found" });
    }
    const client = await Client.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    res.status(200).json({ msg: "Client updated successfully" });
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

export const deleteClient = async (req, res) => {
  try {
    const deletedClient = await Client.findByIdAndDelete(req.params.id);
    if (!deletedClient) {
      return res.status(404).json({ msg: "Client not found" });
    }
    res.json({ msg: "Client deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
