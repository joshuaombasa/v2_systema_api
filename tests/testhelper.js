const Story = require('../models/story')
const mongoose = require('mongoose')


const someStories = [{
    name: 'Sending Test Packets',
    body: `Once you have a Linux system running, there are a few things you can do to check that
    things are operating properly. This section walks through the commands you should know
    to monitor the network activity, including watching what processes are listening on the net-
    work and what connections are active from your system.`,
    topic: 'Basic Network Troubleshooting',
}, {
    name: 'Getting Network Settings Automatically',
    body: `If your network uses DHCP, youll need to ensure that a proper DHCP client program is
    running on your Linux system. The DHCP client program communicates with the network
    DHCP server in the background and assigns the necessary IP address settings as directed by
    the DHCP server.`,
    topic: 'Basic Network Troubleshooting',
}]

const getStoriesInDB = async () => {
    const storyBobjects = await Story.find({})
    return storyBobjects.map(item => item.toJSON())
}

const nonExistentStoryId = async () => {
    const temporaryStory = new Story({
        name: 'How to ping',
        body: ` opn the command line and type ping www.google.com`,
        topic: 'Basic Network Troubleshooting',
    })
    const savedTemporaryStory = await temporaryStory.save()
    await Story.findByIdAndDelete(savedTemporaryStory._id)
    return savedTemporaryStory._id.toString()
}

const validStory = {
    name: 'AI in system Administration',
    body: `Currently there is ongoing reasearch on how to harness the power of AI to improve sytem administration tasks`,
    topic: 'Basic Network Troubleshooting',
}

const invalidStory = {
    body: `Currently there is ongoing reasearch on how to harness the power of AI to improve sytem administration tasks`,
    topic: 'Basic Network Troubleshooting',
}


const updatedStory = {
    name: 'Cloud native for massively scalable applications',
    body: `Currently there is ongoing reasearch on how to harness the power of AI to improve sytem administration tasks`,
    topic: 'Basic Network Troubleshooting',
}

module.exports = { someStories, getStoriesInDB, nonExistentStoryId, validStory, invalidStory, updatedStory }