import ClassModel from "../schema/classSchema.js";

const createClass = async (classData) => {
  const newClass = new ClassModel(classData);
  return await newClass.save();
};

const updateClass = async (classId, updateData) => {
  return await ClassModel.findByIdAndUpdate(classId, updateData, { new: true });
};

const deleteClass = async (classId) => {
  return await ClassModel.findByIdAndDelete(classId);
};


export { createClass, updateClass, deleteClass };
