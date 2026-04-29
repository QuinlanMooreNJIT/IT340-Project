const { createLogger, format, transports } = require('winston');

const logger = createLogger({
    format: format.combine(
        format.timestamp(),
        format.printf(({ timestamp, message }) => {
            return `${timestamp} - ${message}`;
        })
    ),
    transports: [
        new transports.File({ fielname: 'app.log' })
    ],
});

module.exports = logger;
