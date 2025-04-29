const setUserType = (userType) => (req, res, next) => {
  if (!req.body) req.body = {}; 
  req.userType = userType;
  next();
};

export default setUserType;
