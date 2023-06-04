import User from "../models/User.js";
import { StatusCodes } from "http-status-codes";
import { BadRequestError, UnAuthenticatedError } from '../errors/index.js'

const register = async (req, res) => {

    console.log('register call in authController', req.body);

    const { name, email, password, role, shop } = req.body;


    if (!name || !email || !password) {
        throw new BadRequestError('please provide all required values')
    }

    const userAlreadyExists = await User.findOne({ email });
    if (userAlreadyExists) {
        throw new BadRequestError('Email already registered');
    }

    const user = await User.create({ name, email, password, role, shop });

    const token = user.createJWT();

    res.status(StatusCodes.CREATED).json({
        user: {
            name: user.name,
            email: user.email,
            role: user.role,
            shop: user.shop
        },
        token
    });
}

const login = async (req, res) => {
    console.log(req.body)
    const { email, password, role } = req.body;

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
    res.status(StatusCodes.OK).json({ user, token })
}

export { register, login }