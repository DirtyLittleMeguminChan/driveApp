'use client';
import { Models } from "node-appwrite";
import React, { useState } from "react";
import Image from 'next/image';
import Link from "next/link";
import { Input } from "@/components/ui/input";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { actionsDropdownItems } from "@/constants";
import { ActionType } from "@/types";
import { constructDownloadUrl } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { deleteFile, renameFile, updateFileUsers } from "@/lib/actions/file.action";
import { usePathname } from "next/navigation";
import { FileDetails,ShareInput} from "./ActionModalContent";

const ActionDropDown = ({ file }: { file: Models.Document }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDropdown, setIsDropdown] = useState(false);
    const [action, setActions] = useState<ActionType | null>(null);
    const [name, setName] = useState(file.name);
    const [isLoading, setIsLoading] = useState(false);

    const path = usePathname();

    const [emails,setEmails] = useState<string []>([]);

    const handleRemoveUser = async(email:string) => {
        const updatedEmails = emails.filter((e) => e!==email);
        const success = await updateFileUsers({
            fileId: file.$id,
            emails: updatedEmails,
            path: path,
        });

        if(success){
            setEmails(updatedEmails);
            closeAllModals();
        }

    };

    const renderDialogContent = () => {
        if (!action) return null;
        const { value, label } = action;

        return (
            <DialogContent className="shad-dialog button">
                <DialogHeader className="flex flex-col gap-3">
                    <DialogTitle className="text-center text-light-100">
                        {label}
                    </DialogTitle>
                    {value === "rename" && (
                        <Input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    )}
                    {value === "details" && <FileDetails file={file}/>}
                    {value === "share" && (<ShareInput 
                        file={file}
                        onInputChange={setEmails}
                        onRemove={handleRemoveUser}
                    />)}
                    {value === "delete" && (
                        <p className="delete-confirmation">
                            Are you sure you want to delete {` `}
                            <span className="delete-file-name">{file.name}{` `}</span>?
                        </p>
                    )}


                </DialogHeader>
                {['rename', 'delete', 'share'].includes(value) && (
                    <DialogFooter className="flex flex-col gap-3 md:flex-row">
                        <Button
                            className="modal-cancel-button"
                            onClick={closeAllModals}
                            disabled={isLoading} // Disable cancel during loading
                        >
                            Cancel
                        </Button>
                        <Button
                            className="modal-submit-button"
                            onClick={handleAction}
                            disabled={isLoading} // Disable submit during loading
                        >
                            <p className="capitalize">{value}</p>
                            {isLoading && (
                                <Image
                                    src="/assets/icons/loader.svg"
                                    alt="loader"
                                    width={22}
                                    height={22}
                                    className="animate-spin"
                                />
                            )}
                        </Button>
                    </DialogFooter>
                )}
            </DialogContent>
        );
    };

    const closeAllModals = () => {
        setIsModalOpen(false);
        setIsDropdown(false);
        setActions(null);
        setName(file.name);
    };

    const handleAction = async () => {
        if (!action) return null;
        setIsLoading(true); // Show loader

        let success = false;
        try {
            const actions = {
                rename: async () =>
                    await renameFile({
                        fileId: file.$id,
                        name,
                        extension: file.extension,
                        path,
                    }),
                share: async () => {
                    // Add your share logic here
                    
                    await updateFileUsers({
                        fileId: file.$id,
                        emails: emails,
                        path: path
                    })
                },
                delete: async () => {
                    // Add your delete logic here
                    await deleteFile({
                        fileId: file.$id,
                        bucketFileId: file.bucketFileId,
                        path: path,
                    })
                    return true;
                },
            };

            // Await the result of the asynchronous action
            success = await actions[action.value as keyof typeof actions]();
        } catch (error) {
            console.error('Action failed:', error);
        }

        if (success) closeAllModals(); // Close modals only on success
        setIsLoading(false); // Clear the loader state
    };

    const handleActionClick = (actionItem: ActionType) => {
        setActions(actionItem);
        if (['rename', 'share', 'delete', 'details'].includes(actionItem.value)) {
            setIsModalOpen(true);
        }
    };

    return (
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DropdownMenu open={isDropdown} onOpenChange={setIsDropdown}>
                <DropdownMenuTrigger className="shad-no-focus">
                    <Image
                        src="/assets/icons/dots.svg"
                        alt="dots"
                        width={20}
                        height={20}
                    />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuLabel className="max-w-[200px] truncate">
                        {file.name}
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {actionsDropdownItems.map((actionItem) => (
                        <DropdownMenuItem
                            key={actionItem.value}
                            className="shad-dropdown-item"
                            onClick={() => handleActionClick(actionItem)}
                        >
                            {actionItem.value === 'download' ? (
                                <Link
                                    href={constructDownloadUrl(file.bucketFileId)}
                                    download={file.name}
                                    className="flex items-center gap-2"
                                >
                                    <Image
                                        src={actionItem.icon}
                                        alt={actionItem.label}
                                        width={30}
                                        height={30}
                                    />
                                    {actionItem.label}
                                </Link>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <Image
                                        src={actionItem.icon}
                                        alt={actionItem.label}
                                        width={30}
                                        height={30}
                                    />
                                    {actionItem.label}
                                </div>
                            )}
                        </DropdownMenuItem>
                    ))}
                </DropdownMenuContent>
            </DropdownMenu>
            {renderDialogContent()}
        </Dialog>
    );
};

export default ActionDropDown;
