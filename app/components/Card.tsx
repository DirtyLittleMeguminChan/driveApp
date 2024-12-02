import Link from "next/link";
import { Models } from "node-appwrite";
import React from "react";
import ThumbNail from "./Thumbnail";
import { convertFileSize } from "@/lib/utils";
import FormatedDateTime from "./FormatedDateTime";
import ActionDropDown from "./ActionDropDown";

const Card = ({ file }: { file: Models.Document }) => {
    return (
        <div className="file-card">
            <div className="flex justify-between">
                {/* Thumbnail clickable as link */}
                <Link href={file.url} className="flex-shrink-0">
                    <ThumbNail
                        type={file.type}
                        extension={file.extension}
                        url={file.url}
                        className="!size-15"
                        imageClassName="!size-40"
                    />
                </Link>

                <div className="flex flex-col items-end justify-between">
                    {/* Dropdown excluded from Link */}
                    <ActionDropDown file={file} />
                    <p className="body-1">{convertFileSize(file.size)}</p>
                </div>
            </div>

            <div className="file-card-details">
                {/* Title clickable as link */}
                <Link href={file.url} className="subtitle-2 line-clamp-1">
                    {file.name}
                </Link>
                <FormatedDateTime date={file.$createdAt} className="body-2 text-light-100" />
                <p className="caption line-clamp-1 text-light-200 capitalize truncate">
                    By: {file.owner.fullName}
                </p>
            </div>
        </div>
    );
};

export default Card;
