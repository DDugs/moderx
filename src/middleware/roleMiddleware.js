exports.isAdmin = (req, res, next) => {
  const role = req.headers['x-user-role'];
  if (role !== 'admin') {
    return res.status(403).json({ error: 'Access denied. Admins only.' });
  }
  next();
};

exports.isAuthorized = (req, res, next) => {
  const role = req.headers['x-user-role'];
  if (role !== 'admin' && role !== 'doctor') {
    return res.status(403).json({ error: 'Access denied. Authorized users only.' });
  }
  next();
};
