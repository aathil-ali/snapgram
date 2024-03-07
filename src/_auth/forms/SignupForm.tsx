import React from 'react'

import { Button } from "@/components/ui/button"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { signupValidation } from '@/lib/validation.ts'
import { Link, useNavigate } from 'react-router-dom'
import { z } from "zod"

import { useUserContext } from "@/context/AuthContext";

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Loader } from 'lucide-react'
import { useToast } from '@/components/ui/use-toast'
import { useCreateUserAccount , useSignInAccount} from '@/lib/react-query/queries'


const SignupForm = () => {

    const { toast } = useToast();
    const navigate = useNavigate();

    const { checkAuthUser, isLoading: isUserLoading } = useUserContext();
    
    // 1. Define your form.
    const form = useForm<z.infer<typeof signupValidation>>({
        resolver: zodResolver(signupValidation),
        defaultValues: {
            name:"",
            username: "",
            email:"",
            password:""
        },
    })

    const { mutateAsync:createUserAccount, isPending:isCreatingAccount} = useCreateUserAccount();
    const { mutateAsync:signInAccount, isPending:isSigningInUser} = useSignInAccount()

    // 2. Define a submit handler.
    async function onSubmit(user: z.infer<typeof signupValidation>) {
        // Do something with the form values.
        //h ✅ This will be type-safe and validated.
        const newUser = await createUserAccount(
            user
        )
        if(!newUser) {
            toast({title:"sign up failed . please try again"});
            return;
        }
        const session = await signInAccount({
            email:user.email,
            password:user.password,
        })

        if(!session) {
            toast({title:"Something went wrong, Please login your new account",});
            navigate("/sign-in");

            return;
        }

        const isLoggedIn = await checkAuthUser();

        if(isLoggedIn){

            form.reset();
            navigate("/")
        } else {
            toast({title:"Login failed . Please try again",});
            return;
        }
    }
    return (

        <Form {...form}>
            <div className='sm:w-420 flex-center flex-col' >
                <img src="/assets/images/logo.svg" alt="logo" />

                <h2 className="h3-bold md:h2-bold pt-5 sm:pt-12">
                    Create new account
                </h2>
                <p className="text-light-3 small-medium md:base-regular mt-2">To use snapgram, Please enter your details</p>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="shad-form_label" >Name</FormLabel>
                                <FormControl>
                                    <Input type="text" className="shad-input" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="username"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="shad-form_label" >User name</FormLabel>
                                <FormControl>
                                    <Input type="text" className="shad-input" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="shad-form_label" >Email</FormLabel>
                                <FormControl>
                                    <Input type="email" className="shad-input" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="shad-form_label" >Password</FormLabel>
                                <FormControl>
                                    <Input type="password" className="shad-input" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />


                    <Button className='shad-button_primary' type="submit">
                        { isCreatingAccount || isSigningInUser || isUserLoading ? (
                            <div className="flex-center gap-2" >
                                <Loader/> Loading...
                            </div>
                        ) : (
                            "Sign Up"
                        )

                        }
                    </Button>
                    <p>
                        Already have a account ?
                        <Link 
                        to="/sign-in"
                        className="text-primary-500 text-small-semibold ml-1"
                        >
                        Login
                        </Link>
                    </p>
                </form>
            </div>
        </Form>
    )
}

export default SignupForm