import { createContext, useCallback, useEffect, useState } from "react";
import { baseUrl, postRequest } from "../utils/services";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [registerError, setRegisterError] = useState(null);
    const [isRegisterLoading, setIsRegisterLoading] = useState(false);
    const [registrerInfo, setRegistrerInfo] = useState({
        name: "",
        email: "",
        password: "",
    });
    const [loginError, setLoginError] = useState(null);
    const [isLoginLoading, setIsLoginLoading] = useState(false);
    const [loginInfo, setLoginInfo] = useState({
        email: "",
        password: "",
    });
    console.log("User", user);
    console.log("loginInfo", loginInfo);

useEffect(()=>{
    const user = localStorage.getItem("User");
    setUser(JSON.parse(user));
},[]);

    const updateRegistrerInfo = useCallback((info) => {
        setRegistrerInfo(info);
    }, []);
    const updateLoginInfo = useCallback((info) => {
        setLoginInfo(info);
    }, []);

    const registerUser = useCallback(async (e) => {
        e.preventDefault();
        setIsRegisterLoading(true);
        setRegisterError(null);

        const response = await postRequest(
            `${baseUrl}/users/register`,
            JSON.stringify(registrerInfo)
        );
        
        setIsRegisterLoading(false);
        
        if (response.error) {
            return setRegisterError(response);
        }

        localStorage.setItem("user", JSON.stringify(response));
        setUser(response);
    }, [registrerInfo]);


    const logoutUser = useCallback(()=>{
        localStorage.removeItem("User");
        setUser(null);
    }, []);

    const loginUser = useCallback(async(e)=>{
        e.preventDefault()
        setIsLoginLoading(true)
        setLoginError(null)
        const response = await postRequest(
            `${baseUrl}/users/login`,
            JSON.stringify(loginInfo)
        );
        setIsLoginLoading(false)

        if(response.error){
            return setLoginError(response)
        }
        localStorage.setItem("User", JSON.stringify(response))
        setUser(response);
       
    }, [loginInfo]);

    return (
        <AuthContext.Provider
            value={{
                user,
                registrerInfo,
                updateRegistrerInfo,
                registerUser,
                registerError,
                logoutUser,
                loginError,
                loginUser,
                loginInfo, 
                updateLoginInfo, 
                isLoginLoading ,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};
