/**
 * Tool registry — maps function names to handlers and exports tool definitions.
 */
import type { SessionState } from "../session.js";
export declare const TOOL_DEFINITIONS: ({
    type: "function";
    name: string;
    description: string;
    parameters: {
        type: string;
        properties: {
            caller_name: {
                type: string;
                description: string;
            };
            caller_phone: {
                type: string;
                description: string;
            };
            caller_email: {
                type: string;
                description: string;
            };
            intent: {
                type: string;
                description: string;
            };
            priority: {
                type: string;
                enum: string[];
                description: string;
            };
        };
        required: string[];
    };
} | {
    type: "function";
    name: string;
    description: string;
    parameters: {
        type: string;
        properties: {
            summary: {
                type: string;
                description: string;
            };
        };
        required: string[];
    };
} | {
    type: "function";
    name: string;
    description: string;
    parameters: {
        type: string;
        properties: {
            reason: {
                type: string;
                description: string;
            };
        };
        required: string[];
    };
} | {
    type: "function";
    name: string;
    description: string;
    parameters: {
        type: string;
        properties: {
            preferred_date: {
                type: string;
                description: string;
            };
            timezone: {
                type: string;
                description: string;
            };
        };
        required: never[];
    };
} | {
    type: "function";
    name: string;
    description: string;
    parameters: {
        type: string;
        properties: {
            datetime_utc: {
                type: string;
                description: string;
            };
            caller_name: {
                type: string;
                description: string;
            };
            caller_email: {
                type: string;
                description: string;
            };
            caller_phone: {
                type: string;
                description: string;
            };
            notes: {
                type: string;
                description: string;
            };
            datetime_raw: {
                type: string;
                description: string;
            };
        };
        required: string[];
    };
})[];
/**
 * Dispatch a tool call by name and return the JSON-stringified result.
 * Errors are caught and returned as an error result to avoid crashing the session.
 */
export declare function dispatchTool(name: string, argumentsJson: string, state: SessionState): Promise<string>;
//# sourceMappingURL=index.d.ts.map