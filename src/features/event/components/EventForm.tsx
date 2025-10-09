// src/features/event/components/EventForm.tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateEventInput, createEventSchema } from "../types/event";
import { localDatetimeToISO } from "../../../utils/dateMapper";

type Props = {
    defaultValues?: Partial<CreateEventInput>;
    onSubmit: (values: CreateEventInput) => void | Promise<void>;
    submitLabel?: string;
};

export default function EventForm({
    defaultValues,
    onSubmit,
    submitLabel = "Save Event",
}: Props) {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<CreateEventInput>({
        resolver: zodResolver(createEventSchema),
        defaultValues,
    });

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Name */}
            <div>
                <label className="block text-sm font-medium">Name</label>
                <input
                    {...register("name")}
                    className="mt-1 block w-full rounded border border-gray-300 px-3 py-2"
                    placeholder="Event name"
                />
                {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
            </div>

            {/* Description */}
            <div>
                <label className="block text-sm font-medium">Description</label>
                <textarea
                    {...register("description")}
                    className="mt-1 block w-full rounded border border-gray-300 px-3 py-2"
                    placeholder="Description"
                />
                {errors.description && (
                    <p className="text-red-500 text-sm">{errors.description.message}</p>
                )}
            </div>

            {/* Password */}
            <div>
                <label className="block text-sm font-medium">Password</label>
                <input
                    type="password"
                    {...register("password")}
                    className="mt-1 block w-full rounded border border-gray-300 px-3 py-2"
                    placeholder="Secret"
                />
                {errors.password && (
                    <p className="text-red-500 text-sm">{errors.password.message}</p>
                )}
            </div>

            {/* Date (Instant için ISO bekleyecek → datetime-local değerini ISO'ya çevir) */}
            <div>
                <label className="block text-sm font-medium">Date</label>
                <input
                    type="datetime-local"
                    {...register("date", {
                        setValueAs: (val) => localDatetimeToISO(val), // burada ISO'ya çeviriyoruz
                    })}
                />
                {errors.date && <p className="text-red-500 text-sm">{errors.date.message}</p>}
                <p className="text-xs text-gray-500 mt-1">
                    * Sunucu Instant (UTC) bekliyor. `datetime-local` alanını ISO stringe çevireceğiz.
                </p>
            </div>

            <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
                {isSubmitting ? "Saving..." : submitLabel}
            </button>
        </form>
    );
}
