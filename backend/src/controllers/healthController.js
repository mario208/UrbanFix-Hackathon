/**
 * @desc    Check API Health
 * @route   GET /api/health
 * @access  Public
 */
export const checkHealth = (req, res, next) => {
  try {
    // Send a structured JSON response to confirm the server is alive
    res.status(200).json({
      success: true,
      message: 'UrbanFix API is running flawlessly.',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    // Pass any unexpected errors to the global error handler
    next(error);
  }
};