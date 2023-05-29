import { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import { ParsedUrlQuery } from "querystring";
import { parseCookies,destroyCookie } from 'nookies';
import { AuthTokenError } from "@/services/erros/AuthTokenError";


export function canSSRauth<P extends ParsedUrlQuery>(fn: GetServerSideProps<P>){

    return async(ctx: GetServerSidePropsContext): Promise<GetServerSidePropsResult<P> | void> => {

        const cookies = parseCookies(ctx);

        if(!cookies['@react.token']){
            return {
                redirect: {
                    destination: '/',
                    permanent: false
                }
            }
        }

        try{
            return await fn(ctx)
        
        }catch(err){
            if(err instanceof AuthTokenError){
                destroyCookie(undefined, "@react.token");

                return {
                    redirect: {
                        destination: "/",
                        permanent: false
                    }
                }
            }
        }

    }

}