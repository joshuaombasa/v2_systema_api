const mongoose = require('mongoose')
const app = require('../app')
const supertest = require('supertest')
const Story = require('../models/story')
const helper = require('./testhelper')
const api = supertest(app)

beforeEach(async () => {
    await Story.deleteMany({})
    for (let story of helper.someStories) {
        const storyObject = new Story(story)
        await storyObject.save()
    }
})

describe('when there is initially some stories saved', () => {
    test('stories are returned as json', async () => {
        await api.get('/api/stories')
            .expect(200)
            .expect('Content-Type', /application\/json/)
    })

    test('all stories are returned', async () => {
        const response = await api.get('/api/stories')
            .expect(200)
            .expect('Content-Type', /application\/json/)
        expect(response.body).toHaveLength(helper.someStories.length)
    })

    test('a specific story is within the returned stories', async () => {
        const response = await api.get('/api/stories')
            .expect(200)
            .expect('Content-Type', /application\/json/)
        const names = response.body.map(item => item.name)
        expect(names).toContain(helper.someStories[0].name)
    })
})

describe('viewing a specific story', () => {
    test('succeeds with a valid id', async () => {
        const storiesAtStart = await helper.getStoriesInDB()
        const idOfstoryToFetch = storiesAtStart[0].id
        await api.get(`/api/stories/${idOfstoryToFetch}`)
            .expect(200)
            .expect('Content-Type', /application\/json/)
    })

    test('fails with a status code 404 if id does not exist', async () => {
        const nonExistentStoryId = await helper.nonExistentStoryId()
        await api.get(`/api/stories/${nonExistentStoryId}`)
            .expect(404)
    })

    test('fails with status code 400 if id is not valid', async () => {
        const invalidId = 'uefeiufeirfh'
        await api.get(`/api/stories/${invalidId}`)
            .expect(400)
    })
})

describe('addition of a new story', () => {
    test('succeeds with valid data', async () => {
        const storiesAtStart = await helper.getStoriesInDB()
        const validStory = helper.validStory
        await api.post(`/api/stories/`)
            .send(validStory)
            .expect(201)
            .expect('Content-Type', /application\/json/)
        const storiesAtEnd = await helper.getStoriesInDB()
        const names = storiesAtEnd.map(item => item.name)
        expect(storiesAtEnd).toHaveLength(storiesAtStart.length + 1)
        expect(names).toContain(validStory.name)
    })

    test('fails with status code 400 if data is invalid', async() => {
        const invalidStory = helper.invalidStory 
        const storiesAtStart = await helper.getStoriesInDB()
        await api.post(`/api/stories/`)
            .send(invalidStory)
            .expect(400)
        const storiesAtEnd = await helper.getStoriesInDB()
        expect(storiesAtEnd).toHaveLength(storiesAtStart.length)
    })
})

describe('updating a story', () => {
    test('succeeds given a valid id and data', async() => {
        const storiesAtStart = await helper.getStoriesInDB()
        const idOfstoryToUpdate = storiesAtStart[0].id
        await api.put(`/api/stories/${idOfstoryToUpdate}`)
              .send(helper.updatedStory)
             .expect(201)
             .expect('Content-Type', /application\/json/)
    })

    test('fails with status code 400 when given an invalid id', async() => {
        const storiesAtStart = await helper.getStoriesInDB()
        const idOfstoryToUpdate = 'eifefjiejie'
        await api.put(`/api/stories/${idOfstoryToUpdate}`)
              .send(helper.updatedStory)
             .expect(400)
    })

    test('fails with status code 404 when given non-existent id', async() => {
        const nonExistentStoryId = await helper.nonExistentStoryId()
        await api.put(`/api/stories/${nonExistentStoryId}`)
              .send(helper.updatedStory)
             .expect(404)
    })
})

describe('deletion of a story', () => {
    test('succeeds with statuscode 204 if id is valid', async() => {
        const storiesAtStart = await helper.getStoriesInDB()
        const idOfstoryToDelete = storiesAtStart[0].id
        await api.delete(`/api/stories/${idOfstoryToDelete}`)
          .expect(204)
          const storiesAtEnd = await helper.getStoriesInDB() 
          expect(storiesAtEnd).toHaveLength(storiesAtStart.length - 1)
    })
     
})

afterAll(async () => {
    mongoose.connection.close()
})