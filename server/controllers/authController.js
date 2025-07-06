const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Intern = require('../models/Intern');
const crypto = require('crypto');
const { sendAdminApprovalEmail, sendPasswordResetEmail } = require('../utils/sendEmail');


module.exports.registerUSer = async (req, res) => {
    try {
      const { name, email, password, phone, role } = req.body;
      // Check if intern already exists
      let intern = await Intern.findOne({ email });
      if (intern) {
        return res.status(400).json({ error: 'Intern already exists' });
      }
      const approvalToken = crypto.randomBytes(32).toString('hex');
      // Create new intern
      intern = new Intern({
        name,
        email,
        phone,
        role: role || 'Intern',
        password,
        approvalToken
      });
  
      await intern.save();

      const approvalLink = `${process.env.FRONTEND_URL}/approve-intern/${approvalToken}`;
      await sendAdminApprovalEmail(intern, approvalLink);
  
            // Create JWT token with 24 hours expiration
      const payload = {
        user: {
          id: intern.id,
          email: intern.email
        }
      };

      jwt.sign(
        payload,
        process.env.JWT_SECRET,
        { expiresIn: '24h' }, // Extended to 24 hours for better user experience
        (err, token) => {
          if (err) throw err;
          res.json({ 
            token,
            user: {
              _id: intern._id,
              email: intern.email,
              name: intern.name
            }
          });
        }
      );
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({ error: 'Server error' });
    }
  }

  module.exports.approveIntern = async (req, res) => {
   try{ 
    
    const { token } = req.params;
    const intern = await Intern.findOne({ approvalToken: token });
    if(!intern){
      return res.status(400).json({error:'Invalid token'})
    }
    intern.isApproved = true;
    intern.approvalToken = undefined;
    await intern.save();
    res.json({message:'Intern approved successfully'})
   } catch(err){
    res.status(500).json({error:'Server Error'})
   }
  }

  module.exports.loginUser = async (req, res) => {
    try {
      const { email, password } = req.body;
  
      // Check if intern exists
      const intern = await Intern.findOne({ email });
      if (!intern) {
       
        return res.status(400).json({ error: 'Invalid credentials' });
      }
  
  
      // Check password
      if (!password) {
     
        return res.status(400).json({ error: 'Password is required' });
      }
  
      if (!intern.password) {
        return res.status(400).json({ error: 'Invalid credentials' });
      }
  
      const isMatch = await intern.comparePassword(password);
  
      if (!isMatch) {
        return res.status(400).json({ error: 'Invalid credentials' });
      }
      if(!intern.isApproved){
        return res.status(400).json({error:'Please wait for approval '})
      }
  
  
            // Create JWT token with 24 hours expiration
      const payload = {
        user: {
          id: intern._id,
          email: intern.email
        }
      };

      jwt.sign(
        payload,
        process.env.JWT_SECRET,
        { expiresIn: '24h' }, // Extended to 24 hours for better user experience
        (err, token) => {
          if (err) throw err;
          res.json({ 
            token,
            user: {
              _id: intern._id,
              email: intern.email,
              name: intern.name
            }
          });
        }
      );
    } catch (error) {
      console.error('❌ Login error:', error);
      res.status(500).json({ error: 'Server error' });
    }
  }

  module.exports.forgotPassword = async (req, res) => {
    try {
      const { email } = req.body;
      
      if (!email) {
        return res.status(400).json({ error: 'Email is required' });
      }

      const intern = await Intern.findOne({ email });
      if (!intern) {
        return res.status(400).json({ error: 'No user found with that email address' });
      }

      // Generate reset token (JWT, expires in 1h)
      const resetToken = jwt.sign(
        { id: intern._id, email: intern.email },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );

      // Create reset link
      const resetLink = `${process.env.FRONTEND_URL}/auth/reset-password?token=${resetToken}`;
      // Send email
      try {
        await sendPasswordResetEmail(intern, resetLink);
        res.json({ 
          message: 'Password reset link has been sent to your email',
          success: true
        });
      } catch (emailError) {
        console.error('Email sending failed:', emailError);
        // For development, still return the token
        // if (process.env.NODE_ENV === 'development') {
        //   res.json({ 
        //     message: 'Password reset link generated (email failed)', 
        //     resetToken,
        //     resetLink,
        //     success: true
        //   });
        // } else {
        //   res.status(500).json({ error: 'Failed to send reset email. Please try again.' });
        // }
      }
    } catch (error) {
      console.error('Forgot password error:', error);
      res.status(500).json({ error: 'Server error' });
    }
  };

  module.exports.resetPassword = async (req, res) => {
    try {
      const { token, password } = req.body;
      
      if (!token || !password) {
        return res.status(400).json({ error: 'Token and new password are required' });
      }

      if (password.length < 6) {
        return res.status(400).json({ error: 'Password must be at least 6 characters long' });
      }

      // Verify token
      let decoded;
      try {
        decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
      } catch (err) {
        return res.status(400).json({ error: 'Invalid or expired reset token' });
      }

      // Find user and update password
      const intern = await Intern.findById(decoded.id);
      if (!intern) {
        return res.status(400).json({ error: 'User not found' });
      }

      // Update password
      intern.password = password;
      await intern.save();

      res.json({ 
        message: 'Password has been reset successfully. You can now login with your new password.',
        success: true
      });
    } catch (error) {
      console.error('Reset password error:', error);
      res.status(500).json({ error: 'Server error' });
    }
  };

  module.exports.getCurrentUser = async (req, res) => {
    try {
      const intern = await Intern.findById(req.user.id).select('-password');
      res.json({ user: intern });
    } catch (error) {
      console.error('Get user error:', error);
      res.status(500).json({ error: 'Server error' });
    }
  }