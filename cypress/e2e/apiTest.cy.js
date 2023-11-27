import posts from '../fixtures/posts.json'

describe('API test', () => {

  it('Find all posts', () => {
    
    cy.request({
      method: 'GET',
      url: '/posts'
    }).then( response => {
      expect(response.status).to.eq(200);
    })

  })

  it('Find first 10 posts', () => {
    
    cy.request({
      method: 'GET',
      url: '/posts?_start=0&_end=10'
    }).then( response => {
      expect(response.status).to.eq(200);
      expect(response.body[0].userId).to.eq(posts[0].userId);
      expect(response.body[0].id).to.eq(posts[0].id);
      expect(response.body[0].title).to.eq(posts[0].title);
      expect(response.body[0].body).to.eq(posts[0].body);
    })

  })

  it('Find posts with id = 55 and id = 60', () => {
    
    cy.request({
      method: 'GET',
      url: '/posts?id=55&id=60'
    }).then( response => {
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
    }).then( response => {
      expect(response.status).to.eq(401);
    })

  })

  it('Create a post with login', () => {
    
    cy.request({
      method: 'POST',
      url: '/664/posts',
      body: posts,
    }).then( response => {
      expect(response.status).to.eq(401);
    })

  })

})