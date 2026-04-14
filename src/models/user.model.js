import mongoose, { Schema } from 'mongoose';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        index: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    fullName: {
        type: String,
        required: true,
        index: true, // ✅ fixed typo
        trim: true,
    },
    avatar: {
        type: String,
        required: true,
    },
    coverImage: {
        type: String
    },
    watchHistory: [
        {
            type: Schema.Types.ObjectId,
            ref: "Video"
        }
    ],
    password: {
        type: String,
        required: [true, 'Password is required']
    },
    refreshToken: {
        type: String
    }

}, {
    timestamps: true
});


// ✅ FIXED PRE SAVE HOOK
userSchema.pre("save",async  function (next) {
    if (!this.isModified("password")) {
        return next();   // ✅ FIXED
    }

    this.password = await bcrypt.hash(this.password, 10);
    return next;
});


// ✅ PASSWORD CHECK
userSchema.methods.isPasswordCorrect = async function (password) {
    return bcrypt.compare(password, this.password);
};


// ✅ ACCESS TOKEN
userSchema.methods.generateAccessToken = function () {
    return jwt.sign(   // ✅ RETURN ADDED
        {
            _id: this._id,
            email: this.email,
            username: this.username,
            fullName: this.fullName   // ✅ FIXED
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    );
};


// ✅ REFRESH TOKEN
userSchema.methods.generateRefreshToken = function () {
    return jwt.sign(   // ✅ RETURN ADDED
        {
            _id: this._id,
            email: this.email,
            username: this.username,
            fullName: this.fullName   // ✅ FIXED
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    );
};

export const User = mongoose.model("User", userSchema);