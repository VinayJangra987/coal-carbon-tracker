import Mine from "../models/Mine.js";

export const getMines = async (req, res) => {
  try {
    const mines = await Mine.find().sort({ name: 1 });

    res.json(mines);
  } catch (err) {
    res.status(500).json({
      message: "Failed to fetch mines",
      error: err.message,
    });
  }
};

export const getMine = async (req, res) => {
  try {
    const mine = await Mine.findById(req.params.id);

    if (!mine) {
      return res.status(404).json({
        message: "Mine not found",
      });
    }

    res.json(mine);
  } catch (err) {
    res.status(500).json({
      message: "Failed to fetch mine",
      error: err.message,
    });
  }
};

export const createMine = async (req, res) => {
  try {
    const mine = await Mine.create(req.body);

    res.status(201).json(mine);
  } catch (err) {
    res.status(400).json({
      message: "Failed to create mine",
      error: err.message,
    });
  }
};

export const updateMine = async (req, res) => {
  try {
    const mine = await Mine.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!mine) {
      return res.status(404).json({
        message: "Mine not found",
      });
    }

    res.json(mine);
  } catch (err) {
    res.status(400).json({
      message: "Failed to update mine",
      error: err.message,
    });
  }
};

export const deleteMine = async (req, res) => {
  try {
    const mine = await Mine.findByIdAndDelete(req.params.id);

    if (!mine) {
      return res.status(404).json({
        message: "Mine not found",
      });
    }

    res.json({
      message: "Mine deleted",
    });
  } catch (err) {
    res.status(500).json({
      message: "Failed to delete mine",
      error: err.message,
    });
  }
};