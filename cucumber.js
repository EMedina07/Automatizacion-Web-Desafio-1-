module.exports = {
    default: {
        require: [
            'src/support/**/*.ts',
            'src/test/stepsDefinitions/**/*.ts'
        ],
        format: [
            'json:reports/cucumber-report.json',
            'progress'
        ],
        paths: [
            'src/test/features/**/*.feature'
        ],
        requireModule: [
            'ts-node/register'
        ],
        publishQuiet: true
    }
}
