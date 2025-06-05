import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config(); 

export const sendDeveloperNotification = async ({ developerEmail, developerName, action, project }) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const subject = `Project ${action} by Developer: ${developerName}`;
  const html = `
    <div style="font-family: Arial, sans-serif; padding: 16px;">
      <h2 style="color: #333;">Project ${action} Notification</h2>
      <p><strong>Developer:</strong> ${developerName} (${developerEmail})</p>
      <p><strong>Action:</strong> ${action}</p>
      <h3>Project Details:</h3>
      <ul>
        <li><strong>Title:</strong> ${project.title}</li>
        <li><strong>Description:</strong> ${project.description}</li>
        <li><strong>Tech Stack:</strong> ${project.techStack.join(', ')}</li>
        <li><strong>Repository Link:</strong> <a href="${project.repoLink}">${project.repoLink}</a></li>
        <li><strong>Live Link:</strong> <a href="${project.liveLink}">${project.liveLink}</a></li>
      </ul>
    </div>
  `;

  await transporter.sendMail({
    from: `"${developerName} via DevPlatform" <${process.env.SMTP_USER}>`,
    to: process.env.SMTP_USER,
    subject,
    html,
  });
};
