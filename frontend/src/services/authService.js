/**
 * AuthService placeholder for frontend development.
 * This will be replaced with real backend API/JWT calls in the future.
 */
export const authService = {
  /**
   * Simulates authentication with a 1.5 second network delay.
   */
  login: async (email, password) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Simple client-side check: make sure neither is empty
        if (!email.trim() || !password.trim()) {
          resolve({
            success: false,
            error: "Email and password are required.",
          });
        } else {
          resolve({
            success: true,
            email: email,
            token: "simulated-jwt-token-placeholder",
          });
        }
      }, 1500); // 1.5 seconds simulated latency
    });
  },

  /**
   * Simulates social authentication with a 1.5 second network delay.
   */
  loginWithSocial: async (platform) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          email: `${platform.toLowerCase()}user@nexcart.com`,
          token: `simulated-social-jwt-${platform.toLowerCase()}`,
        });
      }, 1500);
    });
  },
};
