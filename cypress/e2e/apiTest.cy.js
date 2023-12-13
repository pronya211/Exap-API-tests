///<reference types="cypress"/>
import posts from '../fixtures/posts.json'
import user from '../fixtures/user.json'
import { faker } from '@faker-js/faker';
import { registrationAPI } from '../support/registrationHelper';


user.email = faker.internet.email();
user.text = faker.lorem.text();
user.title = faker.lorem.text();

describe('API test', () => {

  it('Get all posts', () => {

    cy.request({
      method: 'GET',
      url: '/posts'
    }).then(response => {

      expect(response.status).to.eq(200);

    })

  })

  it('Get only first 10 posts', () => {

    cy.request({
      method: 'GET',
      url: '/posts?_start=1&_end=10'
    }).then(response => {

      expect(response.status).to.eq(200);
      expect(response.body[1].userId).to.eq(posts[1].userId);
      expect(response.body[1].id).to.eq(posts[2].id);
      expect(response.body[1].title).to.eq(posts[2].title);
      expect(response.body[1].body).to.eq(posts[2].body);

    })

  })

  it('Get posts with id = 55 and id = 60', () => {

    cy.request({
      method: 'GET',
      url: '/posts?id=55&id=60'
    }).then(response => {

      expect(response.status).to.eq(200);
      expect(response.body[0].id).to.eq(posts[54].id);
      expect(response.body[1].id).to.eq(posts[59].id);

    })

  })

  it('Create a post', () => {

    cy.request({
      method: 'POST',
      url: '/664/posts',
      body: posts,
      failOnStatusCode: false
    }).then(response => {

      expect(response.status).to.eq(401);

    })

  })

  it('Create post with adding access token in header', () => {
    let token

    registrationAPI(user);

    cy.request({
      method: 'POST',
      url: '/login',
      body: { email: user.email, password: user.password }
    }).then(response => {

      expect(response.status).to.eq(200);
      token = response.body.accessToken

    }).then(() => {

      cy.request({
        method: 'POST',
        url: '/664/posts',
        body: { text: user.text },
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }).then(response => {

        expect(response.status).to.eq(201);
        expect(response.body.text).to.eq(user.text);

      })

    })

  })

  it('Create post entity and verify that the entity is created', () => {

    let newPostId

    cy.request({
      method: 'POST',
      url: '/posts',
      body: { "title": user.title },
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(response => {

      newPostId = response.body.id

      expect(response.status).to.eq(201);
      expect(response.body.title).to.eq(user.title);
      expect(response.body.id).to.eq(newPostId)
    })

  })

  it('Update non-existing entity', () => {

    cy.request({
      method: 'PUT',
      url: '/posts/1000',
      headers: {
        'Content-Type': 'application/json'
      },
      failOnStatusCode: false
    }).then(response => {

      expect(response.status).to.eq(404);

    })

  })

  it('Create post entity and update the created entity', () => {

    let myPostId

    cy.request({
      method: 'POST',
      url: '/posts',
      body: { "title": user.title },
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(response => {

      myPostId = response.body.id

      expect(response.status).to.eq(201);
      expect(response.body.title).to.eq(user.title)
      expect(response.body.id).to.eq(myPostId);

    }).then(() => {

      cy.request({
        method: 'PUT',
        url: `/posts/${myPostId}`,
        body: { "title": user.title },
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(response => {

        expect(response.status).to.eq(200);
        expect(response.body.title).to.eq(user.title)

      })

    })

  })

  it('Delete non-existing post entity', () => {

    cy.request({
      method: 'DELETE',
      url: '/posts/100/text',
      headers: {
        'Content-Type': 'application/json'
      },
      failOnStatusCode: false
    }).then(response => {

      expect(response.status).to.eq(404);

    })

  })

  it('Create post entity, update the created entity, and delete the entity', () => {

    let myPostId

    cy.request({
      method: 'POST',
      url: '/posts',
      body: { "title": user.title },
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(response => {

      myPostId = response.body.id

      expect(response.status).to.eq(201);
      expect(response.body.title).to.eq(user.title)
      expect(response.body.id).to.eq(myPostId);

    }).then(() => {

      cy.request({
        method: 'PUT',
        url: `/posts/${myPostId}`,
        body: { "title": user.title },
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(response => {

        expect(response.status).to.eq(200);
        expect(response.body.title).to.eq(user.title)

        cy.log(response.body)

      }).then(() => {

        cy.request({
          method: 'DELETE',
          url: `/posts/${myPostId}`,
          body: { "title": user.title },
          headers: {
            'Content-Type': 'application/json'
          }
        }).then(response => {

          expect(response.status).to.eq(200);
          expect(response.body).to.empty;

        })

      })

    })

  })

})