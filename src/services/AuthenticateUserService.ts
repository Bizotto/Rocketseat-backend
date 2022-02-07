import axios from "axios";
import prismaClient from "../prisma";
import { sign} from "jsonwebtoken"

/*
Receber code(string)
Recuperar o Access_token on github
infos usuario
Verificar se o Usuario existe no banco de dados
se sim gerar token para ele
se nao criar um token novo para o usuario
retornar o tken com as infos do usario

*/

interface IAccessTokenResponse{
    access_token: string;
}
interface IUserResponse{
    avatar_url: string,
    login: string,
    id: number,
    name: string
}

class AuthenticateUserService {
    async execute(code: string) {

        const url = "https://github.com/login/oauth/access_token";

        const { data : accesTokenResponse} = await axios.post<IAccessTokenResponse>(url, null, {
            params: {
                client_id: process.env.GITHUB_CLIENT_ID,
                client_secret: process.env.GITHUB_CLIENT_SECRET,
                code,
            },
            headers :{
            "Accept": "application/json"
        }
        })



        const response = await axios.get<IUserResponse>("https://api.github.com/user",{
            headers: {
                authorization :`Bearer ${accesTokenResponse.access_token}`
            },
        })
        const { login, id, avatar_url, name} = response.data;
       let user = await prismaClient.users.findFirst({
            where: {
                github_id: id

            }
        })
        
        if(!user){
            user = await prismaClient.users.create({
                data:{ 
                    github_id: id,
                    login,
                    avatar_url,
                    name


                }
            })
        }

        const token = sign(
            {
                user:{
                    name: user.name,
                    avatar_url: user.avatar_url,
                    id: user.id
                }
            },
        process.env.JWT_SECRET,
        {
            subject: user.id,
            expiresIn: "1d"
        }
        );

        return { token, user};

    }
}
export { AuthenticateUserService }