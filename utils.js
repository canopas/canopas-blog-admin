import config from "./config";

// Calculate reading time
async function getReadingTime(content) {
    if (!content) return;
    const numberOfWords = content
        .replace(/<\/?[^>]+(>|$)/g, "")
        .split(/\s/g).length;
    return Math.ceil(numberOfWords / config.WORDS_PER_MINUTE);
}

// Formate date and time from millis
async function formateDate(date) {
    if (!date) return;
    const newDate = new Date(date);
    const formattedDate = newDate.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
    
    // time formate 
    const formattedTime = newDate.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
    });
    return [formattedDate, formattedTime];
}

export {
    getReadingTime,
    formateDate,
};
