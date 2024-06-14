import Role from "../models/roleModel.js";

export const create = async (req, res) => {
  try {
    const { role_name } = req.body;

    if (!role_name) {
      return res.status(400).json({ msg: "Role name is required" });
    }

    const newRole = new Role({ role_name });
    await newRole.save();

    res.status(201).json({ msg: "Role created successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getAll = async (req, res) => {
  try {
    const roleData = await Role.find();

    if (!roleData) {
      return res.status(404).json({ msg: "role data not found" });
    }

    res.status(200).json(roleData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getById = async (req, res) => {
  try {
    const id = req.params.id;
    const roleData = await Role.findById(id);

    if (!roleData) {
      return res.status(404).json({ msg: "role not found" });
    }

    res.status(200).json(roleData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updaterole = async (req, res) => {
  try {
    const id = req.params.id;
    const { role_name } = req.body;

    const role = await Role.findByIdAndUpdate(id, { role_name }, { new: true });

    if (!role) {
      return res.status(404).json({ msg: "role not found" });
    }

    res.status(200).json({ msg: "role updated successfully", data: role });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleterole = async (req, res) => {
  try {
    const id = req.params.id;
    const role = await Role.findByIdAndDelete(id);

    if (!role) {
      return res.status(404).json({ msg: "role not found" });
    }

    res.status(200).json({ msg: "role deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
