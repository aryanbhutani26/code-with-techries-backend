import Admin from "../schema/adminSchema.js";

const getAdminByEmail = async (email) => {
  return await Admin.findOne({ email });
};

const updateAdminName = async (adminId, updates) => {
  return await Admin.findByIdAndUpdate(adminId, updates, { new: true });
};

const updateAdminProfileImage = async (id, imagePath) => {
  return await Admin.findByIdAndUpdate(
    id,
    { profilePicture: imagePath, imageUrl: imagePath },
    { new: true }
  );
};

export { getAdminByEmail, updateAdminName, updateAdminProfileImage };
