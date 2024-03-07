import { useQueries,useMutation,useQueryClient,useInfinityQuery } from "@tanstack/react-query";
import { INewPost, INewUser, IUpdatePost, IUpdateUser } from "@/types";

// import {QUERY_KEYS} 
import { QUERY_KEYS } from "@/lib/react-query/queryKeys";

import { createUserAccount,signInAccount } from "../appwrite/api";

export const useCreateUserAccount = () => {

    return useMutation({
        mutationFn:(user:INewUser)=> createUserAccount(user)
    })
}

export const useSignInAccount = () => {
  return useMutation({
    mutationFn: (user: { email: string; password: string }) =>
      signInAccount(user),
  });
};