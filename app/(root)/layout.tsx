
import React from "react";
import SideBar from "../components/SideBar";
import MobileNavigation from "../components/MobileNavigation";
import Header from "../components/Header";
import { getCurrentUser } from "@/lib/actions/user.action";
import { redirect } from "next/navigation";
import { Toaster } from "@/components/ui/toaster"


const Layout =  async ({ children } : { children : React.ReactNode}) =>{
    const currentUser = await getCurrentUser();
    console.log("Current User Object:", currentUser);
    if(!currentUser) return redirect("/sign-in")
    return(
        <main className="flex h-screen">
            <SideBar {... currentUser}/> 
            <section className="flex h-full flex-1 flex-col">
                <MobileNavigation {... currentUser}/>
                <Header userId={currentUser.$id} accountId={currentUser.accountId}/>
                <div className="main-content">{children}</div>
            </section>
            <Toaster />
        </main>
    )
};

export default Layout