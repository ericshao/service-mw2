import { app } from '@midwayjs/mock/bootstrap';

describe('test/controller/auth.test.ts', () => {
  let currentUser;

  it('should POST /auth/login by wrong username and password', async () => {
    const response = await app
      .httpRequest()
      .post('/auth/login')
      .type('form')
      .send({
        username: app.config.admin.username,
        password: '123456',
      })
      .expect(400);
    expect(response.body.code).toBe(400);
  });

  it('should POST /auth/login by wrong input', async () => {
    const response = await app
      .httpRequest()
      .post('/auth/login')
      .type('form')
      .expect(422);
    expect(response.body.code).toBe(422);
  });

  it('should POST /auth/login by correct username and password', async () => {
    const response = await app
      .httpRequest()
      .post('/auth/login')
      .type('form')
      .send(app.config.admin)
      .expect(200);
    expect(response.body.data.token);
    currentUser = response.body.data;
  });

  it('should GET /auth/currentUser', async () => {
    const response = await app
      .httpRequest()
      .get('/auth/currentUser')
      .set('Authorization', `Bearer ${currentUser.token}`)
      .expect(200);
    expect(response.body.code).toBe(200);
  });

  it('should GET 404', async () => {
    const response = await app
      .httpRequest()
      .get('/auth/currentUsersss')
      .set('Authorization', `Bearer ${currentUser.token}`)
      .expect(404);
    expect(response.body.code).toBe(404);
  });

  it('should GET /auth/logout', async () => {
    const response = await app
      .httpRequest()
      .get('/auth/logout')
      .set('Authorization', `Bearer ${currentUser.token}`)
      .expect(200);
    expect(response.body.code).toBe(200);
  });

  it('should GET /auth/currentUser was logouted', async () => {
    const response = await app
      .httpRequest()
      .get('/auth/currentUser')
      .set('Authorization', `Bearer ${currentUser.token}`)
      .expect(401);
    expect(response.body.code).toBe(401);
  });
});
