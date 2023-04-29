import {Router, Request, Response} from 'express';
import {body, validationResult} from "express-validator";
import * as contactController from "../../controller/contacts/contactController";
import {formValidationMiddleware} from "../../middlewares/formValidationMiddleware";
import {authMiddleware} from "../../middlewares/authMiddleware";

const contactRouter: Router = Router();

/**
 @usage : create a contact
 @method : POST
 @body : name, imageUrl, email, mobile, company, title, groupId
 @access : PRIVATE
 @url : http://localhost:9000/contacts/
 */
contactRouter.post("/", [
    body('name').not().isEmpty().withMessage("Name is Required"),
    body('imageUrl').not().isEmpty().withMessage("ImageUrl is Required"),
    body('email').not().isEmpty().withMessage("Email is Required"),
    body('mobile').not().isEmpty().withMessage("Mobile is Required"),
    body('company').not().isEmpty().withMessage("Company is Required"),
    body('title').not().isEmpty().withMessage("Title is Required"),
    body('groupId').not().isEmpty().withMessage("GroupId is Required"),
], formValidationMiddleware, authMiddleware, async (request: Request, response: Response) => {
    return await contactController.createContact(request, response);
})

/**
 @usage : to get all contacts
 @method : GET
 @body : no-params
 @access : PRIVATE
 @url : http://localhost:9000/contacts
 */
contactRouter.get("/", authMiddleware, async (request: Request, response: Response) => {
    return await contactController.getAllContacts(request, response);
})

/**
 @usage : get a contact
 @method : GET
 @body : no-params
 @access : PRIVATE
 @url : http://localhost:9000/contacts/:contactId
 */
contactRouter.get("/:contactId", authMiddleware, async (request: Request, response: Response) => {
    return await contactController.getContact(request, response);
})

/**
 @usage : update a contact
 @method : PUT
 @access : PRIVATE
 @body : name, imageUrl, email, mobile, company, title, groupId
 @url : http://localhost:9999/contacts/:contactId
 */
contactRouter.put("/:contactId", [
    body('name').not().isEmpty().withMessage("Name is Required"),
    body('imageUrl').not().isEmpty().withMessage("ImageUrl is Required"),
    body('email').not().isEmpty().withMessage("Email is Required"),
    body('mobile').not().isEmpty().withMessage("Mobile is Required"),
    body('company').not().isEmpty().withMessage("Company is Required"),
    body('title').not().isEmpty().withMessage("Title is Required"),
    body('groupId').not().isEmpty().withMessage("GroupId is Required"),
], formValidationMiddleware, authMiddleware, async (request: Request, response: Response) => {
    return await contactController.updateContact(request, response);
})


/**
 @usage : delete a contact
 @method : DELETE
 @access : PRIVATE
 @body : no-params
 @url : http://localhost:9999/contacts/:contactId
 */
contactRouter.delete("/:contactId", authMiddleware, async (request: Request, response: Response) => {
    return await contactController.deleteContact(request, response);
})

export default contactRouter;