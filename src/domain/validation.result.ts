import { ErrorCode } from "./error-code";

export class ValidationResult {
    private constructor (
        public readonly isValid: boolean,
        public readonly errorCode?: ErrorCode,
    ) {}

    static ok(): ValidationResult {
        return new ValidationResult(true);
    }

    static fail(errorCode: ErrorCode): ValidationResult {
        return new ValidationResult(false, errorCode);
    }
}