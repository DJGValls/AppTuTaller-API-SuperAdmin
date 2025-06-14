import mongoose from "mongoose";
import { PaymentMethodEnum } from "enums/PaymentMethods.enums";

export interface PaymentMethod extends Document {
    workshop: mongoose.Types.ObjectId;
    type: PaymentMethodEnum;
    deletedAt?: Date;
    deletedBy?: mongoose.Types.ObjectId;
}
