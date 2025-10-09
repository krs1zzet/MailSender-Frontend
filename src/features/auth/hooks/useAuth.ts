import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { SignInInput, SignUpInput, UserDTO } from "../types/auth";
import { fetchMe, signIn, signOut, signUp } from "../api/authApi";
import { useNavigate } from "react-router";

const QK = {
  me: ["me"] as const,
};

export function useAuthUser() {
  return useQuery<UserDTO>({
    queryKey: QK.me,
    queryFn: fetchMe,
    retry: false,
    staleTime: 60_000,
  });
}

export function useSignIn() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: SignInInput) => signIn(input),
    onSuccess: () => {
      console.log("log in user");
      qc.invalidateQueries({ queryKey: QK.me });
      const back = sessionStorage.getItem("postLoginRedirect");

      navigate(back || "/dashboard", { replace: true });

      sessionStorage.removeItem("postLoginRedirect");
    },
  });
}

export function useSignUp() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: SignUpInput) => signUp(input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QK.me });
    },
  });
}

export function useSignOut() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => signOut(),
    onSuccess: () => {
      qc.removeQueries({ queryKey: QK.me });
    },
  });
}
