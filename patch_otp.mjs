import fs from 'fs';

let content = fs.readFileSync('server/app.js', 'utf8');

// Add verifyLimiter
const verifyLimiter = `const verifyLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 10, message: { error: 'Too many verification attempts' } });`;
if (!content.includes('verifyLimiter =')) {
  content = content.replace("const otpLimiter = rateLimit({", verifyLimiter + "\n  const otpLimiter = rateLimit({");
}

// Patch resend-verification
content = content.replace(
  /const verificationCode = Math\.floor[^;]+;\s*user\.verificationCode = verificationCode;\s*user\.verificationExpires = new Date\(Date\.now\(\) \+ 15 \* 60 \* 1000\);\s*user\.verificationAttempts = 0;/g,
  `const otp = generateOTP();
      user.otp = otp;
      user.otpExpires = new Date(Date.now() + 15 * 60000);
      user.otpAttempts = 0;`
).replace(
  /await sendOtpEmail\(email, verificationCode\);/g,
  `await sendOtpEmail(email, otp, 'Verification');`
);

// Patch /api/customer/verify
const verifyOld = `app.post('/api/customer/verify', checkDb, async (req, res, next) => {
    try {
      const { email, otp } = req.body;
      const user = await User.findOne({ email, role: 'customer' });
      if (!user) return res.status(404).json({ error: 'User not found' });
      if (user.isVerified) return res.status(400).json({ error: 'Already verified' });
      if (!otp || !user.otp || user.otp !== String(otp) || user.otpExpires < new Date()) {
        return res.status(400).json({ error: 'Invalid or expired OTP' });
      }`;
const verifyNew = `app.post('/api/customer/verify', verifyLimiter, checkDb, async (req, res, next) => {
    try {
      const { email, otp } = req.body;
      const user = await User.findOne({ email, role: 'customer' });
      if (!user) return res.status(404).json({ error: 'User not found' });
      if (user.isVerified) return res.status(400).json({ error: 'Already verified' });
      
      if (user.otpAttempts >= 5) {
        user.otp = undefined;
        user.otpExpires = undefined;
        await user.save();
        return res.status(400).json({ error: 'Too many attempts. Please request a new OTP.' });
      }

      if (!otp || !user.otp || user.otp !== String(otp) || user.otpExpires < new Date()) {
        user.otpAttempts = (user.otpAttempts || 0) + 1;
        await user.save();
        return res.status(400).json({ error: 'Invalid or expired OTP' });
      }`;
content = content.replace(verifyOld, verifyNew);

// Patch /api/customer/reset-password
const resetOld = `app.post('/api/customer/reset-password', checkDb, async (req, res, next) => {
    try {
      const { email, otp, newPassword } = req.body;
      const user = await User.findOne({ email, role: 'customer' });
      if (!user) return res.status(404).json({ error: 'User not found' });
      if (!otp || !user.otp || user.otp !== String(otp) || user.otpExpires < new Date()) {
        return res.status(400).json({ error: 'Invalid or expired OTP' });
      }`;
const resetNew = `app.post('/api/customer/reset-password', verifyLimiter, checkDb, async (req, res, next) => {
    try {
      const { email, otp, newPassword } = req.body;
      const user = await User.findOne({ email, role: 'customer' });
      if (!user) return res.status(404).json({ error: 'User not found' });
      
      if (user.otpAttempts >= 5) {
        user.otp = undefined;
        user.otpExpires = undefined;
        await user.save();
        return res.status(400).json({ error: 'Too many attempts. Please request a new OTP.' });
      }

      if (!otp || !user.otp || user.otp !== String(otp) || user.otpExpires < new Date()) {
        user.otpAttempts = (user.otpAttempts || 0) + 1;
        await user.save();
        return res.status(400).json({ error: 'Invalid or expired OTP' });
      }`;
content = content.replace(resetOld, resetNew);

fs.writeFileSync('server/app.js', content);
console.log('Fixed OTP logic and limiters');
