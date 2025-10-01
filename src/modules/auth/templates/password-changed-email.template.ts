export const PASSWORD_CHANGED_EMAIL_TEMPLATE = `
<!DOCTYPE html>
<html>
  <head>
    <style>
      body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
      .container { max-width: 600px; margin: 0 auto; padding: 20px; }
      .header { background-color: #4CAF50; color: white; padding: 20px; text-align: center; }
      .content { background-color: #f9f9f9; padding: 30px; border-radius: 5px; margin-top: 20px; }
      .warning { color: #d32f2f; font-weight: bold; }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>Password Changed Successfully</h1>
      </div>
      <div class="content">
        <p>Hello {{firstName}},</p>
        <p>Your password has been successfully changed.</p>
        <p class="warning">⚠️ If you did not make this change, please contact our support team immediately.</p>
      </div>
    </div>
  </body>
</html>
`;
