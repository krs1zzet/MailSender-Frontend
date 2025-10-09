import { useForm } from "react-hook-form";
import { CreateTemplateInput, createTemplateSchema } from "../types/mailTemplate"
import { zodResolver } from "@hookform/resolvers/zod";

type Props = {
    defaultValues?: Partial<CreateTemplateInput>;
    onSubmit: (values: CreateTemplateInput) => void | Promise<void>;
    submitLabel?: string;
};

export default function TemplateForm({
    defaultValues,
    onSubmit,
    submitLabel = "Save Template"
}: Props) {

    const {
        register,
        handleSubmit,
        formState: {errors, isSubmitting},
    } = useForm<CreateTemplateInput>({
        resolver: zodResolver(createTemplateSchema),
        defaultValues,
    });

    return (
        <form onSubmit={handleSubmit(onSubmit)}
            className="space-y-4">
                <div>
                    <label className="block text-sm font-medium">Header</label>
                    <input
                    {...register("header")}
                    className="mt-1 block w-full rounded border border-gray-300 px-3 py-2" placeholder="Header"
                    />
                    {errors.header && <p className="text-red-500 text-sm">{errors.header.message}</p>}
                </div>
                <div>
                    <label className="block text-sm font-medium">Body</label>
                    <input
                    {...register("body")}
                    className="mt-1 block w-full rounded border border-gray-300 px-3 py-2" placeholder="Header"
                    />
                    {errors.body && <p className="text-red-500 text-sm">{errors.body.message}</p>}
                </div>
                <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                {isSubmitting ? "Saving..." : submitLabel}
            </button>
            


        </form>
    )
}