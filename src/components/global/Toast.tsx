import { ToastContainer, Zoom } from "react-toastify";

export const Toast = () => {
  return <ToastContainer autoClose={2000} transition={Zoom} />;
};
export default Toast;
