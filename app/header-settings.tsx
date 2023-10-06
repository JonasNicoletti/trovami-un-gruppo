'use client';

import { useState } from "react";
import Logout from "./auth/logout";
import Link from "next/link";

export default function HeaderSettings({ salutation }: { salutation?: string }) {

    const [isOpen, setIsOpen] = useState(false);

    return <div className="flex flex-col">
        <button onClick={() => setIsOpen(!isOpen)} 
        className="text-white bg-gray-700 hover:bg-gray-800 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2 text-center inline-flex items-center dark:bg-dark-600 dark:hover:bg-gray-700 dark:focus:ring-gray-800" type="button">
            {salutation} 
            <svg className="w-2.5 h-2.5 ml-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4" />
        </svg>
        </button>
        <div hidden={!isOpen} className="z-20 bg-white divide-y divide-gray-100 rounded-lg shadow  dark:bg-gray-700 ">
            <ul className="absolute text-sm my-1 bg-white divide-y divide-gray-100 rounded-lg shadow  dark:bg-gray-700 w-24 text-center">
                <li className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white ">
                    <Link href={'/auth/profile'}>Profilo</Link>
                </li>
                
                <li className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                    <Logout />
                </li>
            </ul>
        </div>

    </div>
}