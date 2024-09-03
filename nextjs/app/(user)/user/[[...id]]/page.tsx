'use client'
import { useUser } from "@/lib/context/userContext";
import { useRouter,redirect } from "next/navigation";
export default function UserPage({ params }: { params: { id: string } }) {
    const router = useRouter();
    const {user,isAuthenticated}=useUser();

    if (!isAuthenticated){ 
        redirect('/');
        return null;
    }
    console.log(params)
    return (

        <div>
            {params.id?
            <h2 className="text-white">User Id is {params.id}</h2>:
            <h2 className="text-white">User Name is {user?.name}</h2>
            }
        </div>

    )
  }