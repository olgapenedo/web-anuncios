'use strict';

const AWS = require('aws-sdk');
const { v4 } = require("uuid");

const AD_TABLE = process.env.AD_TABLE;
const AWS_DEPLOY_REGION = process.env.AWS_DEPLOY_REGION;
const dynamoDb = new AWS.DynamoDB.DocumentClient({
    region: AWS_DEPLOY_REGION
});

module.exports.createAd = async (event, context) => {
  const adId = v4();

  const { nameAd, userId,description} = JSON.parse(event.body);

  const datePosted = new Date().toISOString();

  const params = {
    TableName: AD_TABLE,
    Item: {
      adId,nameAd,userId, datePosted,  description
    },
  };

  try {
    const data = await dynamoDb.put(params).promise();
    console.log(`createAd data=${JSON.stringify(data)}`);
    return { statusCode: 200,headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    }, body: JSON.stringify(params.Item) };
  } catch (error) {
    console.log(`createAd ERROR=${error.stack}`);
    return {
      statusCode: 400,
      error: `No se pudo crear el anuncio: ${error.stack}`
    };
  }

};


module.exports.getAdvertisement = async (event, context) => {
  console.log(event.pathParameters.adv);
  const params = {
    TableName: AD_TABLE,
    FilterExpression: '#adId = :value',
    ExpressionAttributeNames: {
      '#adId': 'adId' 
    },
    ExpressionAttributeValues: {
      ':value': event.pathParameters.adv 
    }
  };

  try {
    const data = await dynamoDb.scan(params).promise();
    if (!data || typeof data === 'undefined' || !data.Items) {
      console.log(`No se pudo encontrar el anuncio por Id=${event.pathParameters}`);
      return {
        statusCode: 404,
        error: `No se pudo encontrar el anuncio por Id: ${event.pathParameters}`
      }
    } else {
      console.log(`getAd data=${JSON.stringify(data.Items)}`);
      return { statusCode: 200, headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },body: JSON.stringify(data.Items) };
    }
  } catch (error) {
    console.log(`getAd ERROR=${error.stack}`);
    return {
      statusCode: 400,
      error: `No se pudo recuperar el anuncio: ${error.stack}`
    };
  }
};


module.exports.getAllAds = async (event, context) => {

  const params = {
    TableName: AD_TABLE,
    ProjectionExpression: 'adId,nameAd, userId',
  };

  try {
    const data = await dynamoDb.scan(params).promise();
    console.log(`getAllAds data=${JSON.stringify(data.Items)}`);
    return { statusCode: 200,headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    }, body: JSON.stringify(data.Items) };
  } catch (error) {
    console.log(`getAllAds ERROR=${error.stack}`);
    return {
      statusCode: 400,
      error: `No se pudieron recuperar los anuncios: ${error.stack}`
    };
  }
};

module.exports.addComments = exports.handler = async (event, context) => {
    try {
        const { adId, comments } = JSON.parse(event.body);
        console.log(comments);
        const params = {
            TableName: AD_TABLE,
            Key: { adId }
        };
        const existingComment = await dynamoDb.get(params).promise();
        const commentsArray = existingComment.Item?.comments ?? [];

        commentsArray.push(comments);
        
        const updateParams = {
            TableName: AD_TABLE,
            Key: { adId },
            UpdateExpression: 'SET comments = :c',
            ExpressionAttributeValues: { ':c': commentsArray }
        };
        await dynamoDb.update(updateParams).promise();

        return {
            statusCode: 200, headers: {
              'Access-Control-Allow-Origin': '*',
              'Access-Control-Allow-Credentials': true,
            },
            body: JSON.stringify({ message: 'Comentario agregado correctamente' })
        };
    } catch (error) {
        console.log(error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Error al agregar el comentario' })
        };
    }
};
