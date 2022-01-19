const Cars = require("./cars-model");
const vinValidator = require("vin-validator");

const checkCarId = async (req, res, next) => {
  const { id } = req.params;
  try {
    const fetchedCar = await Cars.getById(id);
    if (!fetchedCar) {
      res.status(404).json({ message: `car with id ${id} is not found` });
    } else {
      req.car = fetchedCar;
      next();
    }
  } catch (err) {
    next(err);
  }
};

const checkCarPayload = (req, res, next) => {
  const { vin, make, model, mileage } = req.body;
  if (vin === undefined) {
    next({ status: 400, message: "vin is missing" });
  } else if (make === undefined) {
    next({ status: 400, message: "make is missing" });
  } else if (model === undefined) {
    next({ status: 400, message: "model is missing" });
  } else if (mileage === undefined) {
    next({ status: 400, message: "mileage is missing" });
  } else {
    next();
  }
};

const checkVinNumberValid = async (req, res, next) => {
  const { vin } = req.body;
  const isVinValid = await vinValidator.validate(vin);
  if (isVinValid === false) {
    next({ status: 400, message: `vin ${vin} is invalid` });
  } else {
    next();
  }
};

const checkVinNumberUnique = async (req, res, next) => {
  try {
    const existing = await Cars.getByVin(req.body.vin);
    if (existing) {
      next({ status: 400, message: `vin ${req.body.vin} already exists` });
    } else {
      next();
    }
  } catch (err) {
    next(err);
  }
};

module.exports = {
  checkCarId,
  checkCarPayload,
  checkVinNumberValid,
  checkVinNumberUnique,
};