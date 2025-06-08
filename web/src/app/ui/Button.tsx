import React from "react";

type ButtonSize = "small" | "medium" | "large";
type ButtonVariant = "primary" | "secondary" | "normal";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    size?: ButtonSize;
    variant?: ButtonVariant;
    onClick?: React.MouseEventHandler<HTMLButtonElement>;
    href?: string;
    children: React.ReactNode;
}

const sizeClasses: Record<ButtonSize, string> = {
    small: "px-3 py-1 text-sm",
    medium: "px-4 py-2 text-base",
    large: "px-6 py-3 text-lg",
};

const variantClasses: Record<ButtonVariant, string> = {
    primary: "bg-blue-600 text-white hover:bg-blue-700",
    secondary: "bg-gray-200 text-white hover:bg-gray-300",
    normal: "bg-white text-gray-900 border border-gray-300 hover:bg-gray-100",
};

export const Button = React.forwardRef<
    HTMLButtonElement | HTMLAnchorElement,
    ButtonProps
>(
    (
        {
            size = "medium",
            variant = "normal",
            onClick,
            href,
            className: customClassName = "",
            children,
            ...rest
        },
        ref
    ) => {
        const className = `
            inline-flex items-center justify-center rounded
            ${sizeClasses[size]}
            ${variantClasses[variant]}
            transition-colors duration-150
            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
            disabled:opacity-50 disabled:cursor-not-allowed
            ${customClassName}
        `;

        if (href) {
            return (
                <a
                    href={href}
                    className={className}
                    ref={ref as React.Ref<HTMLAnchorElement>}
                    role="button"
                    tabIndex={0}
                    {...(rest as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
                >
                    {children}
                </a>
            );
        }

        return (
            <button
                type={rest.type || "button"}
                className={className}
                onClick={onClick}
                ref={ref as React.Ref<HTMLButtonElement>}
                {...rest}
            >
                {children}
            </button>
        );
    }
);
Button.displayName = "Button";