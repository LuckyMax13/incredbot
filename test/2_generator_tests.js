const Incredbot = require('../index.js')
const config = require('./config')
const incredbot = new Incredbot(config.incredbot)
const expect = require('chai').expect
const should = require('chai').should()

describe('Text Generator', function () {
    it('Should generate text message body', async () => {
        const m = new incredbot.Message.Text('Testing...')
        const correct = {
            text: 'Testing...'
        }
        expect(m).to.deep.equal(correct)
    })

    it('Should generate quick replies message body', async () => {
        const qrs = [new incredbot.Helpers.QuickReply('text', 'QR', 'PAYLOAD')]
        const m = new incredbot.Message.QuickReplies('Testing...', qrs)
        const correct = {
            text: 'Testing...',
            quick_replies: qrs
        }
        expect(m).to.deep.equal(correct)
    })

    it('Should generate button message body', async () => {
        const btns = [new incredbot.Helpers.Button('web_url', 'Button', 'https://google.com')]
        const m = new incredbot.Message.Buttons('Testing...', btns)
        const correct = {
            attachment: {
                type: 'template',
                payload: {
                    template_type: 'button',
                    text: 'Testing...',
                    buttons: btns
                }
            }
        }
        expect(m).to.deep.equal(correct)
    })

    it('Should generate button message body (with quick replies)', async () => {
        const qrs = [new incredbot.Helpers.QuickReply('text', 'QR', 'PAYLOAD')]
        const btns = [new incredbot.Helpers.Button('web_url', 'Button', 'https://google.com')]
        const m = await new incredbot.Message.Buttons('Testing...', btns, qrs)
        const correct = {
            attachment: {
                type: 'template',
                payload: {
                    template_type: 'button',
                    text: 'Testing...',
                    buttons: btns
                }
            },
            quick_replies: qrs
        }
        expect(m).to.deep.equal(correct)
    })

    it('Should generate generic message body', async () => {
        const c = new incredbot.Helpers.Generic('Title', 'Subtitle', 'http://example.com/image.jpg', [new incredbot.Helpers.Button('postback', 'Button', 'PAYLOAD')], {})
        const m = await new incredbot.Message.Generic([c])
        const correct = {
            attachment: {
                payload: {
                    elements: [{
                        buttons: [{
                            payload: 'PAYLOAD',
                            title: 'Button',
                            type: 'postback'
                        }],
                        default_action: {},
                        image_url: 'http://example.com/image.jpg',
                        subtitle: 'Subtitle',
                        title: 'Title'
                    }],
                    template_type: 'generic'
                },
                type: 'template'
            }
        }
        expect(m).to.deep.equal(correct)
    })
})

describe('Frame Class', function () {
    it('Should wrap message with recipient as parameter', () => {
        const btns = [new incredbot.Helpers.Button('web_url', 'Button', 'https://google.com')]
        const m = new incredbot.Message.Buttons('Testing...', btns)
        const framed = new incredbot.Frame(m, config.testUserId, {
            messaging_type: 'MESSAGE_TAG'
        })

        const correct = {
            message: {
                attachment: {
                    payload: {
                        buttons: [{
                            title: 'Button',
                            type: 'web_url',
                            url: 'https://google.com'
                        }],
                        template_type: 'button',
                        text: 'Testing...'
                    },
                    type: 'template'
                }
            },
            messaging_type: 'MESSAGE_TAG',
            recipient: {
                id: config.testUserId
            }
        }
        expect(framed).to.deep.equal(correct)
    })
    it('Should wrap message with options object only', () => {
        const btns = [new incredbot.Helpers.Button('web_url', 'Button', 'https://google.com')]
        const m = new incredbot.Message.Buttons('Testing...', btns)
        const framed = new incredbot.Frame(m, {
            messaging_type: 'MESSAGE_TAG',
            recipient_id: config.testUserId
        })

        const correct = {
            message: {
                attachment: {
                    payload: {
                        buttons: [{
                            title: 'Button',
                            type: 'web_url',
                            url: 'https://google.com'
                        }],
                        template_type: 'button',
                        text: 'Testing...'
                    },
                    type: 'template'
                }
            },
            messaging_type: 'MESSAGE_TAG',
            recipient: {
                id: config.testUserId
            }
        }
        expect(framed).to.deep.equal(correct)
    })

    it('Should wrap message without options object', () => {
        const btns = [new incredbot.Helpers.Button('web_url', 'Button', 'https://google.com')]
        const m = new incredbot.Message.Buttons('Testing...', btns)
        const framed = new incredbot.Frame(m, config.testUserId)

        const correct = {
            message: {
                attachment: {
                    payload: {
                        buttons: [{
                            title: 'Button',
                            type: 'web_url',
                            url: 'https://google.com'
                        }],
                        template_type: 'button',
                        text: 'Testing...'
                    },
                    type: 'template'
                }
            },
            messaging_type: 'RESPONSE',
            recipient: {
                id: config.testUserId
            }
        }
        expect(framed).to.deep.equal(correct)
    })
})
