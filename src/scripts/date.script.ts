export const getDayDifference = (x: Date, y: Date) => {
    const firstDate = new Date(x);
    const secondDate = new Date(y);
    const result =
        (firstDate.getTime() - secondDate.getTime()) / (1000 * 60 * 60 * 24);
    if (result < 0) {
        return 0;
    }
    return Math.floor(result);
};
