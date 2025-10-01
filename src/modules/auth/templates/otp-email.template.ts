export const OTP_EMAIL_TEMPLATE = `
<!DOCTYPE html>
<html>
  <head>
    <style>
      body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
      .container { max-width: 600px; margin: 0 auto; padding: 20px; }
      .header { background-color: #4CAF50; color: white; padding: 20px; text-align: center; }
      .content { background-color: #f9f9f9; padding: 30px; border-radius: 5px; margin-top: 20px; }
      .otp-code { font-size: 32px; font-weight: bold; color: #4CAF50; text-align: center;
                  letter-spacing: 5px; padding: 20px; background-color: #fff;
                  border: 2px dashed #4CAF50; border-radius: 5px; margin: 20px 0; }
      .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
      .warning { color: #d32f2f; font-weight: bold; }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>Password Reset Request</h1>
      </div>
      <div class="content">
        <p>Hello,</p>
        <p>You have requested to reset your password. Please use the following One-Time Password (OTP) to proceed:</p>
        <div class="otp-code">{{otp}}</div>
        <p>This OTP will expire in <strong>10 minutes</strong>.</p>
        <p class="warning">⚠️ If you did not request this password reset, please ignore this email and ensure your account is secure.</p>
        <p>For security reasons, do not share this OTP with anyone.</p>
      </div>
      <div class="footer">
        <p>© {{year}} Breedgestone. All rights reserved.</p>
      </div>
    </div>
  </body>
</html>
`;
