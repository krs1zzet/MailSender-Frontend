import { useForm } from "react-hook-form";
import { baseSenderSchema, CreateSenderInput } from "../types/Sender"
import { zodResolver } from "@hookform/resolvers/zod";

type Props = {
    defaultValues?: Partial<CreateSenderInput>;
    onSubmit: (values: CreateSenderInput) => void | Promise<void>;
    submitLabel?: string;
}

export default function SenderForm(
    {
        defaultValues,
        onSubmit,
        submitLabel = "Save Sender"
    }: Props
) {
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<CreateSenderInput>({
        resolver: zodResolver(baseSenderSchema),
        defaultValues,
    });
    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="flex items-center justify-center">
                    <div className="min-w-80 space-y-6">
                        <div>
                            <label className="block text-sm font-medium py-2 text-center">Email</label>
                            <input
                                {...register("email")}
                                className="mt-1 block w-full rounded border border-gray-300 px-3 py-2 text-center"
                                placeholder="example@gmail.com"
                            />
                            {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium py-2 text-center">App Pasword</label>
                            <input
                                {...register("password")}
                                className="mt-1 block w-full rounded border border-gray-300 px-3 py-2 text-center"
                                placeholder="**** **** **** ****"
                            />
                            {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
                        </div>
                        <div className="w-full flex justify-center">
                        <button 
                        type="submit"
                        disabled={isSubmitting}
                        className="text-white px-4 py-2 bg-blue-500 hover:bg-blue-600 transition rounded text-lg ">
                        {isSubmitting ? "Saving..." : submitLabel}
                        </button>
                        </div>
                    </div>
                </div>
            </form>

        </>
    )
}