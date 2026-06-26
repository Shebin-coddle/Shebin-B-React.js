export function validateEmail(email: string) {
  return /^[a-zA-Z0-9]+([._%+-][a-zA-Z0-9]+)*@[a-zA-Z0-9]+(-[a-zA-Z0-9]+)*(\.[a-zA-Z]{2,})+$/.test(
    email,
  );
}

export function validatePhone(phone: string) {
  return /^\d{10}$/.test(phone);
}

export function validatePincode(pin: string) {
  return /^\d{6}$/.test(pin);
}

export function validateRequired(
  value: string,
  message: string,
  key: string,
  errors: Record<string, string>,
) {
  if (!value?.trim()) errors[key] = message;
}

export function validatePattern(
  value: string,
  pattern: RegExp,
  message: string,
  key: string,
  errors: Record<string, string>,
) {
  if (!pattern.test(value)) errors[key] = message;
}