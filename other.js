

function slack_it(message, url){
    request({
       url: url,
       method : 'POST',
       json : true,
       body : { "text" : message }
   })
}

function update(application, request){
   return new Promise ((res, rej)=>{
      let req_branch

      try {
         req_branch = request.push.changes[0].new.name
      }
      catch (err) {
         console.log('Invalid Request')
         rej("Invalid Request")
         return
      }

      if(req_branch == application.branch && !application.locked){
         application.locked = true 
         console.log("Build Started     @ sh " + application.cwd + "deploy.sh")

         let ls = spawn('sh', ['deploy.sh'], { cwd : application.cwd});

         ls.stdout.on('data', (data) => {
            console.log(`stdout: ${data}`);
         });

         ls.stderr.on('data', (data) => {
             console.log(`stderr: ${data}`);
         });

         ls.on('close', (code) => {
             console.log("Build Completed   @ sh " + application.cwd + "deploy.sh")
             application.locked = false
             slack_it("Build Completed", application.hook)
             res("Completed")
         }); 

      } else {
         console.log('Not Master')
         rej("Not Master")
      }
   })
}

app.post(hooks.api.route, (req, res) => {
   update(hooks.api, req.body)
   res.send("Thanks")
})

app.post(hooks.app.route, (req, res) => {
   update(hooks.app, req.body)
   res.send("Thanks")
})


var config = {
    "credentials" : {
        "username" : "digitalfoundry",
        "password" : "lama lama red migo"
    },
    "settings" : {
        "port" : "4001"
    },
    "deployments" : [
        {
            "name" : "Marshall Server",
            ""
        }
    ]
}


var app = {
       hook : "https://hooks.slack.com/services/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",
       route : '/65b22229-eee8-4f8a-b867-d34392d4fb79',
       command : 'sudo sh /var/www/html/admin/deploy.sh',
       cwd : "/var/www/html/admin/",
       branch : 'master',
       locked : false
   }