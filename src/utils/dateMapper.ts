// dateMapper.ts
export function localDatetimeToISO(input: string | undefined | null): string {
    if (!input) return ""; // form validation yakalar
  
    // Zaten parse edilebilen bir tarihse bırak (ISO olabilir)
    const parsed = Date.parse(input);
    if (!Number.isNaN(parsed)) return new Date(parsed).toISOString();
  
    // "YYYY-MM-DDTHH:mm" veya "YYYY-MM-DDTHH:mm:ss" için manuel parse
    const m = input.match(
      /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})(?::(\d{2}))?$/
    );
    if (!m) return ""; // hata fırlatma yerine boş → zod yakalar
  
    const [, y, mo, d, h, mi, s = "0"] = m;
    const dt = new Date(
      Number(y),
      Number(mo) - 1,
      Number(d),
      Number(h),
      Number(mi),
      Number(s)
    );
  
    if (Number.isNaN(dt.getTime())) return "";
    return dt.toISOString();
  }
  