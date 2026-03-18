/**
 * Email Service - PWC 2030 Standard
 * Supports SendGrid (production) and console logging (development)
 */

interface EmailOptions {
  to: string
  subject: string
  html: string
  text?: string
}

class EmailService {
  private sendGridApiKey: string
  private fromEmail: string
  private isConfigured: boolean

  constructor() {
    this.sendGridApiKey = process.env.SENDGRID_API_KEY || ''
    this.fromEmail = process.env.EMAIL_FROM || 'noreply@glohib.ai'
    this.isConfigured = !!this.sendGridApiKey && this.sendGridApiKey !== 'your-sendgrid-api-key'
  }

  /**
   * Send email via SendGrid or console (development)
   */
  async send(options: EmailOptions): Promise<{ success: boolean; messageId?: string; error?: string }> {
    if (!this.isConfigured) {
      // Development mode - log to console
      console.log('=== EMAIL (Development Mode) ===')
      console.log(`To: ${options.to}`)
      console.log(`Subject: ${options.subject}`)
      console.log(`HTML: ${options.html.substring(0, 200)}...`)
      console.log('===============================')
      return { success: true, messageId: 'dev-mode-' + Date.now() }
    }

    try {
      const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.sendGridApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          personalizations: [
            {
              to: [{ email: options.to }],
              subject: options.subject,
            },
          ],
          from: { email: this.fromEmail },
          content: [
            { type: 'text/html', value: options.html },
            ...(options.text ? [{ type: 'text/plain', value: options.text }] : []),
          ],
        }),
      })

      if (response.status === 202) {
        const messageId = response.headers.get('x-message-id') || undefined
        return { success: true, messageId }
      }

      const error = await response.text()
      return { success: false, error }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }
    }
  }

  /**
   * Send verification email
   */
  async sendVerificationEmail(to: string, verifyUrl: string, userName?: string): Promise<{ success: boolean; messageId?: string; error?: string }> {
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0; text-align: center; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; background: #667eea; color: white; padding: 14px 32px; text-decoration: none; border-radius: 6px; font-weight: 600; margin: 20px 0; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🌍 Glohib.ai</h1>
              <p>Global Health Internship Platform</p>
            </div>
            <div class="content">
              <h2>Verify Your Email</h2>
              <p>Hi ${userName || 'there'}!</p>
              <p>Welcome to Glohib.ai - your gateway to global health internships at WHO, UNICEF, and leading organizations.</p>
              <p>Please verify your email address to complete your registration:</p>
              <p style="text-align: center;">
                <a href="${verifyUrl}" class="button">Verify Email Address</a>
              </p>
              <p>This link will expire in 24 hours.</p>
              <p>If you didn't create this account, you can safely ignore this email.</p>
            </div>
            <div class="footer">
              <p>© 2026 Glohib.ai. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `

    const text = `
      Welcome to Glohib.ai!
      
      Please verify your email by visiting: ${verifyUrl}
      
      This link will expire in 24 hours.
      
      If you didn't create this account, you can safely ignore this email.
      
      — The Glohib.ai Team
    `

    return this.send({ to, subject: 'Verify your email - Glohib.ai', html, text })
  }

  /**
   * Send password reset email
   */
  async sendPasswordResetEmail(to: string, resetUrl: string, userName?: string): Promise<{ success: boolean; messageId?: string; error?: string }> {
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0; text-align: center; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; background: #f5576c; color: white; padding: 14px 32px; text-decoration: none; border-radius: 6px; font-weight: 600; margin: 20px 0; }
            .warning { background: #fff3cd; border: 1px solid #ffc107; padding: 15px; border-radius: 6px; margin: 20px 0; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🔐 Password Reset</h1>
            </div>
            <div class="content">
              <h2>Reset Your Password</h2>
              <p>Hi ${userName || 'there'}!</p>
              <p>We received a request to reset your password for Glohib.ai.</p>
              <p style="text-align: center;">
                <a href="${resetUrl}" class="button">Reset Password</a>
              </p>
              <div class="warning">
                <strong>⚠️ Important:</strong> This link will expire in 1 hour.
              </div>
              <p>If you didn't request this password reset, you can safely ignore this email. Your password will remain unchanged.</p>
            </div>
            <div class="footer">
              <p>© 2026 Glohib.ai. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `

    const text = `
      Password Reset Request
      
      We received a request to reset your password for Glohib.ai.
      
      Reset your password here: ${resetUrl}
      
      This link will expire in 1 hour.
      
      If you didn't request this password reset, you can safely ignore this email.
      
      — The Glohib.ai Team
    `

    return this.send({ to, subject: 'Reset your password - Glohib.ai', html, text })
  }

  /**
   * Send welcome email after verification
   */
  async sendWelcomeEmail(to: string, userName?: string): Promise<{ success: boolean; messageId?: string; error?: string }> {
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0; text-align: center; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; background: #11998e; color: white; padding: 14px 32px; text-decoration: none; border-radius: 6px; font-weight: 600; margin: 10px 5px; }
            .feature { background: white; padding: 15px; border-radius: 8px; margin: 15px 0; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎉 Welcome to Glohib.ai!</h1>
              <p>Your email has been verified</p>
            </div>
            <div class="content">
              <h2>Hi ${userName || 'there'}! 👋</h2>
              <p>Your account is now active. You're one step closer to landing your dream global health internship!</p>
              
              <div class="feature">
                <h3>📝 Complete Your Profile</h3>
                <p>Add your education, skills, and interests to get personalized internship recommendations.</p>
              </div>
              
              <div class="feature">
                <h3>🔍 Explore Internships</h3>
                <p>Browse opportunities at WHO, UNICEF, and other leading global health organizations.</p>
              </div>
              
              <div class="feature">
                <h3>🤖 AI-Powered Matching</h3>
                <p>Our AI will match you with internships that fit your skills and career goals.</p>
              </div>
              
              <p style="text-align: center; margin-top: 30px;">
                <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard" class="button">Go to Dashboard</a>
                <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard/profile" class="button">Complete Profile</a>
              </p>
            </div>
            <div class="footer">
              <p>© 2026 Glohib.ai. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `

    const text = `
      Welcome to Glohib.ai!
      
      Your account is now active. You're one step closer to landing your dream global health internship!
      
      Next steps:
      1. Complete your profile
      2. Explore internships
      3. Get AI-powered recommendations
      
      Visit your dashboard: ${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard
      
      — The Glohib.ai Team
    `

    return this.send({ to, subject: 'Welcome to Glohib.ai! 🎉', html, text })
  }
}

export const emailService = new EmailService()
export default emailService
