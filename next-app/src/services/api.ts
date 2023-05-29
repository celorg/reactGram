import { signOut } from '@/contexts/AuthContext';
import axios,{AxiosError} from 'axios';
import { parseCookies } from 'nookies'

export function setupAPIClient(context = undefined){

    let cookies = parseCookies(context);

    const api =  axios.create({
        baseURL: "http://localhost:5000",
        headers: {
            Authorization: `Bearer ${cookies['@react.token']}`
        }
    })

    api.interceptors.response.use(response => {
        return response;
    }, (error: AxiosError) => {
        if(error.response?.status === 401){

            if(typeof window !== undefined){
                // Deslogar
                signOut()
                

            }else{
                return Promise.reject(error)
            }
        }
        return Promise.reject(error);
    })

    return api

}