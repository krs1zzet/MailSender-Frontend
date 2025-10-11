import { useState } from "react";
import ReceiverForm from "../../features/receiver/components/ReceiverForm";
import { TemplateDTO } from "../../features/mailTemplate/types/mailTemplate";
import Modal from "../../components/ui/Modal";
import { CreateReceiverInput, ReceiverDTO, updateReceiverInput } from "../../features/receiver/types/Receiver";
import { useParams } from "react-router";
import { createReceiver, deleteReceiver, updateReceiver } from "../../features/receiver/api/receiverApi";
import { useCreateReceivers, useDeleteReceiver, useReceiver, useReceiversByEventId, useUpdateReceiver } from "../../features/receiver/hooks/useReceiver";

export default function ReceiverPage() {
    const [open, setOpen] = useState(false);
    const [editing, setEditing] = useState<ReceiverDTO | null>(null);
    const { id } = useParams<{ id: string }>();
    const eventId = Number(id);

    const { data: receivers, isLoading, error } = useReceiversByEventId(eventId);
    const deleteReceiver = useDeleteReceiver();
    const createReceiver = useCreateReceivers();
    const updateReceiver = useUpdateReceiver();




    const handleCreate = async (values: CreateReceiverInput) => {
        if (!eventId || Number.isNaN(eventId)) {
            console.error("Gecersiz EventId");
            return;
        }
        console.log("creating receivers in page");
        await createReceiver.mutateAsync({ ...values, eventId });
        setOpen(false);
    }

    const handleUpdate = async (values: updateReceiverInput) => {
        if (!editing) return;
        await updateReceiver.mutateAsync({
            id: editing.id,
            input: values,
            eventId,
        });
        setEditing(null);
        setOpen(false);
    }

    const handleDelete = async (receiver: ReceiverDTO) => {
        await deleteReceiver.mutateAsync({ id: receiver.id, eventId })
    }

    const openEdit = (receiver: ReceiverDTO) => {
        setEditing(receiver);
        setOpen(true);
    }

    const openCreate = () => {
        setEditing(null);
        setOpen(true);
    }
    const onCloseModal = () => {
        setOpen(false);
        setEditing(null);
    }


    return (
        <>
            <div className="container mx-auto max-w-7xl px-4 py-8 space-y-6">
                <button
                    onClick={openCreate}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                    Create Receiver
                </button>

                <Modal
                    open={open}
                    onClose={onCloseModal}
                    title={editing ? "Update Receiver" : "Create Receiver"}
                >
                    <ReceiverForm
                        defaultValues={
                            editing
                                ? { fname: editing.fname, lname: editing.lname, email: editing.email, groupName: editing.groupName } : undefined
                        }
                        onSubmit={editing ? handleUpdate : handleCreate}
                        submitLabel={editing ? "Update" : "Create"}
                    >

                    </ReceiverForm>
                </Modal>

                {!receivers || receivers.length === 0 ? (
                    <p>No receivers found</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {receivers.map((receiver) => (
                            <div
                                key={receiver.id}
                                onClick={() => openEdit(receiver)}
                                className="border rounded-lg shadow p-6 bg-white hover:shadow-lg transition cursor-pointer group relative"
                            >
                                <h2 className="text-xl font-bold mb-2">{receiver.email}</h2>
                                <p className="text-m  ">{receiver.fname}</p>
                                <p className="text-m  ">{receiver.lname}</p>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleDelete(receiver);
                                    }}
                                    className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition px-2 py-1 text-xs rounded bg-red-600 text-white hover:bg-red-700"
                                >
                                    Delete
                                </button>
                            </div>

                        ))}
                    </div>
                )}



            </div>
        </>
    );
}
