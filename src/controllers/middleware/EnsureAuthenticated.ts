import { Request, Response, NextFunction } from "express";
import { verify } from "jsonwebtoken";


interface IPayload {
    sub: string
}
export function EnsureAuthenticated(request: Request, response: Response, next: NextFunction) {
    const authToken = request.headers.authorization;



    if (!authToken) {
        return response.status(401).json({
            errorCode: "token.invalid",
        })
    }


    //Bearer 83781723823hjh398123812j
    //[1] Bearer 
    //[0] 83781723823hjh398123812j



    const [, token] = authToken.split(" ");

    try {
        const { sub } = verify(token, process.env.JWT_SECRET) as IPayload

        request.user_id = sub

        return next();
    } catch (err) {
        return response.status(401).json({ errorCode: "token.expired" })
    }



}