import { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import { ParsedUrlQuery } from "querystring";
import { parseCookies } from 'nookies'


export function canSSRguest<P extends ParsedUrlQuery>(fn: GetServerSideProps<P>){

    return async (ctx: GetServerSidePropsContext): Promise<GetServerSidePropsResult<P>> => {

        const cookie = parseCookies(ctx);

        if(cookie['@react.token']){
            return {
                redirect: {
                    destination: "/dashboard",
                    permanent: false
                }
            }
        }

        return await fn(ctx);

    }

}