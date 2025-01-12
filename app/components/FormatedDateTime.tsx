import { formatDateTime,cn } from "@/lib/utils";
import { Models } from "node-appwrite";
import React from "react";


const FormatedDateTime = ({ date , className} : { date : string, className? : string }) => {
    return <p className={cn(
        "body-1 text-light-200",className

    )}>{formatDateTime(date)}</p>
};

export default FormatedDateTime;