import { parsePhoneNumber, type Value } from "react-phone-number-input";

// API may return national format ("(44) 99735-7177"); PhoneInput needs E.164.
// Only assume BR when the result is a valid BR number — otherwise keep the raw value.
function toE164(phone: string | null): Value | "" {
  if (!phone) return "";
  const parsed = parsePhoneNumber(phone, "BR");
  return parsed?.isValid() ? parsed.number : (phone as Value);
}

export { toE164 };
