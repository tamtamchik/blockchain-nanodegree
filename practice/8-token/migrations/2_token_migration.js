const TamToken = artifacts.require('TamToken')

module.exports = function (deployer) {
  deployer.deploy(TamToken)
}
