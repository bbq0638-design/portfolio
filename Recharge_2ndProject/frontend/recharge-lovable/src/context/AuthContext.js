import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

export function AuthProvider({children}) {
    const [isLogin, setIsLogin] = useState(false);
    const [userId, setUserId] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(()=> {
        const checkLogin = async () =>{
            try{
                const res= await axios.get("/recharge/api/users/check",{
                    withCredentials: true
                });
                setIsLogin(true);
                setUserId(res.data.userId);
            } catch(error) {
                setIsLogin(false);
                setUserId('');
            } finally{
                setIsLoading(false);
            }
        };
        checkLogin();
    }, []);

    const login = (userId) => {
        setIsLogin(true);
        setUserId(userId);
    };

    const logout = async (navigate) => {
        try{
            await axios.post("/recharge/api/users/logout", {},{
                withCredentials:true
            });
            setIsLogin(false);
            setUserId('');
            navigate('/');
        }catch (error){
            console.error("로그아웃 실패:", error);
            alert("로그아웃에 실패했습니다.");
        }
    };
    return(
        <AuthContext.Provider value={{isLogin, userId, isLoading, logout, login}}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () =>useContext(AuthContext);