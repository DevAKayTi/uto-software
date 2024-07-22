import { Loading } from "./Loading";

interface ButtonProp {
  isLoading?: boolean;
  text: string;
  color?: string;
  hover?: string;
  style?: string;
  disable?: boolean;
  onhandleClick?: () => void | undefined;
}

export const Button = (props: ButtonProp) => {
  const {
    isLoading = false,
    style,
    text,
    color = "",
    hover = "",
    disable = false,
    onhandleClick,
  } = props;

  const className = style
    ? style
    : `mb-3 ml-3 flex items-center rounded-lg  px-3 py-2 text-white transition-colors duration-300 ${color} ${hover} ${
        disable || isLoading ? "cursor-not-allowed" : "cursor-pointer"
      }`;
  return (
    <button
      type="button"
      onClick={onhandleClick}
      className={className}
      disabled={disable}
    >
      <span className="tracking-wide">{text}</span>
      {isLoading && <Loading width="w-4" height="h-4" />}
    </button>
  );
};
