export const WELCOME_EMAIL_TEMPLATE = `
<!DOCTYPE html>
<html>
  <head>
    <style>
      body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
      .container { max-width: 600px; margin: 0 auto; padding: 20px; }
      .header { background-color: #4CAF50; color: white; padding: 20px; text-align: center; }
      .content { background-color: #f9f9f9; padding: 30px; border-radius: 5px; margin-top: 20px; }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>Welcome to Breedgestone!</h1>
      </div>
      <div class="content">
        <p>Hello {{firstName}},</p>
        <p>Thank you for registering with Breedgestone. We're excited to have you on board!</p>
        <p>If you have any questions, feel free to reach out to our support team.</p>
      </div>
    </div>
  </body>
</html>
`;
