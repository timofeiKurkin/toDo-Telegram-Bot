const fs = require('fs')

const writeFileAsync = async (path, data) => {
    return new Promise((resolve, reject) => fs.writeFile(path, data, (err) => {
        if (err) {
            return reject(err.message)
        }
        resolve()
    }))
}
const appendFileAsync = async (path, data) => {
    return new Promise((resolve, reject) => fs.appendFile(path, data, (err) => {
        if (err) {
            return reject(err.message)
        }
        resolve()
    }))
}

const checkFile = async (path) => {
    return new Promise((resolve, reject) => fs.access(path, (err) => {
        if (err) {
            return resolve(false)
        } else {
            return resolve(true)
        }
    }))
}

module.exports = {writeFileAsync, appendFileAsync, checkFile}