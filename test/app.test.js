const { expect } = require('chai');
const supertest = require('supertest');
const app = require('../app');

describe('GET /apps', () => {
  it('Should return an array of apps', () => {
    return supertest(app)
      .get('/apps')
      .expect(200)
      .expect('Content-Type', /json/)
      .then((res) => {
        expect(res.body).to.be.an('array');
        const app = res.body[0];
        expect(app).to.include.all.keys(
          'App',
          'Category',
          'Rating',
          'Reviews',
          'Size',
          'Installs',
          'Type',
          'Price',
          'Genres'
        );
      });
  });
  it('Should return 400 if sort is incorrect', () => {
    return supertest(app).get('/apps').query({ sort: 'MISTAKE' }).expect(400);
  });
  it('Should return 400 if genres is incorrect', () => {
    return supertest(app).get('/apps').query({ genres: 'MISTAKE' }).expect(400);
  });
  it('Should return only matching genres', () => {
    const genre = 'Action';
    return supertest(app)
      .get('/apps')
      .query({ genres: genre })
      .expect(200)
      .then((res) => {
        let matched = true;
        let i = 0;
        while (i < res.body.length) {
          if (res.body[i].Genres != genre) {
            matched = false;
            break;
          }
          i++;
        }
        expect(matched).to.be.true;
      });
  });
  it('Should sort by App name', () => {
    return supertest(app)
      .get('/apps')
      .query({ sort: 'App' })
      .expect(200)
      .then((res) => {
        let sorted = true;
        let i = 0;
        while (i < res.body.length - 1) {
          const appAtI = res.body[i];
          const appAtIPlus1 = res.body[i + 1];
          if (appAtIPlus1.App < appAtI.App) {
            sorted = false;
            break;
          }
          i++;
        }
        expect(sorted).to.be.true;
      });
  });
  it('Should sort by Rating', () => {
    return supertest(app)
      .get('/apps')
      .query({ sort: 'Rating' })
      .expect(200)
      .then((res) => {
        let sorted = true;
        let i = 0;
        while (i < res.body.length - 1) {
          const appAtI = res.body[i];
          const appAtIPlus1 = res.body[i + 1];
          if (appAtI.Rating < appAtIPlus1.Rating) {
            sorted = false;
            break;
          }
          i++;
        }
        expect(sorted).to.be.true;
      });
  });
});
