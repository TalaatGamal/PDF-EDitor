const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// إنشاء شكل البيانات الخاصة بالمستخدم
const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true }, // الإيميل لازم يكون فريد
  password: { type: String, required: true },           // الباسوورد
});

// تشفير الباسوورد قبل الحفظ في قاعدة البيانات
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next(); // لو الباسوورد ما اتغيرش
  const salt = await bcrypt.genSalt(10);           // إنشاء salt لتشفير الباسوورد
  this.password = await bcrypt.hash(this.password, salt); // تشفير الباسوورد
  next();
});

module.exports = mongoose.model('User', UserSchema);
