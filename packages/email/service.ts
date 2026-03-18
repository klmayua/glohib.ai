/**
 * PWC 2030 Email Service
 * SendGrid integration with React Email templates
 */

import sgMail from '@sendgrid/mail'

// Initialize SendGrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY || '')

export interface EmailOptions {
  to: string
  subject: string
  html: string
  text?: string
}

export const emailService = {
  /**
   * Send verification email
   */
  async sendVerification(email: string, token: string, baseUrl: string) {
    const verificationUrl = `${baseUrl}/auth/verify?token=${token}`
    
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { text-align: center; padding: 40px 0; }
            .logo { width: 48px; height: 48px; background: linear-gradient(135deg, #06b6d4, #3b82f6); border-radius: 8px; display: inline-block; }
            .button { display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, #06b6d4, #3b82f6); color: white; text-decoration: none; border-radius: 6px; font-weight: 600; margin: 24px 0; }
            .footer { text-align: center; padding: 40px 0; color: #666; font-size: 14px; border-top: 1px solid #eee; margin-top: 40px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo"></div>
              <h1 style="margin-top: 16px;">Verify Your Email</h1>
            </div>
            
            <p>Welcome to Glohib.ai!</p>
            <p>Please verify your email address to complete your registration.</p>
            
            <div style="text-align: center;">
              <a href="${verificationUrl}" class="button">Verify Email Address</a>
            </div>
            
            <p style="color: #666; font-size: 14px;">
              Or copy and paste this link into your browser:<br>
              <a href="${verificationUrl}">${verificationUrl}</a>
            </p>
            
            <p style="color: #666; font-size: 14px;">
              This link will expire in 24 hours.
            </p>
            
            <div class="footer">
              <p>© 2026 Glohib.ai. All rights reserved.</p>
              <p>If you didn't create this account, please ignore this email.</p>
            </div>
          </div>
        </body>
      </html>
    `

    const text = `
      Welcome to Glohib.ai!
      
      Please verify your email address by visiting this link:
      ${verificationUrl}
      
      This link will expire in 24 hours.
      
      If you didn't create this account, please ignore this email.
      
      © 2026 Glohib.ai. All rights reserved.
    `

    await this.send({
      to: email,
      subject: 'Verify your email - Glohib.ai',
      html,
      text,
    })
  },

  /**
   * Send password reset email
   */
  async sendPasswordReset(email: string, token: string, baseUrl: string) {
    const resetUrl = `${baseUrl}/auth/reset-password?token=${token}`
    
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { text-align: center; padding: 40px 0; }
            .logo { width: 48px; height: 48px; background: linear-gradient(135deg, #06b6d4, #3b82f6); border-radius: 8px; display: inline-block; }
            .button { display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, #06b6d4, #3b82f6); color: white; text-decoration: none; border-radius: 6px; font-weight: 600; margin: 24px 0; }
            .warning { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 16px; margin: 24px 0; }
            .footer { text-align: center; padding: 40px 0; color: #666; font-size: 14px; border-top: 1px solid #eee; margin-top: 40px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo"></div>
              <h1 style="margin-top: 16px;">Reset Your Password</h1>
            </div>
            
            <p>We received a request to reset your password.</p>
            
            <div style="text-align: center;">
              <a href="${resetUrl}" class="button">Reset Password</a>
            </div>
            
            <div class="warning">
              <strong>⚠️ Security Notice:</strong> This link will expire in 1 hour.
            </div>
            
            <p style="color: #666; font-size: 14px;">
              If you didn't request this password reset, please ignore this email or contact support if you have concerns.
            </p>
            
            <div class="footer">
              <p>© 2026 Glohib.ai. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `

    await this.send({
      to: email,
      subject: 'Reset your password - Glohib.ai',
      html,
      text: `Reset your password: ${resetUrl}\n\nThis link expires in 1 hour.`,
    })
  },

  /**
   * Send welcome email after verification
   */
  async sendWelcome(email: string, name: string, role: string) {
    const roleTexts = {
      student: 'Launch Your Career',
      employer: 'Hire Top Talent',
      mentor: 'Shape Future Leaders',
    }

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { text-align: center; padding: 40px 0; background: linear-gradient(135deg, #06b6d4, #3b82f6); color: white; border-radius: 12px; margin-bottom: 24px; }
            .button { display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, #06b6d4, #3b82f6); color: white; text-decoration: none; border-radius: 6px; font-weight: 600; margin: 24px 0; }
            .features { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin: 32px 0; }
            .feature { text-align: center; padding: 16px; }
            .footer { text-align: center; padding: 40px 0; color: #666; font-size: 14px; border-top: 1px solid #eee; margin-top: 40px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Welcome to Glohib.ai, ${name}!</h1>
              <p style="opacity: 0.9;">${roleTexts[role as keyof typeof roleTexts] || 'Get Started'}</p>
            </div>
            
            <p>Your account has been verified and you're ready to get started!</p>
            
            <div class="features">
              <div class="feature">
                <h3>🎯</h3>
                <p>AI-Powered Matching</p>
              </div>
              <div class="feature">
                <h3>📊</h3>
                <p>Smart Assessments</p>
              </div>
              <div class="feature">
                <h3>🤝</h3>
                <p>Career Growth</p>
              </div>
            </div>
            
            <div style="text-align: center;">
              <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" class="button">Go to Dashboard</a>
            </div>
            
            <div class="footer">
              <p>© 2026 Glohib.ai. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `

    await this.send({
      to: email,
      subject: `Welcome to Glohib.ai, ${name}!`,
      html,
      text: `Welcome to Glohib.ai, ${name}! Your account is ready. Visit ${process.env.NEXT_PUBLIC_APP_URL}/dashboard to get started.`,
    })
  },

  /**
   * Send email
   */
  async send(options: EmailOptions) {
    if (!process.env.SENDGRID_API_KEY) {
      console.warn('SendGrid API key not configured. Email not sent.')
      console.log('Email would be sent to:', options.to)
      console.log('Subject:', options.subject)
      return
    }

    try {
      await sgMail.send({
        to: options.to,
        from: process.env.EMAIL_FROM || 'noreply@glohib.ai',
        subject: options.subject,
        html: options.html,
        text: options.text,
      })
      console.log('Email sent successfully to:', options.to)
    } catch (error) {
      console.error('Failed to send email:', error)
      throw error
    }
  },
}

export default emailService
