/**
 * @module services/emailService
 * @description Email sending service using NodeMailer.
 *
 * Configured via environment variables.
 */

import nodemailer from "nodemailer";
import env from "../config/env.js";
import logger from "../config/logger.js";

class EmailService {
  constructor() {
    // Create reusable transporter object using SMTP transport
    if (env.SMTP_HOST && env.SMTP_USER) {
      this.transporter = nodemailer.createTransport({
        host: env.SMTP_HOST,
        port: env.SMTP_PORT,
        secure: env.SMTP_PORT === 465, // true for 465, false for other ports
        auth: {
          user: env.SMTP_USER,
          pass: env.SMTP_PASS,
        },
      });
      logger.info("[EmailService] NodeMailer transporter configured.");
    } else {
      logger.warn("[EmailService] SMTP credentials not provided, email service disabled.");
      this.transporter = null;
    }
  }

  /**
   * Internal helper to send emails.
   *
   * @param {Object} options - Email options
   * @param {string} options.to - Recipient email
   * @param {string} options.subject - Subject line
   * @param {string} options.html - HTML body
   * @returns {Promise<boolean>}
   */
  async _sendEmail(options) {
    if (!this.transporter) {
      logger.warn("[EmailService] Transporter not configured. Skipping email send:", options.subject);
      return false;
    }

    try {
      const info = await this.transporter.sendMail({
        from: env.EMAIL_FROM,
        to: options.to,
        subject: options.subject,
        html: options.html,
      });

      logger.info(`[EmailService] Email sent to ${options.to}: ${info.messageId}`);
      
      // If using ethereal email for testing, log the preview URL
      if (env.SMTP_HOST.includes("ethereal")) {
        logger.info(`[EmailService] Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
      }
      
      return true;
    } catch (error) {
      logger.error(`[EmailService] Failed to send email to ${options.to}`, { error: error.message });
      return false;
    }
  }

  /**
   * Send a welcome and email verification email.
   *
   * @param {string} to - Recipient email
   * @param {string} name - User's full name
   * @param {string} token - Verification token
   */
  async sendVerificationEmail(to, name, token) {
    // In a real app, this URL would point to your frontend which then calls the API
    const verifyUrl = `http://localhost:5173/verify-email?token=${token}`;

    const html = `
      <h1>Welcome to NexCart, ${name}!</h1>
      <p>Thank you for registering. Please verify your email address by clicking the link below:</p>
      <a href="${verifyUrl}" style="display:inline-block;padding:10px 20px;background:#007bff;color:#fff;text-decoration:none;border-radius:5px;">Verify Email</a>
      <p>If the button doesn't work, copy and paste this link into your browser:</p>
      <p>${verifyUrl}</p>
      <p>This link will expire in 24 hours.</p>
    `;

    return this._sendEmail({
      to,
      subject: "Welcome to NexCart - Please Verify Your Email",
      html,
    });
  }

  /**
   * Send a password reset email.
   *
   * @param {string} to - Recipient email
   * @param {string} name - User's full name
   * @param {string} token - Password reset token
   */
  async sendPasswordResetEmail(to, name, token) {
    // In a real app, this URL would point to your frontend reset password form
    const resetUrl = `http://localhost:5173/reset-password?token=${token}`;

    const html = `
      <h1>Password Reset Request</h1>
      <p>Hi ${name},</p>
      <p>You recently requested to reset your password for your NexCart account. Click the button below to reset it:</p>
      <a href="${resetUrl}" style="display:inline-block;padding:10px 20px;background:#dc3545;color:#fff;text-decoration:none;border-radius:5px;">Reset Password</a>
      <p>If the button doesn't work, copy and paste this link into your browser:</p>
      <p>${resetUrl}</p>
      <p>This link will expire in 10 minutes. If you did not request a password reset, please ignore this email.</p>
    `;

    return this._sendEmail({
      to,
      subject: "NexCart - Password Reset",
      html,
    });
  }
}

export default new EmailService();
