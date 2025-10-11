// src/app/routes/SendMailPage.tsx
import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { useTemplatesByEventId } from "../../features/mailTemplate/hooks/useTemplate";
import { useSendersByEventId } from "../../features/sender/hooks/useSender";
import { useReceiversByEventId } from "../../features/receiver/hooks/useReceiver";
import { TemplateDTO } from "../../features/mailTemplate/types/mailTemplate";
import { SenderDTO } from "../../features/sender/types/Sender";
import { ReceiverDTO } from "../../features/receiver/types/Receiver";
import { useSendMail } from "../../features/sendMail/hooks/useSendMail";
import { SendMailRequest } from "../../features/sendMail/types/Send";


export default function SendMailPage() {
  const { id } = useParams<{ id: string }>();
  const eventId = Number(id);

  const {
    data: templates,
    isLoading: tLoading,
    error: tError,
  } = useTemplatesByEventId(eventId);

  const {
    data: senders,
    isLoading: sLoading,
    error: sError,
  } = useSendersByEventId(eventId);

  const {
    data: receivers,
    isLoading: rLoading,
    error: rError,
  } = useReceiversByEventId(eventId);

  const sendMail = useSendMail();

  const [selectedTemplateId, setSelectedTemplateId] = useState<number | null>(null);
  const [selectedSenderId, setSelectedSenderId] = useState<number | null>(null);
  const [selectedReceiverIds, setSelectedReceiverIds] = useState<number[]>([]);

  // Varsayılan seçimleri otomatik ayarla (liste geldiyse ilk öğe)
  useEffect(() => {
    if (!tLoading && templates?.length && selectedTemplateId === null) {
      setSelectedTemplateId(templates[0].id);
    }
  }, [tLoading, templates, selectedTemplateId]);

  useEffect(() => {
    if (!sLoading && senders?.length && selectedSenderId === null) {
      setSelectedSenderId(senders[0].id);
    }
  }, [sLoading, senders, selectedSenderId]);

  // receiver seçme/çıkarma
  const toggleReceiver = (id: number) => {
    setSelectedReceiverIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const allReceiversSelected = useMemo(() => {
    if (!receivers?.length) return false;
    return selectedReceiverIds.length === receivers.length;
  }, [receivers, selectedReceiverIds]);

  const toggleSelectAll = () => {
    if (!receivers?.length) return;
    setSelectedReceiverIds((prev) =>
      prev.length === receivers.length ? [] : receivers.map((r) => r.id)
    );
  };

  const canSend =
    !!selectedTemplateId &&
    !!selectedSenderId &&
    selectedReceiverIds.length > 0 &&
    !sendMail.isPending;

  const handleSend = async () => {
    if (!canSend) return;
    const payload: SendMailRequest = {
      senderId: selectedSenderId!,
      receiverIds: selectedReceiverIds,
      mailTemplateId: selectedTemplateId!,
    };
    try {
      const res = await sendMail.mutateAsync(payload);
      // Burada toast vb. gösterebilirsin
      // toast.success(`Sent: ${res.totalSent}, Failed: ${res.failedEmails?.length ?? 0}`)
    } catch (e) {
      // toast.error("Send failed")
    }
  };

  if (tLoading || sLoading || rLoading) {
    return (
      <div className="container mx-auto max-w-7xl px-4 py-8">
        <p>Loading…</p>
      </div>
    );
  }
  if (tError || sError || rError) {
    return (
      <div className="container mx-auto max-w-7xl px-4 py-8 text-red-600">
        {tError && <div>Templates failed to load</div>}
        {sError && <div>Senders failed to load</div>}
        {rError && <div>Receivers failed to load</div>}
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8 space-y-8">
      <h1 className="text-2xl font-semibold">Send Mail</h1>

      {/* Template seçimi (tek) */}
      <section className="space-y-2">
        <h2 className="font-medium">Mail Template</h2>
        <select
          className="w-full md:w-96 rounded border px-3 py-2"
          value={selectedTemplateId ?? ""}
          onChange={(e) => setSelectedTemplateId(Number(e.target.value))}
        >
          {templates?.map((t: TemplateDTO) => (
            <option key={t.id} value={t.id}>
              {t.header}
            </option>
          ))}
        </select>
      </section>

      {/* Sender seçimi (tek) */}
      <section className="space-y-2">
        <h2 className="font-medium">Sender</h2>
        <select
          className="w-full md:w-96 rounded border px-3 py-2"
          value={selectedSenderId ?? ""}
          onChange={(e) => setSelectedSenderId(Number(e.target.value))}
        >
          {senders?.map((s: SenderDTO) => (
            <option key={s.id} value={s.id}>
              {s.email}
            </option>
          ))}
        </select>
      </section>

      {/* Receiver seçimi (çoklu) */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-medium">Receivers</h2>
          <button
            onClick={toggleSelectAll}
            className="text-sm px-3 py-1 rounded border hover:bg-gray-50"
          >
            {allReceiversSelected ? "Clear All" : "Select All"}
          </button>
        </div>

        {!receivers?.length ? (
          <p className="text-gray-600">No receivers.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {receivers.map((r: ReceiverDTO) => {
              const checked = selectedReceiverIds.includes(r.id);
              return (
                <label
                  key={r.id}
                  className={`flex items-start gap-3 border rounded-lg p-4 cursor-pointer hover:shadow-sm ${
                    checked ? "ring-1 ring-blue-500" : ""
                  }`}
                >
                  <input
                    type="checkbox"
                    className="mt-1"
                    checked={checked}
                    onChange={() => toggleReceiver(r.id)}
                  />
                  <div>
                    <div className="font-medium">{r.email}</div>
                    <div className="text-sm text-gray-600">
                      {r.fname} {r.lname} {r.groupName ? `• ${r.groupName}` : ""}
                    </div>
                  </div>
                </label>
              );
            })}
          </div>
        )}

        <div className="text-sm text-gray-600">
          Selected: {selectedReceiverIds.length} / {receivers?.length ?? 0}
        </div>
      </section>

      {/* Gönder butonu + sonuç durumu */}
      <section className="pt-2">
        <button
          onClick={handleSend}
          disabled={!canSend}
          className={`px-5 py-2 rounded text-white ${
            canSend ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-400 cursor-not-allowed"
          }`}
        >
          {sendMail.isPending ? "Sending..." : "Send"}
        </button>

        {/* Sonucu göster */}
        

        {sendMail.isError && (
          <div className="mt-3 text-sm text-red-600">
            Send failed. Please try again.
          </div>
        )}
      </section>
    </div>
  );
}
