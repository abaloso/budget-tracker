type LogLevel = "info" | "warn" | "error" | "debug"

interface LogOptions {
    context?: string
    data?: any
}

export const logger = {
    log: (level: LogLevel, message: string, options?: LogOptions) => {
        const timestamp = new Date().toISOString()
        const context = options?.context ? `[${options.context}]` : ""

        // will have to send to a logging service
        // console methods for now
        switch (level) {
            case "info":
                console.info(`${timestamp} ${context} ${message}`, options?.data || "")
                break
            case "warn":
                console.warn(`${timestamp} ${context} ${message}`, options?.data || "")
                break
            case "error":
                console.error(`${timestamp} ${context} ${message}`, options?.data || "")
                break
            case "debug":
                if (process.env.NODE_ENV !== "production") {
                    console.debug(`${timestamp} ${context} ${message}`, options?.data || "")
                }
                break
        }
    },

    info: (message: string, options?: LogOptions) => {
        logger.log("info", message, options)
    },

    warn: (message: string, options?: LogOptions) => {
        logger.log("warn", message, options)
    },

    error: (message: string, options?: LogOptions) => {
        logger.log("error", message, options)
    },

    debug: (message: string, options?: LogOptions) => {
        logger.log("debug", message, options)
    },
}

export const handleError = (error: any, context: string): string => {
    const errorMessage = error instanceof Error ? error.message : String(error)
    logger.error(errorMessage, { context, data: error })

    if (errorMessage.includes("auth/user-not-found") || errorMessage.includes("auth/wrong-password")) {
        return "Invalid email or password. Please try again."
    } else if (errorMessage.includes("auth/too-many-requests")) {
        return "Too many failed login attempts. Please try again later or reset your password."
    } else if (errorMessage.includes("auth/email-already-in-use")) {
        return "This email is already registered. Please use a different email or try logging in."
    } else if (errorMessage.includes("auth/weak-password")) {
        return "Password is too weak. Please use a stronger password."
    } else if (errorMessage.includes("auth/invalid-email")) {
        return "Invalid email address. Please check and try again."
    }

    return process.env.NODE_ENV === "development"
        ? `Error: ${errorMessage}`
        : "An unexpected error occurred. Please try again later."
}