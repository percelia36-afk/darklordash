"use server";

const CORRECT_PASSCODE = process.env.PASSCODE;

export async function verifyPasscode(passcode) {
  if (passcode === CORRECT_PASSCODE) {
    return { success: true };
  }
  return { success: false };
}
