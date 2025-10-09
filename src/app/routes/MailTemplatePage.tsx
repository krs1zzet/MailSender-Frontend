// src/app/routes/MailTemplatePage.tsx
import { useState } from "react";
import { useParams } from "react-router-dom";
import Modal from "../../components/ui/Modal";
import TemplateForm from "../../features/mailTemplate/components/TemplateForm";
import {
  CreateTemplateInput,
  UpdateTemplateInput,
  TemplateDTO,
} from "../../features/mailTemplate/types/mailTemplate";
import {
  useCreateTemplate,
  useTemplatesByEventId,
  useUpdateTemplate,
  useDeleteTemplate,
} from "../../features/mailTemplate/hooks/useTemplate";

export default function MailTemplatePage() {
  const { id } = useParams<{ id: string }>();
  const eventId = Number(id);

  const { data: templates, isLoading, error } = useTemplatesByEventId(eventId);
  const createTemplate = useCreateTemplate();
  const updateTemplate = useUpdateTemplate();
  const deleteTemplate = useDeleteTemplate();

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<TemplateDTO | null>(null);

  if (isLoading) {
    return (
      <div className="container mx-auto max-w-7xl px-4 py-8">
        <p>Loading Templates...</p>
      </div>
    );
  }
  if (error) {
    return (
      <div className="container mx-auto max-w-7xl px-4 py-8 text-red-600">
        Failed to load templates
      </div>
    );
  }

  const handleCreate = async (values: CreateTemplateInput) => {
    if (!eventId || Number.isNaN(eventId)) {
      console.error("Geçersiz eventId");
      return;
    }
    await createTemplate.mutateAsync({ ...values, eventId });
    setOpen(false);
  };

  const handleUpdate = async (values: UpdateTemplateInput) => {
    if (!editing) return;
    await updateTemplate.mutateAsync({
      id: editing.id,
      input: values,
      eventId, // invalidate için
    });
    setEditing(null);
    setOpen(false);
  };

  const handleDelete = async (template: TemplateDTO) => {
    await deleteTemplate.mutateAsync({ id: template.id, eventId });
  };

  const openCreate = () => {
    setEditing(null);
    setOpen(true);
  };

  const openEdit = (template: TemplateDTO) => {
    setEditing(template);
    setOpen(true);
  };

  const onCloseModal = () => {
    setOpen(false);
    setEditing(null);
  };

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8 space-y-6">
      <div className="flex items-center gap-3">
        <button
          onClick={openCreate}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Create Mail Template
        </button>
      </div>

      <Modal
        open={open}
        onClose={onCloseModal}
        title={editing ? "Update Mail Template" : "Create Mail Template"}
      >
        <TemplateForm
          defaultValues={
            editing
              ? { header: editing.header, body: editing.body }
              : undefined
          }
          onSubmit={editing ? handleUpdate : handleCreate}
          submitLabel={editing ? "Update" : "Create"}
        />
      </Modal>

      {!templates || templates.length === 0 ? (
        <p>No templates found</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {templates.map((template) => (
            <div
              key={template.id}
              onClick={() => openEdit(template)}
              className="border rounded-lg shadow p-6 bg-white hover:shadow-lg transition cursor-pointer group relative"
            >
              <h2 className="text-xl font-bold mb-2">{template.header}</h2>
              <p className="text-gray-600 pr-10">{template.body}</p>

              {/* Sil butonu (kart tıklamasını tetiklememesi için stopPropagation) */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(template);
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
  );
}
