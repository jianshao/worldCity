import React, { createContext, useContext, useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";
import { getToken } from "@/utils/tokenStorage";
import { useRouter } from "expo-router";
import { checkLogin, UserInfo } from "@/lib/user";

interface AuthContextProps {
  user: UserInfo | null;
  loaded: boolean;
  setUser: (user: UserInfo | null) => void;
  setReflesh: (arg: boolean) => void;
}

const AuthContext = createContext<AuthContextProps>({
  user: null,
  loaded: false,
  setUser: () => {},
  setReflesh: (boolean) => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const [user, setUser] = useState<UserInfo | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [reflesh, setReflesh] = useState(false);

  useEffect(() => {
    try {
      getToken().then((token) => {
        if (token) {
          checkLogin().then((res) => {
            console.log("get profile: ", res);
            setUser({ ...res });
          });
        } else {
          router.push("/auth/login");
        }
      });
    } catch (err) {
      console.warn("登录校验失败", err);
      setUser(null);
      router.push("/auth/login");
    }
    setLoaded(true);
    setReflesh(false);
  }, [reflesh]);

  return (
    <AuthContext.Provider value={{ user, setUser, loaded, setReflesh }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
