import { ValidationChain } from 'express-validator';
declare class AuthValidation {
    login(): ValidationChain[];
}
export default AuthValidation;
