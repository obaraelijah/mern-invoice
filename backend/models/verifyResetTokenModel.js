import mongoose from "mongoose";

const { Schema } = mongoose;

const verifyResetTokenSchema = new Schema({
	_userId: {
		type: mongoose.Schema.Types.ObjectId, //ObjectId reference to a document in the "User" collection
		required: true,
		ref: "User", 
	},
	token: { type: String, required: true },
	createdAt: {
		type: Date,
		required: true,
		default: Date.now,
		expires: 900, //15mins
	},
});

const VerifyResetToken = mongoose.model(
	"VerifyResetToken",
	verifyResetTokenSchema
);

export default VerifyResetToken;