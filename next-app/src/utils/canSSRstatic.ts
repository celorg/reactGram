import { GetServerSidePropsContext, GetStaticProps, GetStaticPropsContext, GetStaticPropsResult, NextApiRequest, NextPageContext } from "next";
import { ParsedUrlQuery } from "querystring";
import { destroyCookie, parseCookies } from "nookies";
import { AuthTokenError } from "@/services/erros/AuthTokenError";
import { NextApiRequestCookies } from "next/dist/server/api-utils";
import { IncomingMessage } from "http";


export function canSSRstatic<P extends ParsedUrlQuery>(fn: GetStaticProps<P>){

    return async(ctx: GetStaticPropsContext, req: NextApiRequestCookies): Promise<GetStaticPropsResult<P> | void> => {

        const cookies = parseCookies(req);

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