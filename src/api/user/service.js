import crypto from 'crypto';

export const generateEmailVerificationToken = () => {
    const buffer = crypto.randomBytes(16); 
    return buffer.toString('hex'); 
};

