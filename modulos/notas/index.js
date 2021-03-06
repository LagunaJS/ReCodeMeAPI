/**
 * Dependencias
 */
var api = require('express')();
var _ = require('lodash');

/**
 * Local
 */
var Nota = require('./model');

/**
 * Verbos
 */

 api.get('/notas', function(req, res) {

   Nota.find({}).exec()
     .then(function(notas) {

       var notasFixed = notas.map(function(nota) {
         return nota.toJSON();
       });

       res
         .status(200)
         .set('Content-Type','application/json')
         .json({
           notas: notasFixed
         });
     }, function(err) {
         console.log('err', err);
     });
 });

api.route('/notas/:id?')

  .all(function(req, res, next) {
    res.set('Content-Type','apilication/json');
    next();
})

  // POST
  .post(function(req, res) {

    // manipulamos el request
    var notaNueva = req.body.nota;

    // guardamos en la DB
    Nota.create(notaNueva)
      .then(function(nota) {
        // response
        res
          .status(201)
          .json({
            nota: nota.toJSON()
          });
      });

  })

  // GET /notas
  .get(function(req, res, next) {
    var id = req.params.id;

    if (!id) {
      console.log('no hay parametro');
      return next();
    }

    Nota.findById(id, function(err, nota) {
      if (!nota) {
        return res
          .status(400)
          .send({});
      }

      res.json({
        notas: nota
        });
    });

})

  // PUT
  .put(function(req, res, next) {
    var id = req.params.id;

    if (!id) {
      return next();
    }

    Nota.findById(id, function(err, nota) {
      // response
      if (err) {
          res.status(500)
          .send(err);
      }

      nota.title = req.body.nota.title;
      nota.description = req.body.nota.description;
      nota.body = req.body.nota.body;
      nota.save(function(err){
          if(err){
              res.send(err);
          }
          res.json({message:'Nota Actualizada'});
      });

    })

})

  // DELETE
  .delete(function(req, res) {
    var id = req.params.id;

    if (!id) {
      return next();
    }

    Nota.remove({_id:id}, function() {
      res
        .status(204)
        .send();
    });
  });



module.exports = api;
