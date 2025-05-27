import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

export const sendRecruiterNotification = async ({ recruiterEmail, recruiterName, action, job }) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.SMTP_USER, // your app's email
      pass: process.env.SMTP_PASS,
    },
  });

  const subject = `Job ${action} by Recruiter: ${recruiterName}`;
  const html = `
    <div style="font-family: Arial, sans-serif; padding: 16px;">
      <h2 style="color: #333;">Job ${action} Notification</h2>
      <p><strong>Recruiter:</strong> ${recruiterName} (${recruiterEmail})</p>
      <p><strong>Action:</strong> ${action}</p>
      <h3>Job Details:</h3>
      <ul>
        <li><strong>Title:</strong> ${job.jobTitle}</li>
        <li><strong>Type:</strong> ${job.jobType}</li>
        <li><strong>Location:</strong> ${job.location}</li>
        <li><strong>Salary:</strong> ${job.salaryPerMonth}</li>
        <li><strong>Experience:</strong> ${job.experienceInYears} years</li>
      </ul>
    </div>
  `;

  await transporter.sendMail({
    from: recruiterEmail, // sent from recruiter email
    to: process.env.SMTP_USER, // send to the main email
    subject,
    html,
  });
};
