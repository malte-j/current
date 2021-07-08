import { verifyToken } from '../routes/auth/authService';


/**
 * Middleware that returns sends a 401 Error if user can't be authenticated
 * @param {Object} req Express request Object
 * @param {Object} res Express response Object
 * @param {Object} next Express next function
 */
export function isAuthenticatedMiddleware(req, res, next) {
  if(!req.headers.authorization)
    return res.status(401).json({ error: "Not Authorized" });

  const user = decodeHeader(req.headers.authorization);

  if(user) {
    req.user = user;
    return next();
  } else {
    return res.status(401).json({ error: "Not Authorized" });
  }
}


/**
 * Middleware that returns sends a 401 Error if user can't be authenticated
 * @param {Object} req Express request Object
 * @param {Object} res Express response Object
 * @param {Object} next Express next function
 */
 export function possibleAuthenticationMiddleware(req, res, next) {
  const user = decodeHeader(req.headers.authorization);

  if(user)
    req.user = user;
  
  return next();
}

/**
 * Returns true or false
 * @param {Object} req Express request object
 */
export function isAdmin(req) {
  if(!req.headers.authorization)
    return res.status(403).json({ error: "Forbidden" });

  const user = decodeHeader(req.headers.authorization);

  if(user) {
    return user.isAdmin === true;
  } else {
    return false;
  }
}

/**
 * Decodes a raw header string and returns a decoded JWT Token
 * @param {string} authorizationHeader Raw value of the authorization header
 */
function decodeHeader(authorizationHeader) {
  if(!authorizationHeader)
    return undefined;
    
  let token = authorizationHeader.split(" ")[1];
  return verifyToken(token);
}