import jwt from 'jsonwebtoken';

const checkAuth = (req, res, next) => {
  if (
    typeof req.cookies.rdhToken === 'undefined' ||
    req.cookies.rdhToken === null
  ) {
    req.user = null;
  } else {
    const token = req.cookies.rdhToken;
    const decodedToken = jwt.decode(token, { complete: true }) || {};
    req.user = decodedToken.payload;
  }

  next();
};

export default checkAuth;
