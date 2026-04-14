module.exports = {
    default: {
        require: [
            'src/test/stepsDefinitions/**/*.ts',
            '"centerManagement/settings/**/*.ts"'
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