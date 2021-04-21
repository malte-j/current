import mail from '@sendgrid/mail';
import debug from './debug';
import config from '../config'

if(!config.mail.apiKey)
  throw new Error("Sendgrid api key missing")

mail.setApiKey(process.env.SENDGRID_API_KEY)


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
    debug("mail successfully send");
    return mailRes;
  } catch(e) {

    debug("error sending email:");
    debug(e);
    throw e;
  }
}

export async function sendEmailVerification(user) {
   const verificationUrl = `${config.frontendUrl}/verifyEmail?token=${user.verificationToken}`;

  debug("sending verification mail with url: " + verificationUrl)

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
        "enable": config.env == 'test' || config.mail.disable
      }
    }
  }) 

}