import Link from 'next/link';
import type { ReactNode, ButtonHTMLAttributes, SyntheticEvent } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    children: ReactNode;
    className?: string;
    href?: string;
    color: "primary" | "secondary"
    onClick?: (e?:SyntheticEvent) => void;
}

const Button = ({children, color, className, href, onClick, ...props}: ButtonProps) => {
    
    const defaultClassName = "transition-colors duration-300 w-full px-5 py-2.5 text-lg rounded-full flex items-center justify-center gap-2 disabled:opacity-80";

    if (!href) return (
        <button {...props} onClick={onClick} className={`${defaultClassName} ${color === "primary" ? "bg-primary hover:bg-primary-100" : "border-2 border-white hover:border-primary-100 text-white hover:text-primary-100"} ${className ? className : ""}`}>
            {children}
        </button>
    );
    return (
        <Link href={href} onClick={onClick} className={`${defaultClassName} ${color === "primary" ? "bg-primary hover:bg-primary-100" : "border-2 border-white hover:border-primary-100 text-white hover:text-primary-100"} ${className ? className : ""}`}>
            {children}
        </Link>
    );
}

export default Button;
