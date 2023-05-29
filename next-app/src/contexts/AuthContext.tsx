import { api } from "@/services/apiClient";
import { createContext, useState, ReactNode, useEffect } from "react";
import Router from "next/router";

import {toast} from 'react-toastify';

import {setCookie, parseCookies, destroyCookie} from 'nookies';

type AuthContextProps = {
    isAuthenticated: boolean,
    user: UserProps,
    loadingAuth: boolean,
    authLogin: (credentials: LoginProps) => Promise<void>,
    authRegiste: (credentials: RegisterProps) => Promise<void>,
    authLogout: () => void;
}

type UserProps = {
    _id: string,
    name: string,
    email: string
}

type LoginProps = {
    email: string,
    password: string
}

type RegisterProps = {
    name: string,
    email: string,
    password: string,
    confirmPassword: string
}

export const AuthContext = createContext({} as AuthContextProps);

type AuthProps = {
    children: ReactNode
}

export const signOut = async() => {

    try{

        destroyCookie(undefined, "@react.token");

        await Router.push('/');

    }catch{
        toast.warning("Erro ao deslogar")
    }

}


export function AuthProvider({children}: AuthProps){

    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loadingAuth, setLoadingAuth] = useState(false);
    const [user, setUser] = useState<UserProps>({
        _id: '',
        name: '',
        email: ''
    });

    useEffect(() => {

        const { "@react.token": token } = parseCookies();

        if(token){

            api.get("/api/users/profile")
                .then((res) => {
                    let {_id, name, email} = res.data;

                    setUser({
                        _id,
                        name,
                        email
                    })
                    setIsAuthenticated(true);

                }).catch(() => {
                    setIsAuthenticated(false);
                    setUser({
                        _id: '',
                        name: '',
                        email: ''
                    })
                    signOut();
                })

        }else{
            setIsAuthenticated(false);
            setUser({
                _id: '',
                name: '',
                email: ''
            })
        }


    },[])

    const authLogin = async({email,password}: LoginProps) => {

        setLoadingAuth(true);

        try{
            const response = await api.post("/api/users/login", {
                email,
                password
            }).then((res) => {
                return res.data;
            })

            const {_id, name, token} = response;

            setCookie(undefined, "@react.token", token, {
                maxAge: 60 * 60 * 24 * 30,
                path: '/'
            })

            setUser({
                _id,
                name,
                email
            });

            toast.success("Você está autenticado")

            api.defaults.headers["Authorization"] = `Bearer ${token}`

            await Router.push("/dashboard");

            setIsAuthenticated(true);
             
            // console.log(response);
        }catch(err: any){
            console.log(err)
            toast.error(err.response.data.errors[0])
            
        }

        setLoadingAuth(false)

    }

    const authRegiste = async({name,email,password,confirmPassword}: RegisterProps) => {

        setLoadingAuth(true)

        try{

            const response = await api.post("/api/users/register", {
                name,
                email,
                password,
                confirmPassword
            }).then((res) => res.data);

            const {_id, token} = response; 

            setCookie(undefined, '@react.token', token, {
                maxAge: 60 * 60 * 24 * 30,
                path: '/'
            });

            setUser({
                _id,
                name,
                email
            });

            toast.success("Cadastro realizado com sucesso!");

            api.defaults.headers["Authorization"] = `Bearer ${token}`;

            await Router.push("/dashboard");
            
            setIsAuthenticated(true);

        }catch(err: any){
            console.log(err);
            toast.error(err.response.data.errors[0])
        }

        setLoadingAuth(false)
    }

    const authLogout = () => {

        signOut();

        setIsAuthenticated(false);

        setUser({
            _id: '',
            name: '',
            email: ''
        })

    }

    return (

        <AuthContext.Provider value={{isAuthenticated, user, authLogin, loadingAuth, authRegiste, authLogout}}>
            {children}
        </AuthContext.Provider>

    )
}