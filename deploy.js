const simpleSSHDeploy = require('simple-ssh-deploy')
const config = require('./deploy.config.json')

simpleSSHDeploy(config)
    .then(() => {
        console.log('OK!')
    })
    .catch((error) => {
        console.log('ERROR.')
    })
