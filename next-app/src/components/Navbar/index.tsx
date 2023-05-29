import React,{FormEvent, useContext, useState} from 'react';
import styles from './styles.module.css';

import Link from 'next/link';
import { useRouter } from 'next/router';

import { useSearchParams } from 'next/navigation'

// Icons
import {BsSearch,BsHouseDoorFill,BsFillCameraFill,BsFillPersonFill} from 'react-icons/bs';

// Context
import { AuthContext } from '@/contexts/AuthContext';


interface IAppProps {
    auth: boolean,
    user: UserProps,
    authOut: () => void
}

type UserProps = {
    _id: string,
    name: string,
    email: string
}

export default function Navbar () {

    const { isAuthenticated:auth ,user, authLogout} = useContext(AuthContext);

    const router = useRouter()

    const paramsString = "q=";
    const searchParams = new URLSearchParams(paramsString);

    const [query, setQuery] = useState('');

    const handleQuery = (e: FormEvent) => {
        e.preventDefault();

        if(!query){
            return;
        }

        router.push(`/search?q=${query}`)
    }

  return (
    <nav className={styles.nav}>
        <Link href="/dashboard" className={styles.logo} >ReactGram</Link>
        {auth && (
            <form onSubmit={handleQuery} className={styles.search_form} >
                <BsSearch />
                <input type="text" placeholder="Pesquisar" onChange={e => setQuery(e.target.value)} value={query} />
            </form>
        )}
        
        <ul className={styles.nav_links}>
            {auth ? (
                <>
                    <li>
                        <Link href="/" >
                            <BsHouseDoorFill />
                        </Link>
                    </li>
                    {user &&
                        <li>
                            <Link href={`/users/${user._id}`}>
                                <BsFillCameraFill />
                            </Link>
                        </li>
                    }
                    <li>
                        <Link href="/profile">
                            <BsFillPersonFill />
                        </Link>
                    </li>
                    <li>
                        <span onClick={() => authLogout()}>Sair</span>
                    </li>
                </>
            ) :(
                <>
                    <li>
                        <Link href="/" >
                            Entrar
                        </Link>
                    </li>
                    <li>
                        <Link href="/register">
                            Cadastrar
                        </Link>
                    </li>
                </>
            )}
            
            
        </ul>
    </nav>
  );
}
