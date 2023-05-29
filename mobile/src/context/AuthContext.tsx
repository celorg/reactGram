import React, { createContext ,useState,useEffect} from 'react';

import { api } from '../utils/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type AuthProps = {
    user: IUserProps | null,
    authenticated: boolean,
    error: string | null,
    loadingAuth: boolean,
    loading: boolean,
    authLogin: (credentials: LoginProps) => Promise<void>,
    authRegister: (credentils: RegisterProps) => Promise<void>,
    signOut: () => Promise<void>,
}

export type IUserProps = {
    _id: string;
    name: string;
    email: string
}

export const AuthContext = createContext<AuthProps>({} as AuthProps);

type ProviderProps = {
    children: React.ReactNode
}

type LoginProps = {
    email: string;
    password: string;
}

type RegisterProps = {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
}

export const AuthProvider = ({children}: ProviderProps) => {

    const [user, setUser] = useState<IUserProps | null>({} as IUserProps);
    const [authenticated, setAuthenticated] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [loadingAuth, setLoadingAuth] = useState(false);

    // Loading para o carregamento da tela
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        const getProfile = async() => {

            const token = await AsyncStorage.getItem("@native.token");

            if(token){

                api.defaults.headers.common["Authorization"] = `Bearer ${token}`

                try{
                    const response = await api.get("/users/profile")
                        .then((res) => res.data);

                    if(response._id){
                        const { _id,name,email } = response;

                        setUser({
                            _id,
                            name,
                            email
                        })

                        setAuthenticated(true);

                        
                    }
                    
                }catch(err){
                    signOut();
                }
                
            }

            setLoading(false);
            
        }

        getProfile();

    }, [])


    const authLogin = async({email, password}: LoginProps) => {

        setError('');
        setLoadingAuth(true);

        try{
            const res = await api.post("/users/login", {
                email, 
                password
            
            }).then((res) => {
                return res.data
            })

            if(res.token){
                const { token, _id, name } = res
    
                setUser({
                    _id,
                    name,
                    email
                })
    
                setAuthenticated(true);
    
                await AsyncStorage.setItem("@native.token", token);
    
                api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                
            }

        
        }catch(err: any){
            console.log(err)
            setError(err.response?.data.errors[0]);
            // setLoadingAuth(false);
            // setError(err.response.data?.errors[0])
        }

        setLoadingAuth(false);
    }

    const authRegister = async({name,email,password,confirmPassword}: RegisterProps) => {

        setError('');
        setLoadingAuth(true);

        try{
            const response = await api.post("/users/register", {
                name,email,password,confirmPassword
            
            }).then((res) => res.data)
                
                
            if(response.token){
                const { _id,token } = response;
    
                setUser({
                    _id: _id,
                    name: name,
                    email: email
                })
    
                setAuthenticated(true);
    
                await AsyncStorage.setItem("@native.token", token);
    
                api.defaults.headers.common["Authorization"] = `Bearer ${token}`
            }
        
        }catch(err: any){
            console.log(err)
            setError(err.response?.data.errors[0])
        }

        setLoadingAuth(false)
        
    }

    const signOut = async() => {
        await AsyncStorage.clear().then(() => {
            setUser(null);
            setAuthenticated(false);
        })
    }

    return (
        <AuthContext.Provider value={{user, authenticated, error, loading, loadingAuth , authLogin, authRegister, signOut }} >
            {children}
        </AuthContext.Provider>
    )

}