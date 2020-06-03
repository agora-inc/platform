import { ScheduledStream } from "../Services/ScheduledStreamService";
import moment from "moment";

const formatTime = (date: Date) => {
  let formattedDate = moment.utc(date).format("YYYYMMDDTHHmmssZ");
  return formattedDate.replace("+00:00", "Z");
};

const generateGoogleCalendarLink = (
  startTime: Date,
  endTime: Date,
  name: string,
  description: string
) => {
  let link = "https://calendar.google.com/calendar/render";
  link += "?action=TEMPLATE";
  link += "&dates=" + formatTime(startTime);
  link += "/" + formatTime(endTime);
  // link += "&location=" + encodeURIComponent(event.location);
  link += "&text=" + encodeURIComponent(name);
  link += "&details=" + encodeURIComponent(description);

  return link;
};

const generateICSDownloadLink = (
  startTime: Date,
  endTime: Date,
  name: string,
  description: string
) => {
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "BEGIN:VEVENT",
    "URL:" + document.URL,
    "DTSTART:" + formatTime(startTime),
    "DTEND:" + formatTime(endTime),
    "SUMMARY:" + name,
    "DESCRIPTION:" + description,
    // "LOCATION:" + event.location,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\n");
};

export const CalendarService = {
  generateGoogleCalendarLink,
  generateICSDownloadLink,
};
