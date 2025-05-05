module.exports = (link, firstName) => {
  return `
  <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Email Verification | De Event Manager</title>
    <style>
        body {
            font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
            line-height: 1.6;
            color: #2d3748;
            background-color: #f8f9fa;
            margin: 0;
            padding: 2rem 0;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 12px;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
            overflow: hidden;
        }
        .header {
            background: #007bff;
            padding: 2rem;
            text-align: center;
            border-bottom: 4px solid #0056b3;
        }
        .header h1 {
            color: #ffffff;
            margin: 0;
            font-size: 1.75rem;
            font-weight: 600;
        }
        .content {
            padding: 2rem;
            color: #4a5568;
        }
        .content p {
            margin-bottom: 1.5rem;
            font-size: 1rem;
        }
        .button-container {
            text-align: center;
            margin: 2rem 0;
        }
        .button {
            display: inline-block;
            background-color: #007bff;
            color: #ffffff !important;
            padding: 0.75rem 2rem;
            font-size: 1rem;
            font-weight: 500;
            text-decoration: none;
            border-radius: 8px;
            transition: transform 0.2s ease, box-shadow 0.2s ease;
            box-shadow: 0 2px 4px rgba(0, 123, 255, 0.2);
        }
        .button:hover {
            transform: translateY(-1px);
            box-shadow: 0 4px 8px rgba(0, 123, 255, 0.25);
            background-color: #0069d9;
        }
        .footer {
            background: #f7fafc;
            padding: 1.5rem;
            text-align: center;
            font-size: 0.875rem;
            color: #718096;
            border-top: 1px solid #e2e8f0;
        }
        .highlight {
            color: #2d3748;
            font-weight: 500;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Verify Your Email Address</h1>
        </div>
        
        <div class="content">
            <p>Hello <span class="highlight">${firstName}</span>,</p>
            
            <p>Welcome to the De Event Manager! 🎉 We're thrilled to have you join our community.</p>
            
            <p>To get started, please verify your email address by clicking the button below:</p>
            
            <div class="button-container">
                <a href="${link}" class="button">Confirm My Account</a>
            </div>
            
            <p>This link will expire in 5 minutes. If you didn't request this verification, you can safely ignore this email.</p>
            
            <p>Happy planning!<br>
            De Event Manager Team</p>
        </div>
        
        <div class="footer">
            <p>© ${new Date().getFullYear()} De Event Manager. All rights reserved.<br>
            Need help? Contact our support team</p>
        </div>
    </div>
</body>
</html>
  `
}