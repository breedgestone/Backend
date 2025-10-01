import { AgentWelcomeEmailData } from '../../../common/interfaces';

export const agentWelcomeEmailTemplate = (data: AgentWelcomeEmailData): string => {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to Breedgestone - Agent Account Created</title>
        <style>
          body {
            font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            text-align: center;
            border-radius: 10px 10px 0 0;
          }
          .content {
            background: #f9f9f9;
            padding: 30px;
            border: 1px solid #e0e0e0;
            border-top: none;
          }
          .credentials-box {
            background: #fff;
            border: 2px solid #667eea;
            border-radius: 8px;
            padding: 20px;
            margin: 20px 0;
          }
          .credential-item {
            margin: 15px 0;
          }
          .credential-label {
            font-weight: bold;
            color: #667eea;
            display: block;
            margin-bottom: 5px;
          }
          .credential-value {
            background: #f0f0f0;
            padding: 10px;
            border-radius: 4px;
            font-family: 'Courier New', monospace;
            font-size: 14px;
            word-break: break-all;
          }
          .warning-box {
            background: #fff3cd;
            border-left: 4px solid #ffc107;
            padding: 15px;
            margin: 20px 0;
            border-radius: 4px;
          }
          .cta-button {
            display: inline-block;
            background: #667eea;
            color: white;
            padding: 15px 30px;
            text-decoration: none;
            border-radius: 5px;
            margin: 20px 0;
            font-weight: bold;
          }
          .footer {
            background: #333;
            color: #fff;
            padding: 20px;
            text-align: center;
            font-size: 12px;
            border-radius: 0 0 10px 10px;
          }
          .steps {
            background: #fff;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
          }
          .step {
            margin: 15px 0;
            padding-left: 30px;
            position: relative;
          }
          .step-number {
            position: absolute;
            left: 0;
            top: 0;
            background: #667eea;
            color: white;
            width: 24px;
            height: 24px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            font-size: 12px;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>🎉 Welcome to Breedgestone!</h1>
          <p>Your Agent Account Has Been Created</p>
        </div>
        
        <div class="content">
          <p>Hello <strong>${data.agentName}</strong>,</p>
          
          <p>Congratulations! An administrator has created an agent account for you on the Breedgestone platform. You can now start listing and managing properties.</p>
          
          <div class="credentials-box">
            <h3 style="margin-top: 0; color: #667eea;">🔐 Your Login Credentials</h3>
            
            <div class="credential-item">
              <span class="credential-label">Email Address:</span>
              <div class="credential-value">${data.email}</div>
            </div>
            
            <div class="credential-item">
              <span class="credential-label">Temporary Password:</span>
              <div class="credential-value">${data.temporaryPassword}</div>
            </div>
          </div>
          
          <div class="warning-box">
            <strong>⚠️ Important Security Notice:</strong>
            <ul style="margin: 10px 0;">
              <li>This is a temporary password</li>
              <li>Please change it immediately after your first login</li>
              <li>Do not share this password with anyone</li>
              <li>Keep your credentials secure</li>
            </ul>
          </div>
          
          <div class="steps">
            <h3 style="margin-top: 0; color: #333;">📋 Getting Started</h3>
            
            <div class="step">
              <div class="step-number">1</div>
              <strong>Login to your account</strong><br>
              Use the credentials above to access the platform
            </div>
            
            <div class="step">
              <div class="step-number">2</div>
              <strong>Change your password</strong><br>
              Go to your profile settings and set a new secure password
            </div>
            
            <div class="step">
              <div class="step-number">3</div>
              <strong>Complete your profile</strong><br>
              Add your profile picture and additional information
            </div>
            
            <div class="step">
              <div class="step-number">4</div>
              <strong>Start listing properties</strong><br>
              Begin creating property listings for potential buyers
            </div>
          </div>
          
          <div style="text-align: center;">
            <a href="${data.loginUrl}" class="cta-button">
              Login to Your Account
            </a>
          </div>
          
          <p style="margin-top: 30px;">If you have any questions or need assistance, please don't hesitate to contact our support team.</p>
          
          <p>Best regards,<br>
          <strong>The Breedgestone Team</strong></p>
        </div>
        
        <div class="footer">
          <p>&copy; ${new Date().getFullYear()} Breedgestone. All rights reserved.</p>
          <p>This is an automated message. Please do not reply to this email.</p>
        </div>
      </body>
    </html>
  `;
};
