import React, { createContext, useContext, useState, useEffect } from "react";

interface ToastProps {
  message: string;
  type: string;
}

interface ToastContextProps {
  toastList: ToastProps[];
  onShowToast: (message: string, type: string) => void;
  deleteToast: (id: number | undefined) => void;
}

interface ToastProviderProps {
  children: React.ReactElement;
}
const ToastContext = createContext({} as ToastContextProps);
export const ToastProvider = (props: ToastProviderProps) => {
  const { children } = props;
  const [toastList, setToastList] = useState<ToastProps[]>([]);

  const onShowToast = (message: string, type: string) => {
    const toast = {
      message,
      type,
    };
    setToastList([...toastList, toast]);
  };

  const deleteToast = (id: number | undefined) => {
    //   const updatedList = toastList.filter((toast) => toast?.id !== id);
    const updatedList = toastList.filter((item, idx) => {
      idx !== id;
    });
    setToastList(updatedList);
  };

  useEffect(() => {
    const timer =
      toastList.length > 0 &&
      setTimeout(() => {
        deleteToast(toastList.length - 1);
      }, 2000);

    return () => {
      timer && clearTimeout(timer);
    };
  }, [toastList]);

  const context: ToastContextProps = {
    toastList,
    onShowToast,
    deleteToast,
  };

  return (
    <ToastContext.Provider value={context}>{children}</ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error("useProduct must be used within a Receipt Provider");
  }
  return {
    ...context,
  };
};
