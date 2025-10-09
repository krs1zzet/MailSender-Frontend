import { useForm } from "react-hook-form";
import { baseReceiverSchema, CreateReceiverInput, createReceiverSchema } from "../types/Receiver"
import { zodResolver } from "@hookform/resolvers/zod";
import { createReceiver } from "../api/receiverApi";

type Props = {
    defaultValues?: Partial<CreateReceiverInput>;
    onSubmit: (values: CreateReceiverInput) => void | Promise<void>;
    submitLabel?: string;
}



export default function ReceiverForm({
    defaultValues,
    onSubmit,
    submitLabel = "Save Receiver"
}: Props){
    
    const {
        register,
        handleSubmit,
        formState: {errors,isSubmitting},
    } = useForm<CreateReceiverInput>({
        resolver: zodResolver(baseReceiverSchema),
        defaultValues,
    });

    return(
    <>
    <form onSubmit={handleSubmit(onSubmit)}>
    <div className="flex items-center justify-center ">
    <form className="min-w-80 space-y-8 ">
        <div>
            <label className="  text-center block text-sm font-medium">First Name</label>
            <input {...register("fname")}
            className="text-center mt-1 block w-full rounded border border-gray-300 px-3 py-2" placeholder = "Fname"
            />
            {errors.fname && <p className="text-red-500 text-sm">{errors.fname.message}</p>}
        </div>
        <div>
            <label className="text-center block text-sm font-medium">First Name</label>
            <input {...register("fname")}
            className="text-center mt-1 block w-full rounded border border-gray-300 px-3 py-2" placeholder = "Fname"
            />
            {errors.fname && <p className="text-red-500 text-sm">{errors.fname.message}</p>}
        </div>
        <div>
            <label className="text-center block text-sm font-medium">First Name</label>
            <input {...register("fname")}
            className="text-center mt-1 block w-full rounded border border-gray-300 px-3 py-2" placeholder = "Fname"
            />
            {errors.fname && <p className="text-red-500 text-sm">{errors.fname.message}</p>}
        </div>
        <button
        type = "submit"
        disabled = {isSubmitting}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
            {isSubmitting ? "Saving..." : submitLabel}
            
        </button>

        
    </form>
    </div>
    </form>
    </>
    )
}