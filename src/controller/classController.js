import ClassModel from "../schema/classSchema.js";
import AdminModel from "../schema/adminSchema.js"; // Assuming admin data is stored here
import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

// Nodemailer transporter setup
const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Helper to get Admin Email
const getAdminEmail = async () => {
  const admin = await AdminModel.findOne();
  return admin?.email || "fallback-admin@example.com"; // fallback email if admin not found
};

// Create a new class
const createClass = async (req, res) => {
  try {
    const newClass = await ClassModel.create(req.body);
    res.status(201).json({
      success: true,
      message: "Class created successfully",
      class: newClass,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Teacher requests a class update
const requestClassUpdate = async (req, res) => {
  try {
    const classId = req.params.id;
    const teacherId = req.user._id;

    const classItem = await ClassModel.findOne({
      _id: classId,
      teacherId: teacherId,
    }).populate("teacherId", "name email username");

    if (!classItem) {
      return res.status(404).json({
        success: false,
        message: "Class not found or you don't have permission to update it",
      });
    }

    const updateableFields = [
      "className",
      "shortDescription",
      "longDescription",
      "teacherName",
      "relatedTopics",
      "originalPrice",
      "teacherSpecialization",
      "teacherRating",
      "discountedPrice",
      "courseIncludes",
      "whatYouWillLearn",
      "thisCourseIncludes",
      "language",
      "WhatsAppCommunityLink",
    ];

    const filteredChanges = {};
    for (const field of updateableFields) {
      if (req.body[field] !== undefined) {
        filteredChanges[field] = req.body[field];
      }
    }

    if (Object.keys(filteredChanges).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No valid fields provided for update",
      });
    }

    classItem.pendingChanges = filteredChanges;
    classItem.isPendingApproval = true;
    await classItem.save();

    const adminEmail = await getAdminEmail();

    const mailOptions = {
      from: `"GG Ki Pathshala" <${process.env.SMTP_USER}>`,
      to: adminEmail,
      subject: `Class Update Approval Request from ${classItem.teacherId.name}`,
      html: `
        <h2>Teacher Request for Class Update</h2>
        <p><strong>Teacher Name:</strong> ${classItem.teacherId.name}</p>
        <p><strong>Teacher Email:</strong> ${classItem.teacherId.email}</p>
        <p><strong>Username:</strong> ${classItem.teacherId.username}</p>
        <p><strong>Class Name:</strong> ${classItem.className}</p>
        <p><strong>Class ID:</strong> ${classItem._id}</p>
        <h3>Requested Changes:</h3>
        <pre>${JSON.stringify(filteredChanges, null, 2)}</pre>
        <p>Please review and approve or reject the changes from Admin Panel.</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({
      success: true,
      message: "Update request submitted. Awaiting admin approval.",
      pendingChanges: filteredChanges,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Admin approves a class update
const approveClassUpdate = async (req, res) => {
  try {
    const classId = req.params.id;

    const classData = await ClassModel.findById(classId).populate("teacherId", "email name");

    if (!classData || !classData.isPendingApproval || !classData.pendingChanges) {
      return res.status(404).json({
        success: false,
        message: "Class not found or no pending changes found.",
      });
    }

    const pendingChanges = classData.pendingChanges;
    for (const [key, value] of Object.entries(pendingChanges)) {
      if (!["_id", "teacherId", "createdAt", "updatedAt"].includes(key)) {
        classData[key] = value;
      }
    }

    classData.pendingChanges = null;
    classData.isPendingApproval = false;

    await classData.save();

    if (classData.teacherId?.email) {
      const mailOptions = {
        from: `"GG Ki Pathshala Admin" <${process.env.SMTP_USER}>`,
        to: classData.teacherId.email,
        subject: "Class Update Approved ✔️",
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px;">
            <h2 style="color: #4CAF50;">Congratulations!</h2>
            <p>Dear <strong>${classData.teacherId.name}</strong>,</p>
            <p>Your updates for the class <strong>"${classData.className}"</strong> have been <span style="color: green;">approved</span>.</p>
            <h3>Updated Class Details:</h3>
            <ul>
              <li><strong>Class Name:</strong> ${classData.className}</li>
              <li><strong>Short Description:</strong> ${classData.shortDescription}</li>
              <li><strong>Teacher Rating:</strong> ${classData.teacherRating}</li>
              <li><strong>Teacher Specialization:</strong> ${classData.teacherSpecialization}</li>
              <li><strong>Discounted Price:</strong> ${classData.discountedPrice || "N/A"}</li>
            </ul>
            <p>Thanks for contributing!</p>
            <p>Regards,<br>GG Ki Pathshala Admin</p>
          </div>
        `,
      };

      await transporter.sendMail(mailOptions);
    }

    res.status(200).json({
      success: true,
      message: "Class update approved and confirmation email sent.",
      updatedClass: classData,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Admin rejects a class update
const rejectClassUpdate = async (req, res) => {
  try {
    const classId = req.params.id;
    const classItem = await ClassModel.findById(classId).populate("teacherId", "email name");

    if (!classItem || !classItem.isPendingApproval || !classItem.pendingChanges) {
      return res.status(404).json({
        success: false,
        message: "Class not found or no pending changes found.",
      });
    }

    classItem.pendingChanges = null;
    classItem.isPendingApproval = false;
    await classItem.save();

    if (classItem.teacherId?.email) {
      const mailOptions = {
        from: `"GG Ki Pathshala" <${process.env.SMTP_USER}>`,
        to: classItem.teacherId.email,
        subject: "Class Update Request Rejected",
        html: `
          <h2>Update Request Rejected</h2>
          <p>Dear ${classItem.teacherId.name},</p>
          <p>Your update request for the class <strong>${classItem.className}</strong> was <span style="color: red;">rejected</span>.</p>
          <p>Contact support if you have questions.</p>
          <p>Regards,<br>GG Ki Pathshala Team</p>
        `,
      };

      await transporter.sendMail(mailOptions);
    }

    res.status(200).json({
      success: true,
      message: "Class update rejected and teacher notified.",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all classes
const getAllClasses = async (req, res) => {
  try {
    const classes = await ClassModel.find()
      .populate("teacherId", "name email username profilePicture -password")
      .select("-pendingChanges -isPendingApproval");

    res.status(200).json({
      success: true,
      count: classes.length,
      classes,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch classes",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// Delete a class
const deleteClass = async (req, res) => {
  try {
    const classId = req.params.id;

    const deletedClass = await ClassModel.findByIdAndDelete(classId);

    if (!deletedClass) {
      return res.status(404).json({ success: false, message: "Class not found" });
    }

    res.status(200).json({
      success: true,
      message: "Class deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export {
  createClass,
  requestClassUpdate,
  approveClassUpdate,
  rejectClassUpdate,
  getAllClasses,
  deleteClass,
};
