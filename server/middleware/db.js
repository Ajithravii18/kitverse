export const checkDb = (req, res, next) => {
  const { hasDatabase, databaseReady } = req.app.locals;
  if (hasDatabase && !databaseReady()) {
    return res.status(503).json({ error: 'The catalogue is temporarily unavailable. Please try again shortly.' });
  }
  next();
};
