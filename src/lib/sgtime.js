export function getSgTime() {
    const now = new Date();

    const options = {
        timeZone: 'Asia/Singapore',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
    };

    const formatter = new Intl.DateTimeFormat('en-GB', options);
    const parts = formatter.formatToParts(now);

    const dateParts = {};
    parts.forEach(({ type, value }) => {
        dateParts[type] = value;
    });

    const yyyy = dateParts.year;
    const mm = dateParts.month;
    const dd = dateParts.day;
    const hh = dateParts.hour;
    const min = dateParts.minute;
    const sec = dateParts.second;

    return `${yyyy}-${mm}-${dd} ${hh}:${min}:${sec}`;
}