const aws = require('aws-sdk')

module.exports = function invokeLambda (lambdaName, options, payload) {
  const lambda = new aws.Lambda(options)

  return new Promise((resolve, reject) => {
    lambda
      .invoke({
        FunctionName: lambdaName,
        Payload: JSON.stringify(payload)
      },
      function (err, data) {
        if (err) return reject(err)
        return resolve(data.Payload)
      })
  })
}
