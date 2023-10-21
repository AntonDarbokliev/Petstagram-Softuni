const { isAuthorized } = require("../middlewares/authMiddleware.js");
const Photo = require("../models/Photo.js");
const User = require("../models/User.js");
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

photoController.get("/:id/details", async (req, res) => {
  try {
    const photo = await photoService.getById(req.params.id);
    const isOwner = req.user?._id == photo.owner._id;
    // let hasBought = false;
    // const parsedComments = JSON.parse(JSON.stringify(photo.comments));
    // const idArr = parsedComments.map((x) => x.user._id);
    // if (idArr.includes(req.user?._id)) {
    //   //CHANGE PROPERTIES ACCORDING TO THE TASK
    //   hasBought = true;
    // }

    //   const votesString = parsedVotes.map(x => x.email).join(', ')

    console.log(photo);
    res.render("details", {
      title: "Details",
      photo,
      isOwner,
      // hasBought,
      // votesString,
      // parsedBuys,
    });
  } catch (err) {
    const errors = errorHelper(err);
    res.render("details", {
      title: "Details",
      errors,
    });
  }
});

photoController.post("/:id/comment", isAuthorized, async (req, res) => {
  try {
    const photoId = req.params.id;
    // const user =  req.user._id
    const user = req.user._id
    const {comment} = req.body

    await photoService.comment(photoId, {user,comment});
    res.redirect(`/photo/${photoId}/details`);
  } catch (err) {
    // const errors = errorHelper(err);
    // res.render("home", {
    //   title: "Home",
    //   errors,
    // });
    console.log(err);
  }
});

photoController.get("/:id/edit", isAuthorized, async (req, res) => {
  try {
    const photoId = req.params.id;
    const photo = await photoService.getById(photoId);

    const isOwner = req.user?._id == photo.owner._id;
    if (!isOwner) throw new Error("You are not the owner of this photo");

    res.render("edit", {
      title: "Edit",
      photo,
    });
  } catch (err) {
    const errors = errorHelper(err);
    res.render("edit", {
      title: "Photo Edit",
      errors,
    });
  }
});

photoController.post("/:id/edit", isAuthorized, async (req, res) => {
  const photoData = req.body;
  const photoId = req.params.id;
  const photo = await photoService.getById(photoId);

  const isOwner = req.user?._id == photo.owner._id;
  if (!isOwner) throw new Error("You are not the owner of this photo");

  try {
    await photoService.edit(photo._id, photoData);
    res.redirect(`/photo/${photo._id}/details`);
  } catch (err) {
    const errors = errorHelper(err);
    res.render("edit", {
      title: "Edit",
      errors,
    });
  }
});

// photoController.get("/:id/delete", isAuthorized, async (req, res) => {
//   const photoId = req.params.id;
//   const photo = await photoService.getById(photoId);

//   try {
//     const isOwner = req.user?._id == photo.owner._id;
//     if (!isOwner) throw new Error("You are not the owner of this photo");
//     await photoService.del(photoId);
//     res.redirect("/photo/catalog");
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
