import nodemailer from 'nodemailer';
import User from "@/models/userModel";
import bcryptjs from 'bcryptjs';


export const sendEmail = async({email, emailType, userId}:any) => {
    try {
        //create a hased token
        const hashedToken = await bcryptjs.hash(userId.toSTring(), 10)

        if (emailType === "VERIFY") {
            await User.findByIdAndUpdate(userId, {verifyToken: hashedToken, verifyTokenExpiry: Date.now() + 3600000})
        } else if(emailType === "RESET"){
            await User.findByIdAndUpdate(userId, {forgotPasswordToken: hashedToken, forgotPasswordTokenExpiry: Date.now() + 3600000})
        }

        var transport = nodemailer.createTransport({
            host: "sandbox.smtp.mailtrap.io",
            port: 2525,
            auth: {
              user: "ed4b243a62f256",
              pass: "f38c8de082c916"
              //TODO: add these credentials to .env file
            }
          });

          const mailOptions = {
            from: 'krane@web.com',
            to: email,
            subject: emailType === "VERIFY" ? "Verify your email" : "Reset your password",
            html: `<p>CLick <a href="${process.env.domain}/verifyemail?token=${hashedToken}">here</a> to $ {emailType === "VERIFY" ? "Verify your email" : "reset your password"}</p>`
          }

          const mailresponse = await transport.sendMail
          (mailOptions);
          return mailresponse;

    } catch (error:any) {
        throw new Error(error.message);
        
        
    }
}