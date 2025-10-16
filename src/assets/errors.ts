import { isStringObject } from "util/types"
import { Notifications } from "../utils/swalNotification"

export class ValidationError extends Error {
    constructor (message: string) {
        super(message),
        this.name = "Validation Error"
    }
}


export const handleBackendError = (error: Error) : void => {
    // Falló al actualizar la base de datos
              if (error instanceof ValidationError) {
                Notifications.fireError(error.message)
              } else {
                try {
                    // Esto captura y muestra los errores del servidor
                    const backendError = JSON.parse(error.message)
                    Notifications.fireUnexpectedError(error.name + ": " + backendError.error)

                }catch (e) {
                    Notifications.fireUnexpectedError()
                }
                
              }
}