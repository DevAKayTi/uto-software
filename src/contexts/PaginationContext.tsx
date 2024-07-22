import { createContext,useContext, useMemo, useState } from "react";

interface PaginationContextProps {
    skip: number;
    current: number;
    itemsPerPage: number;
    setCurrent: React.Dispatch<React.SetStateAction<number>>;
}

interface PaginationProviderProps{
    children: React.ReactElement;
}

const PaginationContext = createContext({} as PaginationContextProps);

export const PaginationProvider = (props: PaginationProviderProps) => {
    const {children} = props;

    const [current,setCurrent] = useState<number>(1);
    const [itemsPerPage] = useState<number>(20);

    const skip = useMemo(()=>{
        return (current * itemsPerPage) - itemsPerPage
    },[current])
    
    const context: PaginationContextProps = {
        skip,
        current,
        itemsPerPage,
        setCurrent
    }

    return (
        <PaginationContext.Provider value={context}>{children}</PaginationContext.Provider>
    )
};

export const usePagination = () => {
    const context = useContext(PaginationContext);

    if(context == undefined) {
        throw new Error ("usePagination must be used within a PaginationProvier");
    }

    return {
        ...context,
    };
};