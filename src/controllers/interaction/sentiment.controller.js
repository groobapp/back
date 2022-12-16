// const express = require('express');
// const mongoose = require('mongoose');
// const nlp = require('nlp_compromise');

// // Inicializamos la aplicación Express
// const app = express();

// // Conectamos a la base de datos MongoDB
// mongoose.connect('mongodb://localhost/social_network');

// // Creamos un modelo para las publicaciones en la base de datos
// const Post = mongoose.model('Post', {
//   text: String,
// });

// // Función para analizar el sentimiento de una publicación
// function analyzeSentiment(post) {
//   // Analizamos el texto y obtenemos una lista de términos relacionados con sentimientos y emociones
//   const terms = nlp.text(post.text).out('terms');

//   // Inicializamos la puntuación del sentimiento en 0
//   let score = 0;

//   // Recorremos la lista de términos y sumamos o restamos puntos en función del sentimiento detectado
//   let sentiment = terms.forEach(term => {
//     if (term.tags.includes('Adjective')) {
//       if (term.normal === 'feliz' || term.normal === 'contento' || term.normal === 'alegre') {
//         score += 2;
//       } else if (term.normal === 'triste' || term.normal === 'deprimido' || term.normal === 'melancólico') {
//         score -= 2;
//       } else if (term.normal === 'enamorado' || term.normal === 'enamorada' || term.normal === 'enamorados') {
//         score += 3;
//       } else if (term.normal === 'excitado' || term.normal === 'excitada' || term.normal === 'excitados') {
//         score += 4;
//       }
//     }
//   });

//   if (score < 0) {
//     sentiment = 'triste';
//   } else if (score > 0) {
//     sentiment = 'feliz';
//   } else {
//     sentiment = 'neutral';
//   }

//   return sentiment;
// }