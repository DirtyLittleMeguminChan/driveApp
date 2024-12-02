import Image  from "next/image";
import { Button } from "@/components/ui/button";
import React from "react";
import Search  from "./Search";
import FileUploader from "./FileUploader";
import { signOutUser } from "@/lib/actions/user.action";

const Header = ({ userId, accountId} : { userId: string, accountId: string}) =>{
    return(
        <header className="header">
            <Search/>
            <div className="header-wrapper">
                <FileUploader ownerId={userId} accountId={accountId}/>
                <form action={async () => {
                    "use server";
                    await signOutUser();
                }}>
                    <Button type="submit" className="sign-out-button">
                        <Image
                            src='/assets/icons/logout.svg'
                            alt='logo'
                            width={24}
                            height={24}

                        />
                    </Button>
                </form>
            </div>
        </header>
    )
};

export default Header