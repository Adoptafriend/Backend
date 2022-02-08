/* eslint-disable no-shadow */
/* eslint-disable consistent-return */
import express from "express";
import passport from "passport";
import jwt from "jsonwebtoken";

const router = express.Router();

const cookieOptions = {
  maxAge: 1000 * 60 * 60 * 24 * 30,
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
};

// router.get("/signup", (req, res) => res.render("auth/sign-up"));

// router.post(
//   "/signup",
//   passport.authenticate("signup", { session: false }),
//   async (req, res) => {
//     const secretKey = process.env.JWT_SECRET;
//     const token = jwt.sign(
//       {
//         id: req.user.id,
//         username: req.user.username,
//         employeeId: req.user.employee.id,
//         fullName: req.user.employee.fullName,
//         firstName: req.user.employee.firstName,
//         isAdmin: req.user.isAdmin,
//         worksiteId: req.user.employee.worksiteId,
//       },
//       secretKey,
//       {
//         expiresIn: "60 days",
//       }
//     );
//     res.cookie("rdhToken", token, cookieOptions);
//     return res.redirect("/");
//   }
// );

router.post(
  "/employees/:id/users",
  passport.authenticate("register", { session: false }),
  async (req, res) => {
    // const secretKey = process.env.JWT_SECRET;
    // const token = jwt.sign(
    //   {
    //     id: req.user.id,
    //     username: req.user.username,
    //     employeeId: req.user.employee.id,
    //     fullName: req.user.employee.fullName,
    //     firstName: req.user.employee.firstName,
    //     isAdmin: req.user.isAdmin,
    //     worksiteId: req.user.employee.worksiteId,
    //   },
    //   secretKey,
    //   {
    //     expiresIn: "60 days",
    //   }
    // );
    // res.cookie("rdhToken", token, cookieOptions);
    return res.redirect("/employees");
  }
);

router.get("/login", (req, res) => {
  if (req.user) res.redirect("/");
  res.render("auth/login");
});

router.post("/login", async (req, res, next) => {
  passport.authenticate("login", async (error, user, info) => {
    try {
      if (error) return next(error);
      if (!user && info?.message) return res.render("auth/login", { info });
      req.login(user, { session: false }, async (error) => {
        if (error) return next(error);

        const secretKey = process.env.JWT_SECRET;
        const token = jwt.sign(
          {
            id: req.user.id,
            username: req.user.username,
            employeeId: req.user.employee.id,
            fullName: req.user.employee?.fullName,
            firstName: req.user.employee?.firstName,
            isAdmin: req.user.isAdmin,
            worksiteId: req.user.employee?.worksiteId,
          },
          secretKey,
          {
            expiresIn: "60 days",
          }
        );
        res.cookie("rdhToken", token, cookieOptions);
        return res.redirect("/");
      });
    } catch (error) {
      return next(error);
    }
  })(req, res, next);
});

router.get("/logout", (req, res) => {
  res.clearCookie("rdhToken");
  return res.redirect("/");
});

export default router;
