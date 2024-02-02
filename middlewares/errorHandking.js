export const errorHandling=(err, req, res, next) => {

    let statusCode = res.statusCode || 400;

    let message = err.message || "התרחשה תקלה בשרת"
    res.status(statusCode).send(message);

}