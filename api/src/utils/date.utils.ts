/** convert the review date to Month Day, Year
 * @example
 * ```ts
 * const date = createReviewDate("2023-05-17T20:02:07.544Z");
 *
 * // dateArr value
 * const dateArr = ['Thu', 'May', '18', '2023']
 *
 * // return value would be:
 * 'May 18, 2023'
 * ````
 * @param date {string} - the date when the user leaves a food review feedback
 * @returns a more standard and readable date
 */
export function createReviewDate(date: string): string {
    const reviewDate: Date = new Date(date);
    const dateArr: string[] = reviewDate.toDateString().split(' ');
    return dateArr[1] + ' ' + dateArr[2] + ', ' + dateArr[3];
}
