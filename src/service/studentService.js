import Student from "../schema/studentSchema.js";

const registerStudent = async (data) => {
  const existing = await Student.findOne({ email: data.email });
  if (existing) throw new Error("Email already exists");

  const student = new Student(data);
  await student.save();
  const token = student.generateJWT();
  return { student, token };
};

const loginStudent = async ({ email, password }) => {
  const student = await Student.findOne({ email });
  if (!student) throw new Error("User not found");

  const isMatch = await student.comparePassword(password);
  if (!isMatch) throw new Error("Invalid credentials");

  const token = student.generateJWT();
  return { student, token };
};


export { registerStudent, loginStudent };