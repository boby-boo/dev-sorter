type ButtonProps = {
    text: string;
    disabled?: boolean;
    onClick?: () => void;
};

const Button = ({ text, disabled, onClick }: ButtonProps) => {
    return (
        <button className="button" disabled={disabled} onClick={onClick}>
            {text}
        </button>
    );
};

export default Button;
