const aws = require('aws-sdk')

module.exports = function invokeLambda (lambdaName, options, payload) {
  const lambda = new aws.Lambda(options)
  const invokeOptions = {
    FunctionName: lambdaName,
    Payload: JSON.stringify(payload)
  }

  return lambda.invoke(invokeOptions).promise()
}
