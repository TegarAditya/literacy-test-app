import type { TimeServerData } from "~/types";

/**
 * Retrieves the current time from a time server.
 * @returns A Promise that resolves to the current time as a Date object.
 * @throws If there is an error fetching the time from the server.
 */
export async function getCurrentTime(): Promise<Date> {
  const timeServer = "http://worldtimeapi.org/api/timezone/Asia/Jakarta";

  try {
    const response = await fetch(timeServer);

    if (!response.ok) {
      throw new Error("Failed to fetch time from the server.");
    }

    const data: TimeServerData = await response.json();

    return data.datetime;
  } catch (error) {
    console.error("Error fetching time:", error);
    throw error;
  }
}

/**
 * Formats the duration in seconds into a string representation of minutes and seconds.
 * @param seconds - The duration in seconds.
 * @returns The formatted duration string in the format "mm:ss".
 */
export function formatDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(
    remainingSeconds
  ).padStart(2, "0")}`;
}

/**
 * Calculates the time difference between the current time and a target time.
 * @param target - The target time to calculate the difference from.
 * @returns A string representing the time difference in the format "HH:MM:SS".
 * If the target time is in the past, it returns "00:00:00" indicating that the countdown has finished.
 */
export function calculateTimeDifference(target: Date): string {
  const now = new Date();
  const totalMilliseconds = target.getTime() - now.getTime();

  if (totalMilliseconds <= 0) {
    return "00:00:00"; // Countdown finished
  }

  const totalSeconds = Math.floor(totalMilliseconds / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
    2,
    "0"
  )}:${String(seconds).padStart(2, "0")}`;
}
