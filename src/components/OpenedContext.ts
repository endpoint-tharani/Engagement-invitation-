import { createContext, useContext } from "react";

/** True once the guest has opened the invitation. */
export const OpenedContext = createContext(false);
export const useOpened = () => useContext(OpenedContext);
