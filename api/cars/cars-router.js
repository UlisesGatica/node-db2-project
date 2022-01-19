// DO YOUR MAGIC
const express = require("express");
const knex = require("knex");

const db = knex({
  client: "sqlite3",
  connection: {
    filename: "../../data/dealer.db3",
  },
  useNullAsDefault: true,
});

const router = express.Router();
const {
  checkCarId,
  checkCarPayload,
  checkVinNumberValid,
  checkVinNumberUnique,
} = require("./cars-middleware");
const Cars = require("./cars-model");

router.get("/", (req, res, next) => {
  Cars.getAll()
    .then((cars) => {
      res.status(200).json(cars);
    })
    .catch(next);
});

router.get("/:id", checkCarId, (req, res, next) => {
  res.status(200).json(req.car);
});

router.post(
  "/",
  checkCarPayload,
  checkVinNumberValid,
  checkVinNumberUnique,
  async (req, res, next) => {
    try {
      const newCar = await Cars.create(req.body);
      res.status(201).json(newCar);
    } catch (err) {
      next(err);
    }
  }
);

router.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    message: err.message,
    stack: err.stack,
  });
});

module.exports = router;