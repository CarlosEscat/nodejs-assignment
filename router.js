const { Router } = require("express");
const router = new Router();
const mongoose = require("mongoose");
const ObjectID = require("mongodb").ObjectID;
mongoose.connect("mongodb://localhost:27017/myproject", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", error => console.error(error));
db.once("open", () => console.log("connected to database"));

const VehicleData = db.collection("vehicleData");

//Getting all the data
router.get("/", async (req, res) => {
  try {
    await VehicleData.find({}).toArray(function(err, result) {
      res.json(result);
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//Getting message by id
router.get("/id/:Id", getMessage, (req, res) => {
  res.json(res.message);
});

//Update message by id number
router.patch("/:Id", getMessage, async (req, res) => {
  console.log("MESSAGE ID: " + res.message._id);
  const newMsg = {
    _id: res.message._id,
    msg: {
      time: res.message.msg.time,
      energy: res.message.msg.energy,
      gps: res.message.msg.gps,
      odo: res.message.msg.odo,
      speed: res.message.msg.speed,
      soc: res.message.msg.soc
    }
  };
  if (req.body.id != null) {
    newMsg._id = parseInt(req.body.id);
  }
  if (req.body.time != null) {
    newMsg.msg.time = parseInt(req.body.time);
  }
  if (req.body.energy != null) {
    newMsg.msg.energy = parseFloat(req.body.energy);
  }
  if (req.body.gps != null) {
    newMsg.msg.gps = req.body.gps;
  }
  if (req.body.odo != null) {
    newMsg.msg.odo = parseFloat(req.body.odo);
  }
  if (req.body.speed != null) {
    newMsg.msg.speed = parseInt(req.body.speed);
  }
  if (req.body.soc != null) {
    newMsg.msg.soc = parseFloat(req.body.soc);
  }
  try {
    await VehicleData.updateOne(
      { _id: res.message._id },
      {
        $set: {
          msg: {
            time: newMsg.msg.time,
            energy: newMsg.msg.energy,
            gps: newMsg.msg.gps,
            odo: newMsg.msg.odo,
            speed: newMsg.msg.speed,
            soc: newMsg.msg.soc
          }
        }
      },
      function(error, result) {
        if (error) console.log("Error: ", error);
        else console.log("Message updated.");
      }
    );
    res.json({ message: "Message updated successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//Posting new message
router.post("/message", async (req, res, next) => {
  //const newMsg = req.body;
  const newMsg = {
    _id: parseInt(req.body.id),
    msg: {
      time: parseInt(req.body.time),
      energy: parseInt(req.body.energy),
      gps: req.body.gps,
      odo: parseInt(req.body.odo),
      speed: rparseInt(eq.body.speed),
      soc: parseInt(req.body.soc)
    }
  };
  try {
    await VehicleData.insertOne(newMsg);
    res.json({ message: "Message added successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
  next();
});

//Delete message by id
router.delete("/id/:Id", async (req, res) => {
  const msgId = parseInt(req.params.Id);

  try {
    await VehicleData.deleteOne({ _id: msgId });
    res.json({ message: "Deleted message with Id:" + req.params.Id });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//Middleware function to find messages by id
async function getMessage(req, res, next) {
  const msgId = parseInt(req.params.Id);

  try {
    message = await VehicleData.findOne({ _id: msgId });
    if (message == null) {
      return res.status(404).json({ message: "Cant find message" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
  res.message = message;
  next();
}

module.exports = router;
