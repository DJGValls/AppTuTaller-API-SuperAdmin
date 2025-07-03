import { UserRepository } from "repositories/userRepositories";
import { UserService } from "services/userService";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { InterfaceUserRepository, User } from "types/UserTypes";

const userRepository: InterfaceUserRepository = new UserRepository();
const userService = new UserService(userRepository);

export const registerUser = async (req: Request, res: Response) => {
    try {
        const { email }: User = req.body;
        const userExists = await userService.findUserByEmail(email);

        if (userExists) {
            res.status(400).json({ error: "User already exists" });
        }

        const newUser = await userService.createUser(req.body);
        res.status(201).json(newUser);
    } catch (error) {
        console.error("Bad request: ", error);
        res.status(400).json({ error: "Bad request" });
    }
};

export const loginUser = async (req: Request, res: Response) => {
    try {
        const { email, password }: User = req.body;

        const user = await userService.findUserByEmail(email);
        if (!user) {
            res.status(400).json({ error: "Invalid user or password" });
        }

        const comparePassword = await user?.comparePassword(password);
        if (!comparePassword) {
            res.status(400).json({ error: "Invalid user or password" });
        }

        const token = jwt.sign(
            { id: user?.id, email: user?.email },
            process.env.JWT_SECRET as string,
            { expiresIn: "1d" }
        );
        res.json(token);
        
    } catch (error) {
        console.error("Bad request: ", error);
        res.status(400).json({ error: "Bad request" });
    }
};
