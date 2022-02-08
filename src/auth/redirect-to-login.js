const redirectToLogin = (req, res, next) => {
  const currentUser = req.user;
  if (!currentUser) {
    res.redirect("/auth/login");
  } else next();
};

export default redirectToLogin;
