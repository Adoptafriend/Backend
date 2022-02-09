import express from 'express';
import axios from 'axios';
import qs from 'querystring';

const main = express.Router();

main.get('/pets', async (request, response) => {
  let token = '';
  const data = { grant_type: 'client_credentials' };
  const options = {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    auth: {
      username: 'S2T4zLSSGUPN91aPOonDpirUTKVhJEQ4T5d7TKDdgR0na0lmss',
      password: '0Q0JBw3MSrRgFZjTFXXUN8y6j7v1PzCPZbffjZCZ',
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
        'https://api.petfinder.com/v2/animals?type=dog&page=1&limit=40&status=adoptable&location=76039&sort=distance',
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
      username: 'S2T4zLSSGUPN91aPOonDpirUTKVhJEQ4T5d7TKDdgR0na0lmss',
      password: '0Q0JBw3MSrRgFZjTFXXUN8y6j7v1PzCPZbffjZCZ',
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
