/**
 * Role-based access control middleware
 * Usage: authorize('admin'), authorize('admin', 'officer')
 */

const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    // auth middleware must run before this
    if (!req.user || !req.user.role) {
      return res.status(401).json({
        success: false,
        message: 'Not authenticated',
      });
    }

    // Check if user's role is allowed
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied: insufficient permissions',
      });
    }

    next();
  };
};

export default authorize;
