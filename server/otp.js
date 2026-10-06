import {User} from './models.js';
import {problem} from './order-service.js';

export async function consumeOtp({email,otp,purpose,changes}, users=User) {
  if(typeof email!=='string'||typeof otp!=='string'||!/^\d{6}$/.test(otp))throw problem(400,'Enter your email and six-digit code.');
  // Increment in the database so concurrent guesses share the same five attempts.
  const user=await users.findOneAndUpdate({email:email.trim().toLowerCase(),role:'customer',otpPurpose:purpose,otpExpires:{$gt:new Date()},otpAttempts:{$lt:5}},{$inc:{otpAttempts:1}},{new:true});
  if(!user)throw problem(400,'Invalid, expired or locked code. Request a new code.');
  const token={_id:user._id,otp:user.otp,otpPurpose:purpose,otpExpires:user.otpExpires};
  if(!user.otp || user.otp!==otp){
    if(user.otpAttempts>=5)await users.updateOne({...token,otpAttempts:{$gte:5}},{$unset:{otp:1,otpExpires:1,otpPurpose:1}});
    throw problem(400,'Invalid code. After five attempts, request a new code.');
  }
  const consumed=await users.findOneAndUpdate({...token,otpAttempts:{$lte:5}},{$set:changes,$unset:{otp:1,otpExpires:1,otpPurpose:1}},{new:true,runValidators:true});
  if(!consumed)throw problem(400,'This code has already been used or replaced.');
  return consumed;
}
