/**
 * Middleware function to authenticate a patient/admin.
 * Checks if the patient/admin is logged in by verifying the presence of a patient/adminId in the session.
 * If authenticated, it proceeds to the next middleware or route handler.
 * If not authenticated, it responds with a 401 Unauthorized status and an error message.
 *
 * @param {Object} req - The request object, representing the HTTP request.
 * @param {Object} res - The response object, used to send a response to the client.
 * @param {Function} next - The next middleware function in the stack.
 */
exports.patientAuth = (req, res, next) => {
  if (req.session && req.session.patientId) {
    next();
  } else {
    res
      .status(401)
      .json({ message: "Unauthorized: Please log in as a Patient" });
  }
};

exports.adminAuth = (req, res, next) => {
  if (req.session && req.session.adminId) {
    next();
  } else {
    res.status(401).json({ message: "Unauthorized: please log in as admin" });
  }
};
