import { StatusCodes } from "http-status-codes";

const errorHandlerMiddleware = (err, req, res, next) => {

    console.log(err)

    const defaultError = {
        statusCodes: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
        msg: err.message || 'Something Went Wrong, try again later'
    }

    // Required Field error if not provided
    if (err.name === 'ValidationError') {
        defaultError.statusCodes = StatusCodes.BAD_REQUEST;
        defaultError.msg = Object.values(err.errors).map((error) => error.message).join(',')
        // defaultError.msg = err.message;
    }

    // Unique Field Error, later was also handed within the conroller
    if (err.code && err.code === 11000) {
        defaultError.statusCodes = StatusCodes.BAD_REQUEST,
            defaultError.msg = `${Object.keys(err.keyValue)} field has to be unique`
    }

    // res.status(defaultError.statusCodes).json({ msg: err });
    res.status(defaultError.statusCodes).json({ msg: defaultError.msg });
}

export default errorHandlerMiddleware;


/*

DEMO FOR Object.values() METHOD

const object1 {
    a: 'somestring',
    b: 42,
    c: false
};

console.log(Object.values(object1));
// expected output: Array ("somestring", 42, false)

-------------------------------------------------------

DEMO FOR Object.keys() METHOD

const object1 {
    a: 'somestring',
    b: 42,
    c: false
};

console.log(Object.keys(object1));
// expected output: Array (a, b, c)
*/