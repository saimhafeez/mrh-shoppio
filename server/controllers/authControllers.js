import User from "../models/User.js";
import { StatusCodes } from "http-status-codes";
import { BadRequestError, UnAuthenticatedError } from '../errors/index.js'

const register = async (req, res) => {

    console.log('register call in authController', req.body);

    const { name, email, password, role, rememberMe } = req.body;

    console.log('remMe :: authController', rememberMe);

    if (!name || !email || !password) {
        throw new BadRequestError('please provide all required values')
    }

    const userAlreadyExists = await User.findOne({ email });
    if (userAlreadyExists) {
        throw new BadRequestError('Email already registered');
    }

    const user = await User.create({ name, email, password, role });

    const token = user.createJWT();

    res.status(StatusCodes.CREATED).json({
        user: {
            name: user.name,
            email: user.email,
            role: user.role,
        },
        token,
        rememberMe
    });
}

const login = async (req, res) => {
    const { email, password, role, rememberMe } = req.body;

    if (!email || !password) {
        throw new BadRequestError('Please Provide all values')
    }

    const user = await User.findOne({ email, role }).select('+password');

    if (!user) {
        console.log('user not found');
        throw new UnAuthenticatedError('Invalid Credentials');
    }

    const isPasswordCorrect = await user.comparePassword(password)

    if (!isPasswordCorrect) {
        console.log('incorrect password');
        throw new UnAuthenticatedError('Invalid Credentials')
    }

    const token = user.createJWT();

    user.password = undefined;
    res.status(StatusCodes.OK).json({ user, token, rememberMe })
}

export { register, login }