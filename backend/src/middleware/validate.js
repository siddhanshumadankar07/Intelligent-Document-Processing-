const validateBody = (schema) => (req, res, next) => {
  try {
    req.body = schema.parse(req.body);
    next();
  } catch (error) {
    const issues = error.errors?.map((err) => ({
      field: err.path.join('.'),
      message: err.message,
    })) || [{ message: error.message }];

    return res.status(400).json({
      success: false,
      message: 'Validation failed. Please check your inputs.',
      errors: issues,
    });
  }
};

const validateQuery = (schema) => (req, res, next) => {
  try {
    req.query = schema.parse(req.query);
    next();
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: 'Invalid query parameters.',
      errors: error.errors,
    });
  }
};

module.exports = { validateBody, validateQuery };
