const path = require("path");
var buscaCep = require('busca-cep');


const fastify = require("fastify")({
  logger: false
});

fastify.register(require("fastify-static"), {
  root: path.join(__dirname, "public"),
  prefix: "/" 
});

fastify.register(require("fastify-formbody"));

fastify.register(require("point-of-view"), {
  engine: {
    handlebars: require("handlebars")
  }
});


fastify.post("/chatbot", function(request, reply) {
  
  let intentContent = request.body.queryResult.parameters.cep;
  let cep = intentContent.replace(/-/g, "");
  
  var resposta = buscaCep(cep, {sync: true});
  
  console.log(resposta)
  if (!resposta.erro==true) {
    console.log(resposta)
    const local = "Achamos seu endereço!" + "\n" + resposta.logradouro + "\n" + "Bairro: " + resposta.bairro + "\n" + "Cidade: " + 
          resposta.localidade + " - " + resposta.uf;
    reply.send({"fulfillmentText": local});
    console.log(resposta);
    
  } else {
    const errorMsg =  "Infelizmente nao encontramos o cep: " + cep + "\n" + "mas voce pode tentar buscar outro endereço digitando um novo cep abaixo!";
    reply.send({"fulfillmentText": errorMsg});
}
});












// Run the server and report out to the logs
fastify.listen(process.env.PORT, function(err, address) {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
  console.log(`Your app is listening on ${address}`);
  fastify.log.info(`server listening on ${address}`);
});
