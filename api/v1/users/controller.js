const User = require(__modelsDir + '/User');
const { sendResponse } = require(__helpersDir + '/api');
const { getAllUsers, findUser, setUserValues, saveUser, findAndDestroyUser } = require('./services');

const list = (req, res) => {
  getAllUsers()
    .then(users => {
      const statusCode = 200;
      sendResponse(res, statusCode, users);
    })
    .catch(errors => {
      const statusCode = 500;
      sendResponse(res, statusCode, errors);
    });
};

const show = (req, res) => {
  findUser(req.params.id)
    .then(user => {
      const statusCode = 200;
      sendResponse(res, statusCode, user);
    })
    .catch(errors => {
      const statusCode = ('notFound' in errors) ? 404 : 500;
      sendResponse(res, statusCode, errors);
    });
};

const create = (req, res) => {
  const user = new User();
  setUserValues(req.query, user);

  saveUser(user)
    .then(user => {
      const statusCode = 200;
      sendResponse(res, statusCode, user);
    })
    .catch(errors => {
      const statusCode = 500;
      sendResponse(res, statusCode, errors);
    });
};

const update = (req, res) => {
  let findUserPromise = findUser(req.params.id);
  let updateUserPromise = findUserPromise.then(user => {
    setUserValues(req.query, user);
    return saveUser(user);
  });

  Promise.all([findUserPromise, updateUserPromise])
    .then(([foundUser, updatedUser]) => {
      const statusCode = 200;
      sendResponse(res, statusCode, updatedUser);
    })
    .catch(errors => {
      const statusCode = ('notFound' in errors) ? 404 : 500;
      sendResponse(res, statusCode, errors);
    });
};

const destroy = (req, res) => {
  findAndDestroyUser(req.params.id)
    .then(result => {
      const statusCode = 200;
      sendResponse(res, statusCode, result);
    })
    .catch(errors => {
      const statusCode = ('notFound' in errors) ? 404 : 500;
      sendResponse(res, statusCode, errors);
    });
};

module.exports = { list, show, create, update, destroy };
