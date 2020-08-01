import { Talk } from "./TalkService";
import moment from "moment";

const formatTime = (date: string) => {
  let formattedDate = moment.utc(date).format("YYYYMMDDTHHmmssZ");
  return formattedDate.replace("+00:00", "Z");
};

const generateGoogleCalendarLink = (
  startTime: string,
  endTime: string,
  name: string,
  description: string,
  talkLink: string
) => {
  let link = "https://calendar.google.com/calendar/render";
  link += "?action=TEMPLATE";
  link += "&dates=" + formatTime(startTime);
  link += "/" + formatTime(endTime);
  link += "&location=" + encodeURIComponent(talkLink);
  link += "&text=" + encodeURIComponent(name);
  link += "&details=" + encodeURIComponent(description);

  return link;
};

const generateICSDownloadLink = (
  startTime: string,
  endTime: string,
  name: string,
  description: string,
  link: string
) => {
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "BEGIN:VEVENT",
    "URL:" + link,
    "DTSTART:" + formatTime(startTime),
    "DTEND:" + formatTime(endTime),
    "SUMMARY:" + name,
    "DESCRIPTION:" + description,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\n");
};

export const CalendarService = {
  generateGoogleCalendarLink,
  generateICSDownloadLink,
};
