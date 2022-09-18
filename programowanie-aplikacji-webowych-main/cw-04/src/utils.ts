function getDay(dt: number, timezoneOffset: number = 0): string {
    const date = new Date((dt + timezoneOffset));
    const stringDate = date.toLocaleString();
    return stringDate;
}

export {
    getDay
};