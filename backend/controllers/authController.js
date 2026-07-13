import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Cart from '../models/Cart.js';
import Wishlist from '../models/Wishlist.js';
import AuditLog from '../models/AuditLog.js';

// JWT Token Generators
const generateAccessToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET || 'super_secret_nexus_one_access_token_key_998877',
    { expiresIn: '15m' }
  );
};

const generateRefreshToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_REFRESH_SECRET || 'super_secret_nexus_one_refresh_token_key_112233',
    { expiresIn: '7d' }
  );
};

// Set refresh token in HttpOnly cookie helper
const sendRefreshTokenCookie = (res, token) => {
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // true in production (https)
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days matching token expiry
  };
  res.cookie('refreshToken', token, cookieOptions);
};

// @desc    Register User
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res, next) => {
  const { name, email, password, role, phoneNumber } = req.body;

  try {
    // 1. Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      res.status(400);
      throw new Error('A user with this email address already exists');
    }

    // 2. Create user (password is pre-hashed in schema pre-save hook)
    const user = await User.create({
      name,
      email,
      password,
      role: role || 'Customer',
      phoneNumber,
    });

    if (user) {
      // 3. Create associated Cart and Wishlist for user integrity
      await Cart.create({ user: user._id, items: [] });
      await Wishlist.create({ user: user._id, products: [] });

      // 4. Generate Tokens
      const accessToken = generateAccessToken(user._id);
      const refreshToken = generateRefreshToken(user._id);

      // Save refresh token to user document
      user.refreshToken = refreshToken;
      await user.save();

      // 5. Audit Log log
      await AuditLog.create({
        user: user._id,
        action: 'USER_REGISTER',
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
        metadata: { role: user.role }
      });

      // Send cookies and profile data
      sendRefreshTokenCookie(res, refreshToken);

      return res.status(201).json({
        success: true,
        accessToken,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatar: user.avatar,
          isVerified: user.isVerified,
        },
      });
    } else {
      res.status(400);
      throw new Error('Invalid user details provided');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Login User
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    // 1. Find user by email and select password field
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      res.status(401);
      throw new Error('Invalid email or password');
    }

    // 2. Verify password
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      // Log login failure
      await AuditLog.create({
        user: user._id,
        action: 'LOGIN_FAILURE',
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
      });

      res.status(401);
      throw new Error('Invalid email or password');
    }

    // 3. Generate new tokens
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    // Save refresh token to DB
    user.refreshToken = refreshToken;
    await user.save();

    // 4. Logging Audit Log
    await AuditLog.create({
      user: user._id,
      action: 'USER_LOGIN',
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });

    // 5. Send cookie and respond
    sendRefreshTokenCookie(res, refreshToken);

    return res.status(200).json({
      success: true,
      accessToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        isVerified: user.isVerified,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Refresh Access Token
// @route   POST /api/auth/refresh
// @access  Public (Reads cookie)
export const refresh = async (req, res, next) => {
  const refreshToken = req.cookies.refreshToken;

  try {
    if (!refreshToken) {
      res.status(401);
      throw new Error('No refresh token provided in cookies');
    }

    // Verify token
    let decoded;
    try {
      decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET || 'super_secret_nexus_one_refresh_token_key_112233');
    } catch (err) {
      res.status(401);
      throw new Error('Refresh token is invalid or expired');
    }

    // Find User
    const user = await User.findById(decoded.id);
    if (!user || user.refreshToken !== refreshToken) {
      res.status(401);
      throw new Error('Refresh token does not match records');
    }

    // Generate new Access and Refresh tokens (rotation)
    const newAccessToken = generateAccessToken(user._id);
    const newRefreshToken = generateRefreshToken(user._id);

    // Update refresh token in DB
    user.refreshToken = newRefreshToken;
    await user.save();

    sendRefreshTokenCookie(res, newRefreshToken);

    return res.status(200).json({
      success: true,
      accessToken: newAccessToken,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Logout User
// @route   POST /api/auth/logout
// @access  Private (clears cookies)
export const logout = async (req, res, next) => {
  const refreshToken = req.cookies.refreshToken;

  try {
    if (refreshToken) {
      // Clear refresh token field in User DB
      await User.findOneAndUpdate(
        { refreshToken },
        { $unset: { refreshToken: 1 } }
      );
    }

    // Clear client cookies
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });

    return res.status(200).json({
      success: true,
      message: 'Logged out successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Forgot Password
// @route   POST /api/auth/forgot-password
// @access  Public
export const forgotPassword = async (req, res, next) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      res.status(404);
      throw new Error('No account found with this email address');
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(20).toString('hex');

    // Hash token and save to user document with 1 hour expiration
    user.resetPasswordToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');
    user.resetPasswordExpire = Date.now() + 60 * 60 * 1000; // 1 hour

    await user.save();

    // Create reset URL
    const resetUrl = `${req.protocol}://${req.get('host')}/reset-password/${resetToken}`;
    
    // Simulate sending email by logging in development console
    console.log(`\n==========================================`);
    console.log(`✉️ PASSWORD RESET SIMULATION FOR: ${email}`);
    console.log(`Link: ${resetUrl}`);
    console.log(`==========================================\n`);

    return res.status(200).json({
      success: true,
      message: 'Password reset link generated and simulated (Check server console log)',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Reset Password
// @route   PUT /api/auth/reset-password/:resetToken
// @access  Public
export const resetPassword = async (req, res, next) => {
  const { password } = req.body;
  const { resetToken } = req.params;

  try {
    // Hash token to match saved version
    const hashedToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');

    // Find user with matching token and valid expiry date
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      res.status(400);
      throw new Error('Invalid or expired password reset token');
    }

    // Set new password (will be hashed automatically by pre-save schema hook)
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    user.refreshToken = undefined; // Invalidate current login sessions for safety

    await user.save();

    // Audit Log log
    await AuditLog.create({
      user: user._id,
      action: 'PASSWORD_RESET',
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });

    return res.status(200).json({
      success: true,
      message: 'Password has been reset successfully',
    });
  } catch (error) {
    next(error);
  }
};
