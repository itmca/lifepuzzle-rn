export const getRecordFileName = function () {
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const minute = date.getMinutes();

    const tempHour = date.getHours();
    const hour = Math.floor(tempHour / 12) + (tempHour % 13);
    const hourUnit = tempHour < 12 ? 'AM' : 'PM';

    const fileName = `${year}.${month}.${day} ${hour}:${minute}${hourUnit}`;
    return fileName;
};

export const getDisplayRecordTime = function (mileSeconds: number) {
    const seconds = Math.floor((mileSeconds / 1000) % 60);
    const minute = Math.floor((mileSeconds / 60000) % 60);
    const hour = Math.floor((mileSeconds / 3600000) % 60);

    const hourMinuteSeconds =
        hour.toLocaleString('en-US', {minimumIntegerDigits: 2}) +
        ':' +
        minute.toLocaleString('en-US', {minimumIntegerDigits: 2}) +
        ':' +
        seconds.toLocaleString('en-US', {minimumIntegerDigits: 2});

    return hourMinuteSeconds;
};