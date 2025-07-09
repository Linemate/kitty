export default function dateTimeOfLanguage(date: string, language: string) {
    let dateObj = new Date(date);
    if (language === 'ko') {
        // Korea Standard Time is UTC+9
        // Adjust the date to KST if not already
        const utc = dateObj.getTime() + dateObj.getTimezoneOffset() * 60000;
        dateObj = new Date(utc + 9 * 60 * 60000);
    }
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const day = String(dateObj.getDate()).padStart(2, '0');
    const hours = String(dateObj.getHours()).padStart(2, '0');
    const minutes = String(dateObj.getMinutes()).padStart(2, '0');
    return `${year}.${month}.${day} ${hours}:${minutes}`;
}
