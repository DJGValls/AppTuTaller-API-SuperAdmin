/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
    preset: "ts-jest",
    testEnvironment: "node",
    roots: ["<rootDir>/src", "<rootDir>/test"],
    testMatch: [
        "**/__tests__/**/*.+(ts|tsx)",
        "**/?(*.)+(spec|test).+(ts|tsx)"
    ],
    moduleNameMapper: {
        "^repositories/(.*)$": "<rootDir>/src/repositories/$1",
        "^services/(.*)$": "<rootDir>/src/services/$1",
        "^models/(.*)$": "<rootDir>/src/models/$1",
        "^types/(.*)$": "<rootDir>/src/types/$1",
        "^utils/(.*)$": "<rootDir>/src/utils/$1",
        "^config/(.*)$": "<rootDir>/src/config/$1",
        "^middlewares/(.*)$": "<rootDir>/src/middlewares/$1",
        "^controllers/(.*)$": "<rootDir>/src/controllers/$1",
        "^routes/(.*)$": "<rootDir>/src/routes/$1",
        "^server/(.*)$": "<rootDir>/src/server/$1",
        "^enums/(.*)$": "<rootDir>/src/enums/$1"
    },
    moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
    moduleDirectories: ["node_modules", "src"],
    testPathIgnorePatterns: ["/node_modules/", "/dist/"]
};