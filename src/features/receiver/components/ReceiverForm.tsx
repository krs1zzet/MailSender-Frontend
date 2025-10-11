import { useForm } from "react-hook-form";
import { baseReceiverSchema, CreateReceiverInput } from "../types/Receiver";
import { zodResolver } from "@hookform/resolvers/zod";

type Props = {
  defaultValues?: Partial<CreateReceiverInput>;
  onSubmit: (values: CreateReceiverInput) => void | Promise<void>;
  submitLabel?: string;
};

export default function ReceiverForm({
  defaultValues,
  onSubmit,
  submitLabel = "Save Receiver",
}: Props) {
  const { register, handleSubmit, formState: { errors, isSubmitting } } =
    useForm<CreateReceiverInput>({
      resolver: zodResolver(baseReceiverSchema),
      defaultValues,
    });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex items-center justify-center">
        <div className="min-w-80 space-y-6">
          <div>
            

            <label className="block text-sm font-medium py-2 text-center">First Name</label>
            <input
              {...register("fname")}
              className="mt-1 block w-full rounded border border-gray-300 px-3 py-2 text-center"
              placeholder="Fname"
            />
            {errors.fname && <p className="text-red-500 text-sm">{errors.fname.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium py-2 text-center">Last Name</label>
            <input
              {...register("lname")}
              className="mt-1 block w-full rounded border border-gray-300 px-3 py-2 text-center"
              placeholder="Lname"
            />
            {errors.lname && <p className="text-red-500 text-sm">{errors.lname.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium py-2 text-center">Email</label>
            <input
              {...register("email")}
              className="mt-1 block w-full rounded border border-gray-300 px-3 py-2 text-center"
              placeholder="Email"
            />
            {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium py-2 text-center">Group Name</label>
            <input
              {...register("groupName")}
              className="mt-1 block w-full rounded border border-gray-300 px-3 py-2 text-center"
              placeholder="GroupName"
            />
            {errors.groupName && <p className="text-red-500 text-sm">{errors.groupName.message}</p>}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            {isSubmitting ? "Saving..." : submitLabel}
          </button>
        </div>
      </div>
    </form>
  );
}
