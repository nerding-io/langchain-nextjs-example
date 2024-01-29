import { maskingParser } from "@/utils/maskingParser";

export async function GET() {
  const message = `Contact Jane Doe at jane.doe@email.com or 555-123-4567. 
    Her SSN is 123-45-6789 and her credit card number is 1234-5678-9012-3456.
    Passport number: AB1234567,
    Driver's License: X1234567,
    Address: 123 Main St,
    Date of Birth: 1990-01-01,
    Bank Account: 12345678901234567.`;

  // Mask the message
  const masked = await maskingParser.mask(message);
  console.log(`Masked message: ${masked}`);

  // Rehydrate the message
  const rehydrated = await maskingParser.rehydrate(masked);
  console.log(`Rehydrated message: ${rehydrated}`);

  return Response.json({ masked, rehydrated });
}
