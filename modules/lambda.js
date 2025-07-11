
require('dotenv').config();
const path = require("path");
const fs = require("fs");
const transformation = require("../transformation");
const { table } = require("console");
const exec = async () => {
    const inputPath = path.join(__dirname, "..", "inputs");
    const kvmPath = path.join(__dirname, "..", "kvm");
    const dynamicPath = path.join(__dirname, "..", "dynamics");

    const inputFiles = fs.readdirSync(inputPath);
    const kvmFiles = fs.readdirSync(kvmPath);
    const dynamicFiles = fs.readdirSync(dynamicPath);

    const _inputs = {};
    inputFiles.forEach(inputFile => {
        const fileName = inputFile.split(".");
        _inputs[fileName[0]] = JSON.stringify(require(path.join(inputPath, inputFile)));
    })

    const _lookupTables = {}
    kvmFiles.forEach(kvmFile => {
        const fileName = kvmFile.split(".");
        _lookupTables[fileName[0]] = require(path.join(kvmPath, kvmFile));
    })

    const _dynamics = {};
    dynamicFiles.forEach(dynamicFile => {
        const fileName = dynamicFile.split(".");
        _dynamics[fileName[0]] = require(path.join(dynamicPath, dynamicFile));
    })

    const _wevo = {
        lookupTable: {
            listByKeysAsync: async (tableName, keys) => {
                const kvmFile = _lookupTables[tableName];
                if (keys) {
                    return kvmFile.filter(target => keys.find(key => key === target.key) !== undefined)
                } else {
                    return kvmFile;
                }
            },
            getByKeyAsync: async (tableName, key) => {
                let lookupTable = _lookupTables[tableName];
                let targetEntry = lookupTable.find(p => p.key == key);
                if (!targetEntry) {
                    return {};
                }
                return { key: [key], value: targetEntry.value };
            },
            upsertAsync: (tableName, key, value) => {
                const kvmFile = _lookupTables[tableName];
                const targetEntry = kvmFile.find(target => target.key === key);
                if (!targetEntry) {
                    kvmFile.push({
                        key: key,
                        value
                    })
                } else {
                    targetEntry.value = value;
                }
                console.log(`[KVM] ${tableName} upsert ${key} with value ${value}`)
            },
            listByNameAsync: async (tableName) => {
                let lookupTable = _lookupTables[tableName];

                let obj = {};

                for (const variable of lookupTable) {
                    obj[variable.key] = variable.value;
                }

                return obj;
            }
        },
        dynamicStorage: {
            getFirstAsync: async (tableName, filters) => {
                let firstAsync = await _wevo.dynamicStorage.listAsync(tableName, 1, 1, filters);
                return firstAsync.list[0];
            },
            listAsync: async (tableName, page, pageLimit, filters) => {
                let dynamic = _dynamics[tableName];

                let results = dynamic;

                if (filters && Object.keys(filters).length > 0) {
                    let filterList = Object.keys(filters);

                    for (let filterItem of filterList) {

                        let comparisonsList = filters[filterItem];
                        for (let comparisons of comparisonsList) {

                            comparisons = Object.entries(comparisons);
                            for (let [key, value] of comparisons) {

                                switch (filterItem) {
                                    case "eq":
                                        results = results.filter(result => result[key] == value);
                                        break;
                                    case "ne":
                                        results = results.filter(result => result[key] != value)
                                        break;
                                    case "gt":
                                        results = results.filter(result => result[key] > value)
                                        break;
                                    case "gte":
                                        results = results.filter(result => result[key] >= value)
                                        break;
                                    case "lt":
                                        results = results.filter(result => result[key] < value)
                                        break;
                                    case "lte":
                                        results = results.filter(result => result[key] <= value)
                                        break;
                                    case "in":
                                        results = results.filter(result => result[key].includes(value))
                                        break;
                                    case "nin":
                                        results = results.filter(result => !result[key].includes(value))
                                        break;
                                }
                            }
                        }
                    }
                }

                let paginationWithFiltersTotalItems = results.length;

                if (page && pageLimit) results = results.slice((page - 1) * pageLimit, pageLimit);

                return {
                    "list": results, "pagination":
                    {
                        "page": page,
                        "totalPages": Math.ceil(dynamic.length / pageLimit),
                        "limit": pageLimit,
                        "totalItems": paginationWithFiltersTotalItems
                    }
                };


            },
            deleteAsync: async (tableName, filters) => {
                return;
            },
            upsertListAsync: async (tableName, valuesList) => {
                return valuesList;
            }
        },
        logMessage: {
            warning: (message) => console.log(`[WARNING] ${message}`),
            error: (message) => console.log(`[ERRO] ${message}`),
            info: (message) => console.log(`[INFO] ${message}`)
        },
        modules: {
            "@google-cloud/pubsub": require("@google-cloud/pubsub"),
            "adm-zip": require("adm-zip"),
            "axios": require("axios"),
            "azure-storage": require("azure-storage"),
            "crypto": require("crypto"),
            "crypto-js": require("crypto-js"),
            "googleapis": require("googleapis"),
            "http": require("http"),
            "md5": require("md5"),
            "mongodb": require("mongodb"),
            "mssql": require("mssql"),
            "mysql": require("mysql"),
            "node-rsa": require("node-rsa"),
            "nodemailer": require("nodemailer"),
            "oauth-1.0a": require("oauth-1.0a"),
            "oracledb": require("oracledb"),
            "pg": require("pg"),
            "querystring": require("querystring"),
            "request": require("request"),
            "requestretry": require("requestretry"),
            "soap": require("soap"),
            "xml-js": require("xml-js")
        },
        utils: {
            "adm-zip": require("adm-zip"),
            "ajv": require("ajv"),
            "crypto": require("crypto"),
            "cryptojs": require("crypto-js"),
            "md5": require("md5"),
            "nodersa": require("node-rsa"),
            "querystring": require("querystring"),
            "xmltojson": require("xml-js")
        },
        globalProperties: {
            "key": "value"
        },
        parameter: {
            
            getConnectorParameter: () => {
                let connectorParameters = {
                    AppKey: process.env.APP_KEY_VTEX,
                    AppToken: process.env.APP_TOKEN_VTEX
                }

                return connectorParameters;
            }
        },
        execFunctionAsync(functionName, functionInput) {
            let codeFunction = require(path.join(__dirname, "..", "code_functions", `${functionName}.js`));
            let functionResult = codeFunction.execFunctionAsync(functionInput, _wevo);
            return functionResult;
        }
    }

    return await transformation.handler(_inputs, _wevo);
}

exec().then(
    (result) => console.log(result)
).catch(
    error => console.error(error)
);

