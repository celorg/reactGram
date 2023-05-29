import React, {ButtonHTMLAttributes, InputHTMLAttributes} from "react";

// css
import styles from './styles.module.css';

// Iconst
import { FaSpinner } from 'react-icons/fa';

interface InputProps extends InputHTMLAttributes<HTMLInputElement>{}

export function InputForm({...res}:InputProps){
    return(
        <input
            className={styles.input}
            {...res}
        />
    )
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>{
    children: React.ReactNode,
    loading: boolean
}

export function ButtonForm({children, loading}: ButtonProps){
    return (
        <button
            className={styles.button}
            disabled={loading}
        >
            {loading ? (
                <FaSpinner color="#fff" size={16} className={styles.svg}  />
            ) : (
                <a>
                    {children}
                </a>
            )} 
        </button>
    )
}