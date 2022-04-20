// Import
const {writeFileAsync, appendFileAsync, checkFile} = require('./fileSystem');
const {encrypt, decrypt} = require('./crypto')
const TelegramApi = require('node-telegram-bot-api')
const {myCommands, againOption, removeItem} = require('./option')
const path = require('path')
const fs = require('fs')

// Variable
const token = 'YOUR TOKEN'
const bot = new TelegramApi(token, {polling: true})
const pathDataBase = 'YOUR PATH'
let numDelete = 0
let addActive = false
let removeActive = false


async function startButton(chatId) {
    addActive = false
    removeActive = false
    await bot.sendSticker(chatId, 'https://tlgrm.ru/_/stickers/ccd/a8d/ccda8d5d-d492-4393-8bb7-e33f77c24907/2.webp')
    await bot.sendMessage(chatId, 'Выберите действие', myCommands)
}

async function menuStart(chatId) {
    if (await checkFile(path.resolve(pathDataBase, `${chatId}.txt`))) {
        return startButton(chatId)
    } else {
        await writeFileAsync(path.resolve(pathDataBase, `${chatId}.txt`), '')
        return startButton(chatId)
    }
}

async function serializeTodos(chatId) {
    const data = fs.readFileSync(path.resolve(pathDataBase, `${chatId}.txt`), 'utf-8').split(',')
    delete data[data.length - 1]

    let string = "Твои задачи:\n\n"
    data.forEach((todo, index) => {
        if (index !== data.length) {
            string += `${index + 1}. ${decrypt(todo)}\n`
        }
    })
    return bot.sendMessage(chatId, `${string} \n ${data.length > 0 ?
        (data.length < 1 ?
            `У тебя ${data.length - 1} задач` :
            `У тебя ${data.length - 1} задачи`)
        : 'У тебя нет накаких задач'}`, againOption)
}

async function iDontKnow(chatId) {
    await bot.sendMessage(chatId, `Я тебя не понимаю`)
}

async function arrayIteration(arr, chatId) {
    let str = ''
    arr.forEach((todo, index) => {
        str += `${index + 1}. ${decrypt(todo)}\n`
    })
    await bot.sendMessage(chatId, `${str}`, againOption)
}

async function removeTodo(chatId, n) {
    let readData = fs.readFileSync(path.resolve(pathDataBase, `${chatId}.txt`), 'utf-8').split(',')
    delete readData[readData.length - 1]

    if (n === 0) {
        let string = ""
        readData.forEach((todo, index) => {
            string += `${index + 1}. ${decrypt(todo)}\n`
        })
        await bot.sendMessage(chatId, `Выбери номер задачи для удаления \n\n${string}`, removeItem)
    } else if (n >= 1) {
        // удаляем один элемент из списка
        readData.splice(n - 1, 1)
        numDelete = 0

        fs.writeFileSync(path.resolve(pathDataBase, `${chatId}.txt`), readData.toString())
        return arrayIteration(readData, chatId)
    }
}

const start = () => {
    bot.on('message', async msg => {
        const chatId = msg.chat.id
        const text = msg.text
        // .split(" ").slice(0).join(" ")

        if (text === '/start') {
            return menuStart(chatId)
        } else if (addActive) {
            let cryptoString = encrypt(text)
            return appendFileAsync(path.resolve(pathDataBase, `${chatId}.txt`), `${cryptoString},`)
            // todoList.push(text)
        } else if (removeActive) {
            numDelete = parseInt(text)
        }
    })

    bot.on('callback_query', async msg => {
        const chatId = msg.message.chat.id
        const data = msg.data

        if (data === '/add') {
            addActive = true
            return bot.sendMessage(chatId, `enter`, againOption)
        } else if (data === '/get') {
            return serializeTodos(chatId)
        } else if (data === '/check') {
            return checkTodo(chatId)
        } else if (data === '/exit') {
            return menuStart(chatId)
        } else if (data === '/remove') {
            addActive = false
            removeActive = true
            return removeTodo(chatId, numDelete)
        }
    })
}
start()

