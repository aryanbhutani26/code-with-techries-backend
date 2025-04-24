import Admin from "../schema/adminSchema.js";

const getAdminByEmail = async (email) => {
  return await Admin.findOne({ email });
};

const updateAdminName = async (id, name) => {
  return await Admin.findByIdAndUpdate(id, { name }, { new: true });
};

const updateAdminProfileImage = async (id, imagePath) => {
  return await Admin.findByIdAndUpdate(
    id,
    { profilePicture: imagePath, imageUrl: imagePath },
    { new: true }
  );
};

export { getAdminByEmail, updateAdminName, updateAdminProfileImage };
