export default {
    "extensions": [
        "ts",
    ],
    "files": [
        "test/**/*",
        "!test/utils*",
    ],
    "require": [
        "ts-node/register",
    ],
    "environmentVariables": {
        // prevent "MaxListenersExceededWarning: Possible EventEmitter memory leak detected." warning
        "DISABLE_V8_COMPILE_CACHE": "true",
    },
}
