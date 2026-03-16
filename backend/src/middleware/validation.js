// Validation middleware
export const validateRequest = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true
    });

    if (error) {
      const messages = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }));
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: messages
      });
    }

    req.body = value;
    next();
  };
};
export const validateRequestTertiary = (schema) => (req, res, next) => {
  const body = { ...req.body };

  // FormData sends arrays/objects as JSON strings — parse them
  if (body.family_members && typeof body.family_members === 'string') {
    try {
      body.family_members = JSON.parse(body.family_members);
    } catch {
      return res.status(400).json({
        success: false,
        errors: [{ field: 'family_members', message: 'Invalid JSON format' }],
      });
    }
  }

  // coerce string booleans from FormData
  if (body.incoming_freshman !== undefined) {
    body.incoming_freshman = body.incoming_freshman === 'true';
  }

  const { error } = schema.validate(body, { abortEarly: false });
  if (error) {
    return res.status(400).json({
      success: false,
      errors: error.details.map((d) => ({
        field: d.path.join('.'),
        message: d.message,
      })),
    });
  }

  req.body = body; // put parsed body back
  next();
};