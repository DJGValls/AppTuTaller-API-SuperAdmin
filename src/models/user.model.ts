import mongoose, { Schema } from "mongoose";
import { User } from "types/UserTypes";
import bcrypt from "bcryptjs";
import { UserTypesEnum } from "enums/UserTypes.enums";

const userSchema = new mongoose.Schema<User>(
    {
        email: {
            type: String,
            required: true,
            unique: true,
            index: true
        },
        password: {
            type: String,
            required: true,
            trim: true,
        },
        contact: {
            type: Schema.Types.ObjectId,
            ref: "Contact",
        },
        userTypes: [
            {
                type: String,
                enum: Object.values(UserTypesEnum),
                required: true,
                default: UserTypesEnum.CLIENT,
            },
        ],
        roles: [
            {
                type: Schema.Types.ObjectId,
                ref: "Roles",
                required: true,
            },
        ],
        permissions: {
            type: [String],
            default: [],
            required: true,
        },
        // Agrupamos los campos específicos por tipo de usuario
        workshopAdminProfile: {
            managedWorkshops: [
                {
                    type: Schema.Types.ObjectId,
                    ref: "Workshops",
                },
            ],
            isWorkshopAdmin: {
                type: Boolean,
                default: false,
            },
        },
        employeeProfile: {
            workshops: [
                {
                    type: Schema.Types.ObjectId,
                    ref: "Workshops",
                },
            ],
            isEmployee: {
                type: Boolean,
                default: false,
            },
            category: String,
            speciality: String,
        },
        clientProfile: {
            preferredWorkshops: [
                {
                    type: Schema.Types.ObjectId,
                    ref: "Workshops",
                },
            ],
            isClient: {
                type: Boolean,
                default: false,
            },
        },
        deletedAt: Date,
        deletedBy: {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
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
