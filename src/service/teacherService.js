import Teacher from "../schema/teacherSchema.js";

export const createTeacher = async (teacherData) => {
  return await Teacher.create(teacherData);
};

export const findTeacherByUsername = async (username) => {
  return await Teacher.findOne({ username });
};

export const findTeacherById = async (id) => {
  return await Teacher.findById(id);
};

export const updateTeacherProfile = async (id, updatedData) => {
  return await Teacher.findByIdAndUpdate(id, updatedData, { new: true });
};

export const deleteTeacher = async (username) => {
    return await Teacher.findOneAndDelete({ username });
};
