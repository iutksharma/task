import config from "../../common/config/envConfig.js";
import UserModel from "../../model/UserProfile.js";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { generateEmailVerificationToken } from "./service.js";
import sendEmailSMTP from "../../utils/email.js";
import { validationResult } from 'express-validator';

/**
 * @method POST
 * @description use to register user
 */
export const register = async (req, res) =>{
    try {
        const {name, email, password} = req.body;
        const profilePicture = req.file ? req.file.path.replace(/\\/g, '/') : null;

        // checking validation using express validator
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).send({ message: errors.errors[0].msg }); 
        }

        //checking user existence
        const existingUser = await UserModel.findOne({email: email});

        if(existingUser){
            return res.status(400).send({
                status: false,
                message: "Email is already exist"
            });
        }

        // encrypting the password
        const hashPassword = await bcrypt.hash(password, 10);

        // generating unique token for email verification
        const uniqueToken = generateEmailVerificationToken();

        // creating a user 
        const user = new UserModel({
            name: name,
            email: email,
            password: hashPassword, 
            profileImagePath: profilePicture,
            emailVerificationToken: uniqueToken
        });

        await user.save();

        // content and data for sending email
        const subject = "Email verification";
        const templateName = "verificationEmail";
        const emailData = {
            userName: name,
            verificationToken: uniqueToken
        }

        // calling email function to send email
        const emailResult = await sendEmailSMTP(user.email, subject, templateName, emailData);

        if(emailResult){
            return res.status(201).send({
                status: true,
                message: "Verification link sent successfully",
            })
        }else{
            return res.status(400).send({
                status: false,
                message: "Verification link failed to sent, try after some time",
            })   
        }

    } catch (error) {
        return res.status(500).send({
            status: false,
            message: error.message
        })
    }
}

/**
 * @method POST
 * @description use to verify email
 */
export const verifyEmail = async (req, res) =>{
    try {
        const {email, token} = req.body;

        // checking validation using express validator
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).send({ message: errors.errors[0].msg }); 
        }

        // checking user exists or not
        const existingUser = await UserModel.findOne({email: email});

        if(!existingUser){
            return res.status(400).send({
                status: false,
                message: "User not found"
            })
        }

        // Checking token expiration
        const tenMinutes = 10 * 60 * 1000; // 10 minutes in milliseconds
        const tokenAge = Date.now() - existingUser.updatedAt.getTime();

        // token matches and token age is valid then email will be verified
        if(existingUser.emailVerificationToken === token && tokenAge < tenMinutes){
            // updating the data in database if token matches
            existingUser.emailVerificationToken = null;
            existingUser.emailVerified = true
            await existingUser.save();

            // content and data for sending email
            const subject = "Welcome to the task";
            const templateName = "welcomeEmail";
            const emailData = {
                userName: existingUser.name,
            }
            // sending welcome mail on verification
            await sendEmailSMTP(existingUser.email, subject, templateName, emailData);

            return res.status(200).send({
                status: true,
                message: "Email verified successfully"
            });
        }else{
            return res.status(400).send({
                status: false,
                message: "Invalid or expired token"
            })
        }
    } catch (error) {
        return res.status(500).send({
            status: false,
            message: error.message
        })
    }
}

/**
 * @method POST
 * @description use to login user
 */
export const login = async (req, res) =>{
    try {
        const {email, password} = req.body;

        // checking validation using express validator
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).send({ message: errors.errors[0].msg }); 
        }
        
        // Find the user by email
        const existingUser = await UserModel.findOne({ email: email });

        // Check if user exists
        if (!existingUser) {
            return res.status(400).send({
                status: false,
                message: "User not found"
            });
        }

        if(existingUser.emailVerified !== true){
            return res.status(400).send({
                status: false,
                message: "Email is not verified"
            })
        }

        // Compare the provided password with the hashed password
        const isPasswordValid = await bcrypt.compare(password, existingUser.password);

        if (!isPasswordValid) {
            return res.status(400).send({
                status: false,
                message: "Invalid password"
            });
        }

        // Generate JWT
        const token = jwt.sign(
            { id: existingUser._id}, 
            config.JWT_SECRET, 
            { expiresIn: '24h' } // Token expiration time
        );

        return res.status(200).send({
            status: true,
            message: "Login successful",
            token: token
        });
    } catch (error) {
        return res.status(500).send({
            status: false,
            message: error.message
        })
    }
}

/**
 * @method GET
 * @description use to get user profile
 */
export const getUserProfile = async (req, res) =>{
    try {
        const userId = req.decoded.id;

        // Find the user by email
        const existingUser = await UserModel.findOne({ _id: userId });

        // Check if user exists
        if (!existingUser) {
            return res.status(400).send({
                status: false,
                message: "User not found"
            });
        }

        return res.status(200).send({
            status: true,
            message: "User profile successfully retrieved",
            data: {
                name: existingUser.name,
                email: existingUser.email,
                profileUrl: existingUser.profileImagePath ? `http://${config.HOST}:${config.PORT}/${existingUser.profileImagePath}` : null
            }
        });
    } catch (error) {
        return res.status(500).send({
            status: false,
            message: error.message
        })
    }
}

