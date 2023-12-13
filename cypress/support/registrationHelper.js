export function registrationAPI(user){
     

    cy.request({
      method: 'POST',
      url: '/register',
       body:  {email: user.email, password: user.password}
      }).then( response => {
        expect(response.status).to.eq(201);
      })

}