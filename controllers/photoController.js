const { isAuthorized } = require("../middlewares/authMiddleware.js");
const Photo = require("../models/Photo.js");
const photoService = require("../services/photoService.js");
const { errorHelper } = require("../utils/errorHelpers.js");
// const isOwner = require("../utils/validationHelper.js");

const photoController = require("express").Router();

photoController.get("/create", isAuthorized, (req, res) => {
  res.render("create", {
    title: "Add photos",
  });
});

photoController.post("/create", isAuthorized, async (req, res) => {
  try {
    await photoService.create(req.body, req.user._id);
    res.redirect("/");
  } catch (err) {
    const errors = errorHelper(err);
    res.render("create", {
      title: "Create",
      errors,
    });
  }
});

photoController.get("/catalog", async (req, res) => {
  try {
    const photos = await photoService.getAll();
    res.render("catalog", {
      title: "Photo Catalog",
      photos,
    });
  } catch (err) {
    const errors = errorHelper(err);
    res.render("catalog", {
      title: "Photo Catalog",
      errors,
    });
  }
});

// photoController.get("/:id/details", async (req, res) => {
//   try {
//     const game = await photoService.getById(req.params.id);
//     const isOwner = req.user?._id == game.owner._id;
//     let hasBought = false;
//     const parsedBuys = JSON.parse(JSON.stringify(game.boughtBy));
//     const idArr = parsedBuys.map((x) => x._id);
//     if (idArr.includes(req.user?._id)) {
//       //CHANGE PROPERTIES ACCORDING TO THE TASK
//       hasBought = true;
//     }

//     //   const votesString = parsedVotes.map(x => x.email).join(', ')

//     res.render("details", {
//       title: "Details",
//       game,
//       isOwner,
//       hasBought,
//       // votesString,
//       parsedBuys,
//     });
//   } catch (err) {
//     const errors = errorHelper(err);
//     res.render("details", {
//       title: "Details",
//       errors,
//     });
//   }
// });

// photoController.get("/:id/buy", isAuthorized, async (req, res) => {
//   const gameId = req.params.id;
//   const userId = req.user._id;
//   try {
//     const game = await photoService.getById(gameId);
//     let hasBought = false;
//     const parsedBuys = JSON.parse(JSON.stringify(game.boughtBy));
//     const idArr = parsedBuys.map((x) => x._id);
//     if (idArr.includes(req.user?._id)) {
//       hasBought = true;
//     }
//     if (hasBought) {
//       throw new Error("You have already bought this game");
//     }

//     await photoService.buy(gameId, userId);
//     res.redirect(`/photos/${gameId}/details`);
//   } catch (err) {
//     const errors = errorHelper(err);
//     res.render("home", {
//       title: "Home",
//       errors,
//     });
//   }
// });

// photoController.get("/:id/edit", isAuthorized, async (req, res) => {
//   try {
//     const gameId = req.params.id;
//     const game = await photoService.getById(gameId);

//     const isOwner = req.user?._id == game.owner._id;
//     if (!isOwner) throw new Error("You are not the owner of this game");

//     res.render("edit", {
//       title: "Edit",
//       game,
//     });
//   } catch (err) {
//     const errors = errorHelper(err);
//     res.render("edit", {
//       title: "Photo Edit",
//       errors,
//     });
//   }
// });

// photoController.post("/:id/edit", isAuthorized, async (req, res) => {
//   const gameData = req.body;
//   const gameId = req.params.id;
//   const game = await photoService.getById(gameId);

//   const isOwner = req.user?._id == game.owner._id;
//   if (!isOwner) throw new Error("You are not the owner of this game");

//   try {
//     await photoService.edit(game._id, gameData);
//     res.redirect(`/photos/${game._id}/details`);
//   } catch (err) {
//     const errors = errorHelper(err);
//     res.render("edit", {
//       title: "Edit",
//       errors,
//     });
//   }
// });

// photoController.get("/:id/delete", isAuthorized, async (req, res) => {
//   const gameId = req.params.id;
//   const game = await photoService.getById(gameId);

//   try {
//     const isOwner = req.user?._id == game.owner._id;
//     if (!isOwner) throw new Error("You are not the owner of this game");
//     await photoService.del(gameId);
//     res.redirect("/photos/catalog");
//   } catch (err) {
//     const errors = errorHelper(err);
//     res.render("home", {
//       errors,
//     });
//   }
// });

// photoController.get('/search',async (req,res) => {
//     try {
//         const photos = await photoService.getAll()
//         res.render('search',{
//             title : 'Search Games',
//             photos
//         })
//     } catch (err) {
//         const errors = errorHelper(err);
//         res.render("home", {
//           errors,
//         });
//     }
// })

// photoController.post('/search',async (req,res) => {
//     try {
//         const gameName = req.body.name
//         const gamePlatform = req.body.platform
//         let photos = await photoService.getAll()
//         if(gameName && gamePlatform ){ 
//         photos = await Photo.find({ name: { $regex: name, $options: "i" },platform : { $regex : gamePlatform}, $options : 'i' }).lean();
//         }else if (gameName){
//             photos = await photoService.find(gameName)
//         }else if (gamePlatform){
//             photos = await Photo.find({platform : { $regex : gamePlatform, $options : 'i'} }).lean();
//         }
//         console.log(req.body);
//         res.render('search',{
//             title : 'Search Games',
//             photos

//         })
//     } catch (err) {
//         const errors = errorHelper(err);
//         res.render("home", {
//           errors,
//         });
//     }
// })

module.exports = photoController;
