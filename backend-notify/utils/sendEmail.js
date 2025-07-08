// utils/sendEmail.js
const nodemailer = require('nodemailer');

const sendEmail = async (user, contest) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    secure: true,
    port: 465,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS
    }
  });

  await transporter.sendMail({
    from: process.env.MAIL_USER,
    to: user.email,
    subject: `⏰ Reminder: ${contest.name} starts soon!`,
    html: `
      <p>Hey <strong>${user.username}</strong>!</p>
      <p>Your bookmarked contest <strong>${contest.name}</strong> on <strong>${contest.platform}</strong> is starting soon.</p>
      <p>⏰ Start Time: <strong>${new Date(contest.startTime).toLocaleString()}</strong> UTC</p>
      <p>(Time may vary according to your geographical location.)</p>
      <p><a href="${contest.url}">🔗 Click here to view the contest</a></p>
      <p>Good luck!</p>
    `
  });
};

module.exports = sendEmail;
