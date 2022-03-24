export default {
    "temp-dir": "./build/.nyc_output/",
    "report-dir": "./build/coverage/",
    exclude: [
        "test/**",
    ],
    reporter: [
        "text-summary",
        "html",
    ],
}
