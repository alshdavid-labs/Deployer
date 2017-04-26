// Clear CMD
process.stdout.write('\u001b[2J\u001b[0;0H');

// Imports
const fs = require("fs")
const bodyParser = require('body-parser')
const express = require('express')
const app = express()
const exec = require('child_process').exec;
const spawn = require('child_process').spawn;
const request = require('request');

// Init
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// Load Config
const config = JSON.parse( fs.readFileSync('./deploy.json', 'utf8') )

// Add To Config
config.deployments.forEach(project => project['locked'] = false)
config.deployments.forEach(project => project['retry']  = false)


app.post('/deploy/:route', (req, res) => {
    let project = config.deployments.find(x => x.route == req.params.route)

    if (!project) { res.status(404); return res.send("404") } 
    res.send(project.name)

    if (project.type == "github")     if ( !gitHub(project.branch, req.body) ) return
    if (project.type == "bitbucket")  if ( !bitBucket(project.branch, req.body) ) return console.log("Invalid Request")

    console.log(project.branch)
    update(project)


})

app.get('/', (req, res) => res.send("Hey!"))

app.listen(config.settings.port, function () {
  console.log('Deployer listening on port ' + config.settings.port)
})


function bitBucket(branch, request){
    let req_branch

    try {
        req_branch = request.push.changes[0].new.name
    } catch (err) { }

    if (branch == req_branch) { 
        return true
    } else {
        return false
    }

}

function gitHub(branch, request){
    return true
}




 function update(application){


//       if(req_branch == application.branch && !application.locked){
//          application.locked = true 
//          console.log("Build Started     @ sh " + application.cwd + "deploy.sh")

//          let ls = spawn('sh', ['deploy.sh'], { cwd : application.cwd});

//          ls.stdout.on('data', (data) => {
//          //  console.log(`stdout: ${data}`);
//          });

//          ls.stderr.on('data', (data) => {
//          //  console.log(`stderr: ${data}`);
//          });

//          ls.on('close', (code) => {
//              console.log("Build Completed   @ sh " + application.cwd + "deploy.sh")
//              application.locked = false
//              slack_it("Build Completed", application.hook)
//              res("Completed")
//          }); 

//       } else {
//          console.log('Not Master')
//          rej("Not Master")
//       }
//    })
// }
