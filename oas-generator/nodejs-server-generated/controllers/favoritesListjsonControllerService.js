'use strict'

module.exports.favoritesList = function favoritesList(req, res, next) {
  res.send({
    message: 'This is the raw controller for favoritesList'
  });
};

module.exports.favoritesListJsonPARAMETERS = function favoritesListJsonPARAMETERS(req, res, next) {
  res.send({
    message: 'This is the raw controller for favoritesListJsonPARAMETERS'
  });
};