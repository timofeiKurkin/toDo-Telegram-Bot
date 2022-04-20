module.exports = {
    // Objects
    myCommands: {
        reply_markup: JSON.stringify({
            inline_keyboard: [
                [{text: 'Добавить задачу', callback_data: '/add'},{text: 'Посмотреть мои задачи', callback_data: '/get'}], [{text: 'Удалить задачу', callback_data: '/remove'}],
            ],
        })
    },
    againOption: {
        reply_markup: JSON.stringify({
            inline_keyboard: [
                [{text: 'Вернуться в главное меню', callback_data: '/exit'},]
            ],
        })
    },
    removeItem: {
        reply_markup: JSON.stringify({
            inline_keyboard: [
                [{text: 'Удалить задачу', callback_data: '/remove'},]
            ]
        })
    }
//
}