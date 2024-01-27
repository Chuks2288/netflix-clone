"use client";

import Input from "@/components/Input"
import axios from "axios";
import { Loader2 } from "lucide-react";
import Image from "next/image"
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import toast from "react-hot-toast";

import { signIn } from "next-auth/react";

import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";

const page = () => {

    const router = useRouter();

    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");

    const [variant, setVariant] = useState("login");

    const [isLoading, setIsLoading] = useState(false);

    const toggleVariant = useCallback(() => {
        setVariant((currentVariant) => currentVariant === "login" ? "register" : "login");
    }, []);

    const login = useCallback(async () => {
        try {
            setIsLoading(true);
            await signIn("credentials", {
                email,
                password,
                redirect: false,
                callbackUrl: "/",
            })

            toast.success("Login successful");
            router.push("/");
        } catch (error) {
            console.log(error);
            toast.error("Error logging in");
            setPassword("");
        } finally {
            setIsLoading(false);
        }

    }, [email, password, router]);

    const register = useCallback(async () => {
        try {
            setIsLoading(true);
            await axios.post('/api/register', {
                email,
                name,
                password
            });
            toast.success("Registration Successful");

            login();
            setPassword("");
        } catch (error) {
            console.log(error);
            toast.error("Registration Error");
            setPassword("");
        } finally {
            setIsLoading(false);
        }
    }, [email, name, password, login]);



    return (
        <div className="relative h-full w-full bg-[url('/images/hero.jpg')] bg-no-repeat bg-center bg-fixed bg-cover">
            <div className="bg-black w-full h-full lg:bg-opacity-50">
                <nav className="px-12 py-5">
                    <Image
                        src="/images/logo.png"
                        alt="logo"
                        width={100}
                        height={100}
                        className="object-cover"
                    />
                </nav>

                <div className="flex justify-center">
                    <div className="bg-black bg-opacity-70 px-16 py-16 self-center mt-2 lg:w-2/5 lg:max-w-md rounded-md w-full">
                        <h2 className="text-white text-4xl mb-8 font-semibold">
                            {variant === "login" ? "Sign in" : "Register"}
                        </h2>
                        <div className="flex flex-col gap-4">
                            {variant === "register" && (
                                <Input
                                    label="Username"
                                    onChange={(e: any) => setName(e.target.value)}
                                    id="name"
                                    value={name}
                                />
                            )}
                            <Input
                                label="Email"
                                onChange={(e: any) => setEmail(e.target.value)}
                                id="email"
                                type="email"
                                value={email}
                            />
                            <Input
                                label="Password"
                                onChange={(e: any) => setPassword(e.target.value)}
                                id="password"
                                type="password"
                                value={password}
                            />
                        </div>
                        <button
                            onClick={variant === "login" ? login : register}
                            className="bg-red-600 py-3 text-white rounded-md w-full 
                                mt-10 hover:bg-red-700 transition flex justify-center items-center"
                        >
                            {variant === "login" ? (

                                isLoading ? <Loader2 className="animate-spin w-5 h-5" /> : "Login"
                            )
                                :
                                isLoading ? <Loader2 className="animate-spin w-5 h-5" /> : "Sign up"
                            }
                        </button>
                        <div className="flex flex-row items-center justify-center gap-4 mt-8">
                            <div
                                onClick={() => signIn("google", { callbackUrl: "/" })}
                                className="w-10 h-10 bg-white rounded-full flex items-center justify-center cursor-pointer
                            hover:opacity-80 transition">
                                <FcGoogle size={30} />
                            </div>
                            <div
                                onClick={() => signIn("github", { callbackUrl: "/" })}
                                className="w-10 h-10 bg-white rounded-full flex items-center justify-center cursor-pointer
                            hover:opacity-80 transition">
                                <FaGithub size={30} />
                            </div>
                        </div>
                        <p className="text-neutral-500 mt-12">
                            {variant === "login" ? "First time using Netflix?" : "Already have an account?"}
                            <span
                                onClick={toggleVariant}
                                className="text-white ml-1 hover:underline cursor-pointer"
                            >
                                {variant === "login" ? "Create an account" : "Sign in"}
                            </span>
                        </p>
                    </div>
                </div>
            </div>
        </div >
    )
}

export default page