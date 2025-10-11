import { useState } from "react";
import Modal from "../../components/ui/Modal";
import { CreateSenderInput, SenderDTO, UpdateSenderInput } from "../../features/sender/types/Sender";
import { useParams } from "react-router";
import { ReceiverDTO } from "../../features/receiver/types/Receiver";
import { useCreateSender, useDeleteSender, useSendersByEventId, useUpdateSender } from "../../features/sender/hooks/useSender";
import SenderForm from "../../features/sender/components/SenderForm";
import { updateReceiver } from "../../features/receiver/api/receiverApi";



export default function SenderPage(){
    const [open,setOpen] = useState(false);
    const [editing,setEditing] = useState<SenderDTO | null>(null);
    const { id } = useParams<{ id: string}>();
    const eventId = Number(id);

    const {data:senders,isLoading,error} = useSendersByEventId(eventId);
    const deleteSender = useDeleteSender();
    const createSender = useCreateSender();
    const updateSender = useUpdateSender();


    const handleCreate = async (values:CreateSenderInput) => {
        if(!eventId || Number.isNaN(eventId)) {
            console.error("Gecersiz eventId");
            return;
        }
        await createSender.mutateAsync({...values,eventId});
        setOpen(false);
    }
    const handleUpdate = async (values:UpdateSenderInput) => {
        if(!editing) return;
        await updateSender.mutateAsync({
            id: editing.id,
            input: values,
            eventId,
        });
        setEditing(null);
        setOpen(false)
    }
    const handleDelete = async(sender:SenderDTO) => {
        await deleteSender.mutateAsync({id:sender.id,eventId});
    }
    



    const openEdit = (sender: SenderDTO) => {
        setEditing(sender);
        setOpen(true)
    }

    const openCreate = () => {
        setEditing(null);
        setOpen(true);
    }

    const onCloseModal = () => {
        setOpen(false);
        setEditing(null);
    }
    
    return(
    <>
    <div className="container mx-auto max-w-7xl px-4 py-8 space-y-6">
        <button
        onClick={openCreate}
            
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            Create Sender
        </button>

        <Modal
            open = {open}
            onClose={onCloseModal}
            title = {editing ? "Update Sender" : "Create Sender"}
        >
            <SenderForm
            defaultValues={
                editing ? {email: editing.email} : undefined
            }
            onSubmit={editing ? handleUpdate : handleCreate}
            submitLabel={editing ? "Update" : "Save"}
            >
            </SenderForm>
        </Modal>

        {
        !senders || senders.length === 0 ? (
            <p>No Senders Found</p>
        ): (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {senders.map((sender) => (
                    <div
                        key={sender.id}
                        onClick={() => openEdit(sender)}
                        className="border rounded-lg shadow p-6 bg-white hover:shadow-lg transition cursor-pointer group relative"
                        >
                            <h2 className="text-lg font-bold mb-2">{sender.email}</h2>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleDelete(sender);
                                }}
                                className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition px-2 py-1 text-xs rounded bg-red-600 text-white hover:bg-red-700"
                                >
                                    Delete
                            </button>
                    </div>
                ))}
            </div>
            
        )
        
        }
    </div>
    </>
    )
}