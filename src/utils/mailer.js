import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_USER, 
    pass: process.env.SMTP_PASS, 
  },
});

export const sendClassCreationEmail = async (toEmail, classInfo) => {
  const mailOptions = {
    from: process.env.SMTP_USER,
    to: toEmail,
    subject: `Class Created Successfully: ${classInfo.className}`,
    html: `
      <h2>Class Details</h2>
      <p><strong>Class Name:</strong> ${classInfo.className}</p>
      <p><strong>Description:</strong> ${classInfo.shortDescription}</p>
      <p><strong>Google Meet Link:</strong> <a href="${classInfo.googleMeetLink}" target="_blank">${classInfo.googleMeetLink}</a></p>
      <p><strong>Teacher:</strong> ${classInfo.teacherName}</p>
      <p><strong>Specialization:</strong> ${classInfo.teacherSpecialization}</p>
      <p><strong>Language:</strong> ${classInfo.language}</p>
    `
  };

  await transporter.sendMail(mailOptions);
};
