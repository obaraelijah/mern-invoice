import { ADMIN, USER } from "../constants/index.js";

const ROLES = {
    User: USER,
    Admin: ADMIN,
};

const checkRole = (...allowedRoles) => {
    return (req, res, next) => {
        
    }
};