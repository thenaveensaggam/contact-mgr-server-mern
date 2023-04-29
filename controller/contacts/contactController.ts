import {Request, Response} from "express";
import ContactTable from "../../database/schemas/contactSchema";
import {IContact} from "../../database/models/IContact";
import mongoose from "mongoose";
import {getAuthUserInfoFromRequestHeader} from "../../util/UserUtil";

/**
 @usage : create a contact
 @method : POST
 @access : PRIVATE
 @body : name, imageUrl, email, mobile, company, title, groupId
 @url : http://localhost:9000/contacts/
 */
export const createContact = async (request: Request, response: Response) => {
    try {
        const user = await getAuthUserInfoFromRequestHeader(request, response);
        if (user) {
            const mongoUserId = new mongoose.Types.ObjectId(user._id);
            const {name, imageUrl, email, mobile, company, title, groupId} = request.body;
            // check if the mobile number is exists
            const contact = await ContactTable.findOne({mobile: mobile});
            if (contact) {
                return response.status(401).json({msg: "Contact is exist with the mobile number"});
            }
            const newContact: IContact = {
                name: name,
                user: mongoUserId,
                imageUrl: imageUrl,
                email: email,
                mobile: mobile,
                company: company,
                title: title,
                groupId: groupId
            };
            const createdContact = await new ContactTable(newContact).save(); // INSERT
            if (createdContact) {
                return response.status(201).json(createdContact);
            }
        }
    } catch (error: any) {
        return response.status(500).json({errors: [error.message]});
    }
};

/**
 @usage : to get all contacts
 @method : GET
 @body : no-params
 @access : PRIVATE
 @url : http://localhost:9000/contacts
 */
export const getAllContacts = async (request: Request, response: Response) => {
    try {
        const user = await getAuthUserInfoFromRequestHeader(request, response);
        if (user) {
            const mongoUserId = new mongoose.Types.ObjectId(user._id);
            const contacts: IContact[] = await ContactTable.find({user: mongoUserId}).sort({createdAt: "desc"});
            return response.status(200).json(contacts);
        }
    } catch (error: any) {
        return response.status(500).json({errors: [error.message]});
    }
};

/**
 @usage : get a contact
 @method : GET
 @body : no-params
 @access : PRIVATE
 @url : http://localhost:9000/contacts/:contactId
 */
export const getContact = async (request: Request, response: Response) => {
    try {
        const user = await getAuthUserInfoFromRequestHeader(request, response);
        if (user) {
            const {contactId} = request.params;
            if (contactId) {
                const mongoContactId = new mongoose.Types.ObjectId(contactId);
                const mongoUserId = new mongoose.Types.ObjectId(user._id);
                const contact = await ContactTable.findOne({_id: mongoContactId, user: mongoUserId});
                if (!contact) {
                    return response.status(404).json({msg: "The Contact is not found!"});
                }
                return response.status(200).json(contact);
            }
        }
    } catch (error: any) {
        return response.status(500).json({errors: [error.message]});
    }
};

/**
 @usage : update a contact
 @method : PUT
 @access : PRIVATE
 @body : name, imageUrl, email, mobile, company, title, groupId
 @url : http://localhost:9000/contacts/:contactId
 */
export const updateContact = async (request: Request, response: Response) => {
    try {
        const user = await getAuthUserInfoFromRequestHeader(request, response);
        if (user) {
            const {name, imageUrl, email, mobile, company, title, groupId} = request.body;
            const {contactId} = request.params;
            if (contactId) {
                const mongoContactId = new mongoose.Types.ObjectId(contactId);
                const mongoUserId = new mongoose.Types.ObjectId(user._id);
                // check if the contact is exists
                const contact = await ContactTable.findOne({_id: mongoContactId, user: mongoUserId});
                if (!contact) {
                    return response.status(404).json({msg: "Contact is not found to update"});
                }
                const newContact: IContact = {
                    name: name,
                    user: mongoUserId,
                    imageUrl: imageUrl,
                    email: email,
                    mobile: mobile,
                    company: company,
                    title: title,
                    groupId: groupId
                };
                const updatedContact = await ContactTable.findByIdAndUpdate(mongoContactId, {
                    $set: newContact
                }, {new: true});
                if (updatedContact) {
                    return response.status(200).json(updatedContact);
                }
            }
        }
    } catch (error: any) {
        return response.status(500).json({errors: [error.message]});
    }
};

/**
 @usage : delete a contact
 @method : DELETE
 @body : no-params
 @access : PRIVATE
 @url : http://localhost:9999/contacts/:contactId
 */
export const deleteContact = async (request: Request, response: Response) => {
    try {
        const user = await getAuthUserInfoFromRequestHeader(request, response);
        if (user) {
            const {contactId} = request.params;
            if (contactId) {
                const mongoContactId = new mongoose.Types.ObjectId(contactId);
                const mongoUserId = new mongoose.Types.ObjectId(user._id);
                const contact = await ContactTable.findOne({_id: mongoContactId, user: mongoUserId});
                if (!contact) {
                    return response.status(404).json({msg: "The Contact is not found!"});
                }
                // delete the contact
                const deletedContact = await ContactTable.findByIdAndDelete(mongoContactId);
                if (deletedContact) {
                    return response.status(200).json({});
                }
            }
        }
    } catch (error: any) {
        return response.status(500).json({errors: [error.message]});
    }
};