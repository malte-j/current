import mail from '@sendgrid/mail';
import debug from './debug';

if(!process.env.SENDGRID_API_KEY)
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