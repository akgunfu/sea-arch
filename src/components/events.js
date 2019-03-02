export const EVENTS = {
  STARTED: { description: "Application started", success: true },
  REQUEST_CAPTURE: {
    description: "Screen capture requested from the server",
    success: true
  },
  CAPTURE_SUCCESS: {
    description: "Screen capture completed successfully",
    success: true
  },
  CAPTURE_ERROR: { description: "Screen capture failed", success: false },
  REQUEST_DETECTION: {
    description: "Text detection requested from the server",
    success: true
  },
  DETECTION_SUCCESS: {
    description: "Text detection completed successfully",
    success: true
  },
  DETECTION_ERROR: { description: "Text detection failed", success: false },
  GOOGLE_SEARCH_REQUEST: {
    description: "Google search requested from the server",
    success: true
  },
  GOOGLE_SEARCH_SUCCESS: {
    description: "Google search completed successfully",
    success: true
  },
  GOOGLE_SEARCH_ERROR: { description: "Google search failed", success: false },
  READY_FOR_NEXT: { description: "Waiting for next action", success: true }
};
