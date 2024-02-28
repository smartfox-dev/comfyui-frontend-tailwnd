export default function convertJoiErrors2Errors(joiErrors = []) {
    const errors = {}
    joiErrors.forEach(error => {
        errors[error.path[0]] = error.message
    })
    return errors
}