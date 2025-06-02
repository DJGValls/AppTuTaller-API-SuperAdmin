import mongoose, { Schema } from "mongoose";
import { User } from "types/UserTypes";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema<User>(
    {
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
            trim: true,
        },
        name: {
            type: String,
            required: true,
        },
        firstName: {
            type: String,
            required: true,
        },
        lastName: {
            type: String,
            required: true,
        },
        phone: {
            type: String,
            required: true,
        },
        permissions: {
            type: [String],
            default: [],
        },
        roles: [
            {
                ref: "Roles",
                type: Schema.Types.ObjectId,
            },
        ],
        // modifyBy: {
        //     type: String,
        // },
        // createdBy: {
        //     type: String,
        // },
        // deletedBy: {
        //     type: String,
        // },
        // deletedAt: {
        //     type: Date,
        // },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

// Para encriptar el password al guardarlo o actualizarlo
userSchema.pre<User>("save", async function (next) {
    if (this.isModified("password") || this.isNew) {
        const salt = await bcrypt.genSalt(12);
        const hash = await bcrypt.hash(this.password, salt);
        this.password = hash;
    }
    next();
});

// Para comparar el password al iniciar sesión
userSchema.method("comparePassword", async function (password: string): Promise<boolean> {
    return await bcrypt.compare(password, this.password);
});

// Para eliminar el password de la respuesta de la base de datos
userSchema.methods.toJSON = function () {
    const userResponse = this.toObject();
    delete userResponse.password;
    return userResponse;
};

export const UserModel = mongoose.model<User>("User", userSchema);
