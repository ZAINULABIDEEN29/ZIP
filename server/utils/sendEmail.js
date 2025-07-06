const nodemailer = require('nodemailer');

module.exports.sendAdminApprovalEmail = async (user, approvalLink) => {
  // Configure your transporter (use your SMTP credentials)
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    service: process.env.SMTP_SERVICE, // or your email provider
    auth: {
      user: process.env.SMTP_MAIL,
      pass: process.env.SMTP_PASSWORD
    }
  });

  // process.env.SMTP_MAIL
  const mailOptions = {
    from:user.email,
    to: process.env.SMTP_MAIL, // Admin's email
    subject: '🎯 New Intern Registration - Approval Required',
    html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Intern Registration</title>
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #374151;
            background-color: #f9fafb;
          }
          
          .email-container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
          }
          
          .header {
            background: linear-gradient(135deg, #dc2626 0%, #b91c1c 50%, #991b1b 100%);
            padding: 40px 30px;
            text-align: center;
            position: relative;
          }
          
          .header::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="25" cy="25" r="1" fill="white" opacity="0.1"/><circle cx="75" cy="75" r="1" fill="white" opacity="0.1"/><circle cx="50" cy="10" r="0.5" fill="white" opacity="0.1"/><circle cx="10" cy="60" r="0.5" fill="white" opacity="0.1"/><circle cx="90" cy="40" r="0.5" fill="white" opacity="0.1"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
            opacity: 0.3;
          }
          
          .logo {
            width: 60px;
            height: 60px;
            background-color: rgba(255, 255, 255, 0.2);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 20px;
            font-size: 24px;
            font-weight: bold;
            color: white;
            position: relative;
            z-index: 1;
          }
          
          .header h1 {
            color: white;
            font-size: 28px;
            font-weight: 700;
            margin-bottom: 8px;
            position: relative;
            z-index: 1;
          }
          
          .header p {
            color: rgba(255, 255, 255, 0.9);
            font-size: 16px;
            position: relative;
            z-index: 1;
          }
          
          .content {
            padding: 40px 30px;
          }
          
          .notification-badge {
            display: inline-flex;
            align-items: center;
            background-color: #fef3c7;
            color: #92400e;
            padding: 8px 16px;
            border-radius: 20px;
            font-size: 14px;
            font-weight: 600;
            margin-bottom: 24px;
          }
          
          .notification-badge::before {
            content: '🔔';
            margin-right: 8px;
            font-size: 16px;
          }
          
          .user-info {
            background-color: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 12px;
            padding: 24px;
            margin: 24px 0;
          }
          
          .user-info h3 {
            color: #1f2937;
            font-size: 18px;
            font-weight: 600;
            margin-bottom: 16px;
            display: flex;
            align-items: center;
          }
          
          .user-info h3::before {
            content: '👤';
            margin-right: 8px;
            font-size: 20px;
          }
          
          .user-detail {
            display: flex;
            align-items: center;
            margin-bottom: 12px;
            padding: 12px;
            background-color: white;
            border-radius: 8px;
            border-left: 4px solid #dc2626;
          }
          
          .user-detail:last-child {
            margin-bottom: 0;
          }
          
          .user-detail-label {
            font-weight: 600;
            color: #6b7280;
            min-width: 80px;
            margin-right: 12px;
          }
          
          .user-detail-value {
            color: #1f2937;
            font-weight: 500;
          }
          
          .action-section {
            text-align: center;
            margin: 32px 0;
          }
          
          .approval-button {
            display: inline-block;
            background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
            color: white;
            text-decoration: none;
            padding: 16px 32px;
            border-radius: 12px;
            font-weight: 600;
            font-size: 16px;
            box-shadow: 0 4px 6px -1px rgba(220, 38, 38, 0.3);
            transition: all 0.3s ease;
            margin: 16px 0;
          }
          
          .approval-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 15px -3px rgba(220, 38, 38, 0.4);
          }
          
          .approval-button::before {
            content: '✅';
            margin-right: 8px;
            font-size: 18px;
            
          }
          
          .info-box {
            background-color: #eff6ff;
            border: 1px solid #dbeafe;
            border-radius: 8px;
            padding: 16px;
            margin: 24px 0;
          }
          
          .info-box h4 {
            color: #1e40af;
            font-size: 16px;
            font-weight: 600;
            margin-bottom: 8px;
            display: flex;
            align-items: center;
          }
          
          .info-box h4::before {
            content: 'ℹ️';
            margin-right: 8px;
          }
          
          .info-box p {
            color: #374151;
            font-size: 14px;
            line-height: 1.5;
          }
          
          .footer {
            background-color: #f9fafb;
            padding: 24px 30px;
            text-align: center;
            border-top: 1px solid #e5e7eb;
          }
          
          .footer p {
            color: #6b7280;
            font-size: 14px;
            margin-bottom: 8px;
          }
          
          .footer-links {
            margin-top: 16px;
          }
          
          .footer-links a {
            color: #dc2626;
            text-decoration: none;
            margin: 0 8px;
            font-weight: 500;
          }
          
          .footer-links a:hover {
            text-decoration: underline;
          }
          
          @media (max-width: 600px) {
            .email-container {
              margin: 0;
              border-radius: 0;
            }
            
            .header, .content, .footer {
              padding: 24px 20px;
            }
            
            .header h1 {
              font-size: 24px;
            }
            
            .user-detail {
              flex-direction: column;
              align-items: flex-start;
            }
            
            .user-detail-label {
              min-width: auto;
              margin-right: 0;
              margin-bottom: 4px;
            }
          }
        </style>
      </head>
      <body>
        <div class="email-container">
          <div class="header">
            <h1>New Intern Registration</h1>
            <p>Action required from administrator</p>
          </div>
          
          <div class="content">
            <div class="notification-badge">
              Pending Approval Required
            </div>
            
            <p style="font-size: 16px; color: #374151; margin-bottom: 24px;">
              Hello Administrator,
            </p>
            
            <p style="font-size: 16px; color: #374151; margin-bottom: 24px;">
              A new intern has registered and is awaiting your approval to join the Zimlitech internship program.
            </p>
            
            <div class="user-info">
              <h3>Registration Details</h3>
              <div class="user-detail">
                <span class="user-detail-label">Email:</span>
                <span class="user-detail-value">${user.email}</span>
              </div>
              <div class="user-detail">
                <span class="user-detail-label">Name:</span>
                <span class="user-detail-value">${user.name || 'Not provided'}</span>
              </div>
              <div class="user-detail">
                <span class="user-detail-label">Status:</span>
                <span class="user-detail-value" style="color: #dc2626; font-weight: 600;">Pending Approval</span>
              </div>
            </div>
            
            <div class="action-section">
              <a href="${approvalLink}" class="approval-button">
                Review & Approve Intern
              </a>
            </div>
            
            <div class="info-box">
              <h4>What happens next?</h4>
              <p>
                Once approved, the intern will receive access to the dashboard where they can start their internship journey, 
                track progress, and engage with mentors and projects.
              </p>
            </div>
            
            <p style="font-size: 14px; color: #6b7280; margin-top: 24px;">
              If you have any questions or concerns about this registration, please review the intern's details 
              before making your decision.
            </p>
          </div>
          
          <div class="footer">
            <p>This is an automated notification from the Zimlitech Internship Platform</p>
            <p style="font-size: 12px; color: #9ca3af;">
              If you're having trouble with the button above, copy and paste this URL into your browser:
            </p>
            <p style="font-size: 12px; color: #dc2626; word-break: break-all;">
              ${approvalLink}
            </p>
            <div class="footer-links">
              <a href="${process.env.FRONTEND_URL }">Dashboard</a>
              <span>•</span>
              <a href="${process.env.FRONTEND_URL }/admin">Admin Panel</a>
            </div>
          </div>
        </div>
      </body>
      </html>
    `
  };

  await transporter.sendMail(mailOptions);
};

module.exports.sendPasswordResetEmail = async (user, resetLink) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      service: process.env.SMTP_SERVICE,
      auth: {
        user: process.env.SMTP_MAIL,
        pass: process.env.SMTP_PASSWORD
      }
    });
    console.log(user.email, "User's Email")

    const mailOptions = {
      from: process.env.SMTP_MAIL,
      to: user.email,
      subject: '🔐 Password Reset Request - Zimlitech Intern Portal',
      html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Password Reset Request</title>
          <style>
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
              line-height: 1.6;
              color: #374151;
              background-color: #f9fafb;
            }
            
            .email-container {
              max-width: 600px;
              margin: 0 auto;
              background-color: #ffffff;
              border-radius: 12px;
              overflow: hidden;
              box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
            }
            
            .header {
              background: linear-gradient(135deg, #dc2626 0%, #b91c1c 50%, #991b1b 100%);
              padding: 40px 30px;
              text-align: center;
              position: relative;
            }
            
            .header::before {
              content: '';
              position: absolute;
              top: 0;
              left: 0;
              right: 0;
              bottom: 0;
              background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="25" cy="25" r="1" fill="white" opacity="0.1"/><circle cx="75" cy="75" r="1" fill="white" opacity="0.1"/><circle cx="50" cy="10" r="0.5" fill="white" opacity="0.1"/><circle cx="10" cy="60" r="0.5" fill="white" opacity="0.1"/><circle cx="90" cy="40" r="0.5" fill="white" opacity="0.1"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
              opacity: 0.3;
            }
            
            .logo {
              width: 60px;
              height: 60px;
              background-color: rgba(255, 255, 255, 0.2);
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              margin: 0 auto 20px;
              font-size: 24px;
              font-weight: bold;
              color: white;
              position: relative;
              z-index: 1;
            }
            
            .header h1 {
              color: white;
              font-size: 28px;
              font-weight: 700;
              margin-bottom: 8px;
              position: relative;
              z-index: 1;
            }
            
            .header p {
              color: rgba(255, 255, 255, 0.9);
              font-size: 16px;
              position: relative;
              z-index: 1;
            }
            
            .content {
              padding: 40px 30px;
            }
            
            .security-badge {
              display: inline-flex;
              align-items: center;
              background-color: #fef3c7;
              color: #92400e;
              padding: 8px 16px;
              border-radius: 20px;
              font-size: 14px;
              font-weight: 600;
              margin-bottom: 24px;
            }
            
            .security-badge::before {
              content: '🔐';
              margin-right: 8px;
              font-size: 16px;
            }
            
            .user-greeting {
              background-color: #f8fafc;
              border: 1px solid #e2e8f0;
              border-radius: 12px;
              padding: 24px;
              margin: 24px 0;
            }
            
            .user-greeting h3 {
              color: #1f2937;
              font-size: 18px;
              font-weight: 600;
              margin-bottom: 16px;
              display: flex;
              align-items: center;
            }
            
            .user-greeting h3::before {
              content: '👋';
              margin-right: 8px;
              font-size: 20px;
            }
            
            .action-section {
              text-align: center;
              margin: 32px 0;
            }
            
            .reset-button {
              display: inline-block;
              background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
              color: white;
              text-decoration: none;
              padding: 16px 32px;
              border-radius: 12px;
              font-weight: 600;
              font-size: 16px;
              box-shadow: 0 4px 6px -1px rgba(220, 38, 38, 0.3);
              transition: all 0.3s ease;
              margin: 16px 0;
            }
            
            .reset-button:hover {
              transform: translateY(-2px);
              box-shadow: 0 8px 15px -3px rgba(220, 38, 38, 0.4);
            }
            
            .reset-button::before {
              content: '🔑';
              margin-right: 8px;
              font-size: 18px;
            }
            
            .security-info {
              background-color: #eff6ff;
              border: 1px solid #dbeafe;
              border-radius: 8px;
              padding: 16px;
              margin: 24px 0;
            }
            
            .security-info h4 {
              color: #1e40af;
              font-size: 16px;
              font-weight: 600;
              margin-bottom: 8px;
              display: flex;
              align-items: center;
            }
            
            .security-info h4::before {
              content: '⚠️';
              margin-right: 8px;
            }
            
            .security-info p {
              color: #374151;
              font-size: 14px;
              line-height: 1.5;
            }
            
            .footer {
              background-color: #f9fafb;
              padding: 24px 30px;
              text-align: center;
              border-top: 1px solid #e5e7eb;
            }
            
            .footer p {
              color: #6b7280;
              font-size: 14px;
              margin-bottom: 8px;
            }
            
            .footer-links {
              margin-top: 16px;
            }
            
            .footer-links a {
              color: #dc2626;
              text-decoration: none;
              margin: 0 8px;
              font-weight: 500;
            }
            
            .footer-links a:hover {
              text-decoration: underline;
            }
            
            @media (max-width: 600px) {
              .email-container {
                margin: 0;
                border-radius: 0;
              }
              
              .header, .content, .footer {
                padding: 24px 20px;
              }
              
              .header h1 {
                font-size: 24px;
              }
            }
          </style>
        </head>
        <body>
          <div class="email-container">
            <div class="header">
              <div class="logo">Z</div>
              <h1>Password Reset Request</h1>
              <p>Secure your account access</p>
            </div>
            
            <div class="content">
              <div class="security-badge">
                Security Action Required
              </div>
              
              <p style="font-size: 16px; color: #374151; margin-bottom: 24px;">
                Hello ${user.name || 'there'},
              </p>
              
              <p style="font-size: 16px; color: #374151; margin-bottom: 24px;">
                We received a request to reset your password for your Zimlitech Intern Portal account. 
                If you made this request, please click the button below to create a new password.
              </p>
              
              <div class="user-greeting">
                <h3>Account Information</h3>
                <p style="color: #6b7280; margin-bottom: 8px;">
                  <strong>Email:</strong> ${user.email}
                </p>
                <p style="color: #6b7280;">
                  <strong>Request Time:</strong> ${new Date().toLocaleString()}
                </p>
              </div>
              
              <div class="action-section">
                <a href="${resetLink}" class="reset-button">
                  Reset My Password
                </a>
              </div>
              
              <div class="security-info">
                <h4>Important Security Notice</h4>
                <p>
                  • This link will expire in 1 hour for security reasons<br>
                  • If you didn't request this password reset, please ignore this email<br>
                  • Never share this link with anyone else
                </p>
              </div>
              
              <p style="font-size: 14px; color: #6b7280; margin-top: 24px;">
                If you're having trouble with the button above, copy and paste this URL into your browser:
              </p>
              <p style="font-size: 12px; color: #dc2626; word-break: break-all; background-color: #fef2f2; padding: 8px; border-radius: 4px;">
                ${resetLink}
              </p>
            </div>
            
            <div class="footer">
              <p>This is an automated security notification from Zimlitech Intern Portal</p>
              <div class="footer-links">
                <a href="${process.env.FRONTEND_URL }">Visit Portal</a>
                <span>•</span>
                <a href="${process.env.FRONTEND_URL }/contact">Contact Support</a>
              </div>
            </div>
          </div>
        </body>
        </html>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log('Password reset email sent successfully to:', user.email);
  } catch (error) {
    console.error('Error sending password reset email:', error);
    throw error;
  }
};

module.exports.sendSkillApprovalEmail = async (adminEmail, approvalLink, skill, user) => {
  // Configure your transporter (use your SMTP credentials)
 try{
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        service: process.env.SMTP_SERVICE, // or your email provider
        auth: {
          user: process.env.SMTP_MAIL,
          pass: process.env.SMTP_PASSWORD
        }
      });
    
      const mailOptions = {
        from: process.env.SMTP_MAIL,
        to: process.env.ADMIN_EMAIL, // Admin's email
        subject: '🎯 New Skill Addition Request - Approval Required',
        html: `
          <!DOCTYPE html>
          <html lang="en">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Skill Approval Request</title>
            <style>
              * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
              }
              
              body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
                line-height: 1.6;
                color: #374151;
                background-color: #f9fafb;
              }
              
              .email-container {
                max-width: 600px;
                margin: 0 auto;
                background-color: #ffffff;
                border-radius: 12px;
                overflow: hidden;
                box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
              }
              
              .header {
                background: linear-gradient(135deg, #dc2626 0%, #b91c1c 50%, #991b1b 100%);
                padding: 40px 30px;
                text-align: center;
                position: relative;
              }
              
              .header::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="25" cy="25" r="1" fill="white" opacity="0.1"/><circle cx="75" cy="75" r="1" fill="white" opacity="0.1"/><circle cx="50" cy="10" r="0.5" fill="white" opacity="0.1"/><circle cx="10" cy="60" r="0.5" fill="white" opacity="0.1"/><circle cx="90" cy="40" r="0.5" fill="white" opacity="0.1"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
                opacity: 0.3;
              }
              
              .logo {
                width: 60px;
                height: 60px;
                background-color: rgba(255, 255, 255, 0.2);
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                margin: 0 auto 20px;
                font-size: 24px;
                font-weight: bold;
                color: white;
                position: relative;
                z-index: 1;
              }
              
              .header h1 {
                color: white;
                font-size: 28px;
                font-weight: 700;
                margin-bottom: 8px;
                position: relative;
                z-index: 1;
              }
              
              .header p {
                color: rgba(255, 255, 255, 0.9);
                font-size: 16px;
                position: relative;
                z-index: 1;
              }
              
              .content {
                padding: 40px 30px;
              }
              
              .notification-badge {
                display: inline-flex;
                align-items: center;
                background-color: #fef3c7;
                color: #92400e;
                padding: 8px 16px;
                border-radius: 20px;
                font-size: 14px;
                font-weight: 600;
                margin-bottom: 24px;
              }
              
              .notification-badge::before {
                content: '💡';
                margin-right: 8px;
                font-size: 16px;
              }
              
              .skill-info {
                background-color: #f8fafc;
                border: 1px solid #e2e8f0;
                border-radius: 12px;
                padding: 24px;
                margin: 24px 0;
              }
              
              .skill-info h3 {
                color: #1f2937;
                font-size: 18px;
                font-weight: 600;
                margin-bottom: 16px;
                display: flex;
                align-items: center;
              }
              
              .skill-info h3::before {
                content: '🎯';
                margin-right: 8px;
                font-size: 20px;
              }
              
              .skill-detail {
                display: flex;
                align-items: center;
                margin-bottom: 12px;
                padding: 12px;
                background-color: white;
                border-radius: 8px;
                border-left: 4px solid #dc2626;
              }
              
              .skill-detail:last-child {
                margin-bottom: 0;
              }
              
              .skill-detail-label {
                font-weight: 600;
                color: #6b7280;
                min-width: 100px;
                margin-right: 12px;
              }
              
              .skill-detail-value {
                color: #1f2937;
                font-weight: 500;
              }
              
              .user-info {
                background-color: #eff6ff;
                border: 1px solid #dbeafe;
                border-radius: 8px;
                padding: 16px;
                margin: 24px 0;
              }
              
              .user-info h4 {
                color: #1e40af;
                font-size: 16px;
                font-weight: 600;
                margin-bottom: 8px;
                display: flex;
                align-items: center;
              }
              
              .user-info h4::before {
                content: '👤';
                margin-right: 8px;
              }
              
              .user-info p {
                color: #374151;
                font-size: 14px;
                line-height: 1.5;
              }
              
              .action-section {
                text-align: center;
                margin: 32px 0;
              }
              
              .approval-button {
                display: inline-block;
                background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
                color: white;
                text-decoration: none;
                padding: 16px 32px;
                border-radius: 12px;
                font-weight: 600;
                font-size: 16px;
                box-shadow: 0 4px 6px -1px rgba(220, 38, 38, 0.3);
                transition: all 0.3s ease;
                margin: 16px 0;
              }
              
              .approval-button:hover {
                transform: translateY(-2px);
                box-shadow: 0 8px 15px -3px rgba(220, 38, 38, 0.4);
              }
              
              .approval-button::before {
                content: '✅';
                margin-right: 8px;
                font-size: 18px;
              }
              
              .info-box {
                background-color: #f0fdf4;
                border: 1px solid #bbf7d0;
                border-radius: 8px;
                padding: 16px;
                margin: 24px 0;
              }
              
              .info-box h4 {
                color: #166534;
                font-size: 16px;
                font-weight: 600;
                margin-bottom: 8px;
                display: flex;
                align-items: center;
              }
              
              .info-box h4::before {
                content: 'ℹ️';
                margin-right: 8px;
              }
              
              .info-box p {
                color: #374151;
                font-size: 14px;
                line-height: 1.5;
              }
              
              .footer {
                background-color: #f9fafb;
                padding: 24px 30px;
                text-align: center;
                border-top: 1px solid #e5e7eb;
              }
              
              .footer p {
                color: #6b7280;
                font-size: 14px;
                margin-bottom: 8px;
              }
              
              .footer-links {
                margin-top: 16px;
              }
              
              .footer-links a {
                color: #dc2626;
                text-decoration: none;
                margin: 0 8px;
                font-weight: 500;
              }
              
              .footer-links a:hover {
                text-decoration: underline;
              }
              
              @media (max-width: 600px) {
                .email-container {
                  margin: 0;
                  border-radius: 0;
                }
                
                .header, .content, .footer {
                  padding: 24px 20px;
                }
                
                .header h1 {
                  font-size: 24px;
                }
                
                .skill-detail {
                  flex-direction: column;
                  align-items: flex-start;
                }
                
                .skill-detail-label {
                  min-width: auto;
                  margin-right: 0;
                  margin-bottom: 4px;
                }
              }
            </style>
          </head>
          <body>
            <div class="email-container">
              <div class="header">
               
                <h1>New Skill Addition Request</h1>
                <p>Review and approve intern skill</p>
              </div>
              
              <div class="content">
                <div class="notification-badge">
                  Skill Approval Required
                </div>
                
                <p style="font-size: 16px; color: #374151; margin-bottom: 24px;">
                  Hello Administrator,
                </p>
                
                <p style="font-size: 16px; color: #374151; margin-bottom: 24px;">
                  An intern has requested to add a new skill to their profile. Please review the details below and approve or reject the request.
                </p>
                
                <div class="user-info">
                  <h4>Requesting Intern</h4>
                  <p><strong>Email:</strong> ${user.email}</p>
                  <p><strong>Name:</strong> ${user.name || 'Not provided'}</p>
                </div>
                
                <div class="skill-info">
                  <h3>Skill Details</h3>
                  <div class="skill-detail">
                    <span class="skill-detail-label">Skill Name:</span>
                    <span class="skill-detail-value">${skill.name}</span>
                  </div>
                  <div class="skill-detail">
                    <span class="skill-detail-label">Category:</span>
                    <span class="skill-detail-value">${skill.category}</span>
                  </div>
                  <div class="skill-detail">
                    <span class="skill-detail-label">Proficiency Level:</span>
                    <span class="skill-detail-value">${skill.level}</span>
                  </div>
                </div>
                
                <div class="action-section">
                  <a href="${approvalLink}" class="approval-button">
                    Review & Approve Skill
                  </a>
                </div>
                
                <div class="info-box">
                  <h4>What happens next?</h4>
                  <p>
                    Once approved, this skill will be added to the intern's profile and will be visible 
                    in their portfolio and skill assessments.
                  </p>
                </div>
                
                <p style="font-size: 14px; color: #6b7280; margin-top: 24px;">
                  Please review the skill details carefully before making your decision.
                </p>
              </div>
              
              <div class="footer">
                <p>This is an automated notification from the Zimlitech Internship Platform</p>
                <p style="font-size: 12px; color: #9ca3af;">
                  If you're having trouble with the button above, copy and paste this URL into your browser:
                </p>
                <p style="font-size: 12px; color: #dc2626; word-break: break-all;">
                  ${approvalLink}
                </p>
                <div class="footer-links">
                  <a href="${process.env.FRONTEND_URL }">Dashboard</a>
                  <span>•</span>
                  <a href="${process.env.FRONTEND_URL }/admin">Admin Panel</a>
                </div>
              </div>
            </div>
          </body>
          </html>
        `
      };
    
      await transporter.sendMail(mailOptions);

 } catch(err){
    console.error(err.message)
 }
};

module.exports.sendProjectApprovalEmail = async (intern, project) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      service: process.env.SMTP_SERVICE,
      auth: {
        user: process.env.SMTP_MAIL,
        pass: process.env.SMTP_PASSWORD
      }
    });

    // Construct approval link to frontend
    const approvalLink = `${process.env.FRONTEND_URL }/approve-project/${project.approvalToken}`;

    const mailOptions = {
      from: process.env.SMTP_MAIL,
      to: process.env.ADMIN_EMAIL,
      subject: '🚀 New Zimlitech Project Submission - Approval Required',
      html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Project Approval Request</title>
          <style>
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
              line-height: 1.6;
              color: #374151;
              background-color: #f9fafb;
            }
            
            .email-container {
              max-width: 600px;
              margin: 0 auto;
              background-color: #ffffff;
              border-radius: 12px;
              overflow: hidden;
              box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
            }
            
            .header {
              background: linear-gradient(135deg, #dc2626 0%, #b91c1c 50%, #991b1b 100%);
              padding: 40px 30px;
              text-align: center;
              position: relative;
            }
            
            .header::before {
              content: '';
              position: absolute;
              top: 0;
              left: 0;
              right: 0;
              bottom: 0;
              background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="25" cy="25" r="1" fill="white" opacity="0.1"/><circle cx="75" cy="75" r="1" fill="white" opacity="0.1"/><circle cx="50" cy="10" r="0.5" fill="white" opacity="0.1"/><circle cx="10" cy="60" r="0.5" fill="white" opacity="0.1"/><circle cx="90" cy="40" r="0.5" fill="white" opacity="0.1"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
              opacity: 0.3;
            }
            
            .logo {
              width: 60px;
              height: 60px;
              background-color: rgba(255, 255, 255, 0.2);
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              margin: 0 auto 20px;
              font-size: 24px;
              font-weight: bold;
              color: white;
              position: relative;
              z-index: 1;
            }
            
            .header h1 {
              color: white;
              font-size: 28px;
              font-weight: 700;
              margin-bottom: 8px;
              position: relative;
              z-index: 1;
            }
            
            .header p {
              color: rgba(255, 255, 255, 0.9);
              font-size: 16px;
              position: relative;
              z-index: 1;
            }
            
            .content {
              padding: 40px 30px;
            }
            
            .notification-badge {
              display: inline-flex;
              align-items: center;
              background-color: #fef3c7;
              color: #92400e;
              padding: 8px 16px;
              border-radius: 20px;
              font-size: 14px;
              font-weight: 600;
              margin-bottom: 24px;
            }
            
            .notification-badge::before {
              content: '🚀';
              margin-right: 8px;
              font-size: 16px;
            }
            
            .project-info {
              background-color: #f8fafc;
              border: 1px solid #e2e8f0;
              border-radius: 12px;
              padding: 24px;
              margin: 24px 0;
            }
            
            .project-info h3 {
              color: #1f2937;
              font-size: 18px;
              font-weight: 600;
              margin-bottom: 16px;
              display: flex;
              align-items: center;
            }
            
            .project-info h3::before {
              content: '📋';
              margin-right: 8px;
              font-size: 20px;
            }
            
            .project-detail {
              display: flex;
              align-items: flex-start;
              margin-bottom: 16px;
              padding: 12px;
              background-color: white;
              border-radius: 8px;
              border-left: 4px solid #dc2626;
            }
            
            .project-detail:last-child {
              margin-bottom: 0;
            }
            
            .project-detail-label {
              font-weight: 600;
              color: #6b7280;
              min-width: 120px;
              margin-right: 12px;
              flex-shrink: 0;
            }
            
            .project-detail-value {
              color: #1f2937;
              font-weight: 500;
              flex: 1;
            }
            
            .intern-info {
              background-color: #eff6ff;
              border: 1px solid #dbeafe;
              border-radius: 8px;
              padding: 16px;
              margin: 24px 0;
            }
            
            .intern-info h4 {
              color: #1e40af;
              font-size: 16px;
              font-weight: 600;
              margin-bottom: 8px;
              display: flex;
              align-items: center;
            }
            
            .intern-info h4::before {
              content: '👤';
              margin-right: 8px;
            }
            
            .intern-info p {
              color: #374151;
              font-size: 14px;
              line-height: 1.5;
            }
            
            .action-section {
              text-align: center;
              margin: 32px 0;
            }
            
            .approval-button {
              display: inline-block;
              background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
              color: white;
              text-decoration: none;
              padding: 16px 32px;
              border-radius: 12px;
              font-weight: 600;
              font-size: 16px;
              box-shadow: 0 4px 6px -1px rgba(220, 38, 38, 0.3);
              transition: all 0.3s ease;
              margin: 16px 0;
            }
            
            .approval-button:hover {
              transform: translateY(-2px);
              box-shadow: 0 8px 15px -3px rgba(220, 38, 38, 0.4);
            }
            
            .approval-button::before {
              content: '✅';
              margin-right: 8px;
              font-size: 18px;
            }
            
            .info-box {
              background-color: #f0fdf4;
              border: 1px solid #bbf7d0;
              border-radius: 8px;
              padding: 16px;
              margin: 24px 0;
            }
            
            .info-box h4 {
              color: #166534;
              font-size: 16px;
              font-weight: 600;
              margin-bottom: 8px;
              display: flex;
              align-items: center;
            }
            
            .info-box h4::before {
              content: 'ℹ️';
              margin-right: 8px;
            }
            
            .info-box p {
              color: #374151;
              font-size: 14px;
              line-height: 1.5;
            }
            
            .footer {
              background-color: #f9fafb;
              padding: 24px 30px;
              text-align: center;
              border-top: 1px solid #e5e7eb;
            }
            
            .footer p {
              color: #6b7280;
              font-size: 14px;
              margin-bottom: 8px;
            }
            
            .footer-links {
              margin-top: 16px;
            }
            
            .footer-links a {
              color: #dc2626;
              text-decoration: none;
              margin: 0 8px;
              font-weight: 500;
            }
            
            .footer-links a:hover {
              text-decoration: underline;
            }
            
            @media (max-width: 600px) {
              .email-container {
                margin: 0;
                border-radius: 0;
              }
              
              .header, .content, .footer {
                padding: 24px 20px;
              }
              
              .header h1 {
                font-size: 24px;
              }
              
              .project-detail {
                flex-direction: column;
                align-items: flex-start;
              }
              
              .project-detail-label {
                min-width: auto;
                margin-right: 0;
                margin-bottom: 4px;
              }
            }
          </style>
        </head>
        <body>
          <div class="email-container">
            <div class="header">
              
              <h1>New Project Submission</h1>
              <p>Review and approve intern project</p>
            </div>
            
            <div class="content">
              <div class="notification-badge">
                Project Approval Required
              </div>
              
              <p style="font-size: 16px; color: #374151; margin-bottom: 24px;">
                Hello Administrator,
              </p>
              
              <p style="font-size: 16px; color: #374151; margin-bottom: 24px;">
                An intern has submitted a new Zimlitech project for your review and approval. 
                Please examine the project details below.
              </p>
              
              <div class="intern-info">
                <h4>Project Submitted By</h4>
                <p><strong>Name:</strong> ${intern.name}</p>
                <p><strong>Email:</strong> ${intern.email}</p>
              </div>
              
              <div class="project-info">
                <h3>Project Details</h3>
                <div class="project-detail">
                  <span class="project-detail-label">Project Title:</span>
                  <span class="project-detail-value">${project.title}</span>
                </div>
                <div class="project-detail">
                  <span class="project-detail-label">Description:</span>
                  <span class="project-detail-value">${project.description}</span>
                </div>
                <div class="project-detail">
                  <span class="project-detail-label">Technologies:</span>
                  <span class="project-detail-value">${project.technologies?.join(', ') || 'Not specified'}</span>
                </div>
                <div class="project-detail">
                  <span class="project-detail-label">Submitted:</span>
                  <span class="project-detail-value">${new Date(project.submittedAt).toLocaleString()}</span>
                </div>
              </div>
              
              <div class="action-section">
                <a href="${approvalLink}" class="approval-button">
                  Review & Approve Project
                </a>
              </div>
              
              <div class="info-box">
                <h4>What happens next?</h4>
                <p>
                  Once approved, this project will be visible in the intern's portfolio and can be showcased 
                  to potential employers and mentors.
                </p>
              </div>
              
              <p style="font-size: 14px; color: #6b7280; margin-top: 24px;">
                This project will be visible to the intern only after approval.
              </p>
            </div>
            
            <div class="footer">
              <p>This is an automated notification from the Zimlitech Internship Platform</p>
              <p style="font-size: 12px; color: #9ca3af;">
                If you're having trouble with the button above, copy and paste this URL into your browser:
              </p>
              <p style="font-size: 12px; color: #dc2626; word-break: break-all;">
                ${approvalLink}
              </p>
              <div class="footer-links">
                <a href="${process.env.FRONTEND_URL }">Dashboard</a>
                <span>•</span>
                <a href="${process.env.FRONTEND_URL}/admin">Admin Panel</a>
              </div>
            </div>
          </div>
        </body>
        </html>
      `
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error sending project approval email:', error);
    throw error;
  }
};