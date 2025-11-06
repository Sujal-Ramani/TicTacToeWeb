const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const gameController = require("../controllers/gameController");

router.post("/", auth, gameController.createGame);
router.get("/", auth, gameController.listGames);
router.get("/:id", auth, gameController.getGame);
router.put("/:id/move", auth, gameController.makeMove);
router.delete("/:id", auth, gameController.deleteGame);

module.exports = router;
