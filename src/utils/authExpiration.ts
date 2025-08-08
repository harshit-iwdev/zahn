import { toast } from "react-toastify";
import { store } from "@/redux/store";
import { setIsAuthenticated } from "@/reduxSlice/userSlice";

export const handleTokenExpiration = () => {
  localStorage.removeItem("access_token");
  store.dispatch(setIsAuthenticated(false));
  toast.error("Your session has expired, please Login again ");

  window.location.href = "/login";
};
