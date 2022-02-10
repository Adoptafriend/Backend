import express from 'express';
import axios from 'axios';
import qs from 'querystring';

const main = express.Router();

main.get('/pets', async (request, response) => {
  const baseURL =
    'https://api.petfinder.com/v2/animals?type=dog&status=adoptable&after=2020-01-01T00:00:00.000Z';
  const queryParams = new URLSearchParams(request.query);
  if (!queryParams.has('sort')) {
    if (queryParams.get('location').length === 5) {
      queryParams.set('sort', 'distance');
    } else {
      queryParams.delete('location');
      queryParams.set('sort', '-recent');
    }
  }
  if (!queryParams.has('limit')) {
    queryParams.set('limit', '12');
  }
  const APIurl = `${baseURL}&${queryParams.toString()}`;

  // `https://api.petfinder.com/v2/animals?type=dog&page=1&limit=40&status=adoptable&after=2020-01-01T00:00:00.000Z&sort=-recent`;
  // console.log(queryParams.toString());
  // location
  // page
  // limit
  // distance
  // sort
  // breed

  let token = '';
  const data = { grant_type: 'client_credentials' };
  const options = {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    auth: {
      username: process.env.CLIENT_ID || 'client_id',
      password: process.env.CLIENT_SECRET || 'client_secret',
    },
    data: qs.stringify(data),
    url: 'https://api.petfinder.com/v2/oauth2/token',
  };

  // eslint-disable-next-line no-unused-vars
  const tokenResponse = await axios
    .request(options)
    // eslint-disable-next-line func-names
    .then(function (res) {
      token = res.data.access_token;
    })
    // eslint-disable-next-line func-names
    .catch(function (err) {
      // eslint-disable-next-line no-console
      console.log(`error = ${err}`);
    });

  if (!token) {
    // eslint-disable-next-line no-console
    console.log('token not yet received');
  }

  const sendGetRequest = async () => {
    try {
      const resp = await axios.get(
        // 'https://api.petfinder.com/v2/animals?type=dog&page=1&limit=40&status=adoptable&location=76039&sort=distance', // &sort=-recent
        // `https://api.petfinder.com/v2/animals?type=dog&page=1&limit=40&status=adoptable&after=2020-01-01T00:00:00.000Z&sort=-recent`,

        APIurl,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      response.json(resp.data);
    } catch (err) {
      // Handle Error Heres
      // eslint-disable-next-line no-console
      console.error(err);
    }
  };

  sendGetRequest();
});

main.get('/pets/:id', async (request, response) => {
  const { id } = request.params;
  let token = '';
  const data = { grant_type: 'client_credentials' };
  const options = {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    auth: {
      username: process.env.CLIENT_ID || 'client_id',
      password: process.env.CLIENT_SECRET || 'client_secret',
    },
    data: qs.stringify(data),
    url: 'https://api.petfinder.com/v2/oauth2/token',
  };

  // eslint-disable-next-line no-unused-vars
  const tokenResponse = await axios
    .request(options)
    // eslint-disable-next-line func-names
    .then(function (res) {
      token = res.data.access_token;
    })
    // eslint-disable-next-line func-names
    .catch(function (err) {
      // eslint-disable-next-line no-console
      console.log(`error = ${err}`);
    });

  if (!token) {
    // eslint-disable-next-line no-console
    console.log('token not yet received');
  }

  const sendGetRequest = async () => {
    try {
      const resp = await axios.get(
        `https://api.petfinder.com/v2/animals/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      response.json(resp.data);
    } catch (err) {
      // Handle Error Here
      // eslint-disable-next-line no-console
      console.error(err);
    }
  };

  sendGetRequest();
});

export default main;
