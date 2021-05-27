import mail from '@sendgrid/mail';
import debug from 'debug';
const log = debug("service:sendMail")
import config from '../config'

if(!config.mail.apiKey){ 
  log("API key not found");
} else {
  mail.setApiKey(config.mail.apiKey)
}

// example message
// const msg = {
//   to: 'hi@malts.me', // Change to your recipient
//   from: 'hi@current.land', // Change to your verified sender
//   subject: 'Sending with SendGrid is Fun',
//   text: 'and easy to do anywhere, even with Node.js',
//   html: '<strong>and easy to do anywhere, even with Node.js</strong>',
// }
export async function sendEmail(msg) {
  try {
    let mailRes = await mail.send(msg);
    log("mail successfully send");
    return mailRes;
  } catch(e) {
    log("error sending email:");
    log(e);
    throw e;
  }
}

export async function sendEmailVerification(user) {
  const verificationUrl = `${config.frontendUrl}/verifyEmail?token=${user.emailVerificationToken}`;
  log("sending verification mail with url: " + verificationUrl)

  if(!config.mail.apiKey) {
    log("Not sending email because API key is missing")
    return;  
  }

  return await sendEmail({
    to: user.email,
    from: 'hi@current.land',
    subject: "Bestätige deine Email für current.land!",
    templateId: 'd-47efa73c68a9430599aa89ca3d2fd2db',
    dynamicTemplateData: {
      "verificationUrl": verificationUrl,
      "username": user.username
    },
    "mail_settings": {
      "sandbox_mode": {
        "enable": config.mail.disable
      }
    }
  }) 

}