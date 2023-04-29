import {Router, Request, Response} from 'express';
import {body} from "express-validator";
import * as userController from "../../controller/users/userController";
import {formValidationMiddleware} from "../../middlewares/formValidationMiddleware";
import {authMiddleware} from "../../middlewares/authMiddleware";

const userRouter: Router = Router();

/**
 @usage : Register User
 @method : POST
 @body : username , email , password
 @access : PUBLIC
 @url : http://localhost:9999/users/register
 */
userRouter.post("/register", [
    body('username').isLength({min: 4, max: 10}).withMessage("Username is Required"),
    body('email').isEmail().withMessage("Proper Email is Required"),
    body('password').isStrongPassword({minLength: 6}).withMessage("Strong Password is Required")
], formValidationMiddleware, async (request: Request, response: Response) => {
    return await userController.registerUser(request, response);
})

/**
 @usage : Login User
 @method : POST
 @body : email , password
 @access : PUBLIC
 @url : http://localhost:9999/users/login
 */
userRouter.post("/login", [
    body('email').isEmail().withMessage("Proper Email is Required"),
    body('password').isStrongPassword({minLength: 6}).withMessage("Strong Password is Required")
], formValidationMiddleware, async (request: Request, response: Response) => {
    return await userController.loginUser(request, response);
});

/**
 @usage : Get User Info
 @method : GET
 @body : no-body
 @access : PRIVATE
 @url : http://localhost:9999/users/me
 */
userRouter.get("/me", authMiddleware, async (request: Request, response: Response) => {
    return await userController.getUserInfo(request, response);
});

export default userRouter;