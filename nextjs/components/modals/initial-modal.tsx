"use client"
import { getCurrentUser } from "@/lib/services/authService";
import {  useEffect, useState } from "react";
import { redirect } from "next/navigation";
import { useUser } from "@/lib/context/userContext";
import { Button } from "../ui/button";
import Link from "next/link";
import { getAccessToken } from "@/utils/storage";


export const InitialModal=()=>{
    // const [user,setUser]=useState(null);
    const {isAuthenticated,user,login,logout}=useUser()
    const [isMounted, setIsMounted] =useState(false);

    useEffect(() => {
        setIsMounted(true);
    },[]);


    useEffect(()=>{
        if(!getAccessToken()){logout()}
        if(user){
            redirect(`/user`)
        }
        login()
    },[isAuthenticated]);

    if(!isMounted) return null;    
    return (
        <div className="flex flex-col items-center justify-center gap-2 text-white">
            <h1 className="text-6xl font-bold text-center">Welcome to Ava!</h1>
            <p className="text-2xl font-medium text-center">Sign up to get early access today!</p>
            <Button variant={"secondary"}><Link href={"/auth/sign-up"}>Sign Up</Link></Button>
        </div>
    )
}