import mongoose from "mongoose";
import { PaymentMethodEnum } from "../enums/PaymentMethods.enums";

export interface PaymentMethod extends Document {
    workshop: mongoose.Types.ObjectId;
    type: PaymentMethodEnum;
    deletedAt?: Date;
    deletedBy?: mongoose.Types.ObjectId;
}

export interface PaypalPayment {
    email: string;
}

export interface BankAccountPayment {
    accountNumber: string;
    bankName: string;
    accountHolderName: string;
    swiftCode: string;
    iban: string;
}

export interface CreditCard {
    cardNumber: string;
    expirationDate: Date;
    cvv: string;
    cardHolderName: string;
}

export interface FreeDemoPayment {
    dateStart: Date;
    expirationDate: Date;
    expirated: boolean;
}
