import { createServerActionClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function Auth() {

   
    async function onSubmit(formData: FormData) {
        'use server';
        const supabase = createServerActionClient<Database>({ cookies })

        const email = formData.get('email')?.toString();
        const password = formData.get('password')?.toString();
        if (email && password ) {
            const { data } = await supabase.auth.signInWithPassword({
                email,
                password,
            }, );
            if (data) {
                redirect('/');
            }
        }
    }

    return (
        <div className="flex flex-col h-screen w-full mx-auto px-4" >
            <form action={onSubmit}>
                <div className="flex flex-col md:flex-row items-center justify-center m-6">
                    <input type="text"
                        name="email"
                        className="mb-2 md:mr-10 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="E-mail"
                        required>
                    </input>
                    <input type="password" name="password" id="password" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="•••••••••" required>
                    </input>
                </div>

                <div className="mx-6 flex flex-col justify-center">
                    <button type="submit" className=" text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Login</button>
                    <Link className="my-2 text-sm text-center" href={'auth/register'}>registrati</Link>
                </div>
            </form>
        </div>
    )
}