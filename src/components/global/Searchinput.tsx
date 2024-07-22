import { Dropdownfilter } from "./Dropdownfilter";

interface inputProps {
  currentPage?: string;
}

export const Searchinput = (props: inputProps) => {
  const { currentPage } = props;

  return (
    <div className="my-auto">
      {currentPage !== "/cart" ? (
        <div className="hidden rounded-xl bg-white md:flex md:items-center">
          <Dropdownfilter currentPage={currentPage} />
        </div>
      ) : null}
    </div>
  );
};
