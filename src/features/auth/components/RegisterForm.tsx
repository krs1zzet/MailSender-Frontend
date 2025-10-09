// src/features/auth/components/RegisterForm.tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signUpSchema, type SignUpInput } from "../types/auth";
import { useSignUp } from "../hooks/useAuth";
import { Link, useNavigate } from "react-router-dom";

export default function RegisterForm() {
  const { register, handleSubmit, formState } = useForm<SignUpInput>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { username: "", password: "" },
  });

  const { errors } = formState;
  const signUp = useSignUp();
  const navigate = useNavigate();

  const onSubmit = (data: SignUpInput) => {
    signUp.mutate(data, {
      onSuccess: () => {
        // Kayıt başarılı -> login sayfasına yönlendir
        navigate("/login", { replace: true });
      },
    });
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-sm mx-auto p-6 bg-white shadow rounded"
    >
      <h2 className="text-xl font-bold mb-4">Kayıt Ol</h2>

      <div className="mb-3">
        <input
          type="text"
          placeholder="Kullanıcı adı (email olabilir)"
          autoComplete="username"
          {...register("username")}
          className="w-full p-2 border rounded"
          aria-invalid={!!errors.username || undefined}
        />
        {errors.username && (
          <p className="text-red-500 text-sm">{errors.username.message}</p>
        )}
      </div>

      <div className="mb-3">
        <input
          type="password"
          placeholder="Şifre"
          autoComplete="new-password"
          {...register("password")}
          className="w-full p-2 border rounded"
          aria-invalid={!!errors.password || undefined}
        />
        {errors.password && (
          <p className="text-red-500 text-sm">{errors.password.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={signUp.isPending}
        className="w-full bg-emerald-600 text-white p-2 rounded disabled:opacity-50"
      >
        {signUp.isPending ? "Kaydediliyor..." : "Kayıt Ol"}
      </button>

      {signUp.isError && (
        <p className="text-red-500 text-sm mt-2">
          {(signUp.error as any)?.response?.data?.message ||
            (signUp.error as Error).message}
        </p>
      )}

      {/* Alt bağlantı: Giriş sayfasına geç */}
      <p className="text-sm text-center mt-4">
        Zaten hesabın var mı?{" "}
        <Link to="/login" className="text-purple-700 underline">
          Giriş yap
        </Link>
      </p>
    </form>
  );
}
