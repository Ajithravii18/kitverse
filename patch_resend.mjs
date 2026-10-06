import fs from 'fs';
let content = fs.readFileSync('server/app.js', 'utf8');

const newRoute = `
  app.post('/api/customer/resend-verification', otpLimiter, checkDb, async (req, res, next) => {
    try {
      const { email } = req.body;
      const user = await User.findOne({ email });
      if (!user) return res.status(404).json({ error: 'User not found' });
      if (user.isVerified) return res.status(400).json({ error: 'User is already verified' });

      const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
      user.verificationCode = verificationCode;
      user.verificationExpires = new Date(Date.now() + 15 * 60 * 1000);
      user.verificationAttempts = 0;
      await user.save();

      try {
        await sendOtpEmail(email, verificationCode);
        res.json({ success: true, message: 'Verification code sent.' });
      } catch (err) {
        res.status(500).json({ error: 'Failed to send verification email. Please try again.' });
      }
    } catch (err) { next(err); }
  });
`;

if (!content.includes('/api/customer/resend-verification')) {
  content = content.replace(
    "app.post('/api/customer/register'",
    newRoute + "\n  app.post('/api/customer/register'"
  );
  fs.writeFileSync('server/app.js', content);
  console.log('Added resend-verification route');
}
