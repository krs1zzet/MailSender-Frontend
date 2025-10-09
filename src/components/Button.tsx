type Props = React.ButtonHTMLAttributes<HTMLButtonElement>;
  
  export default function Button({  className = "", ...rest }: Props) {
    return (
      <div className="md:hidden">
        <button
          {...rest}                      // onClick dahil tüm button prop'ları gelir
          className={"p-2 " + className} // ek class eklenebilir
          aria-label={rest["aria-label"] ?? "Open menu"}
        >
        </button>
      </div>
    );
  }
  