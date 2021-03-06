module.exports = function (grunt) {
  var githubUser = grunt.option('githubUser') || 'defaultUser';
  var githubPassword = grunt.option('githubPassword') || 'defaultPassword';
  // Configure `curl` with URLs
  // If you would like to download multiple files
  // to the same directory, there is `curl-dir`
  grunt.initConfig({
    http: {
      create_token: {
        options: {
          url: 'https://api.github.com/authorizations',
          headers: {'User-Agent': githubUser},
          method: 'POST',
          body: JSON.stringify({"scopes": ["repo", "user"], "note": "urban graphics"}),
          auth: {
            'user': githubUser,
            'pass': githubPassword
          },
          ignoreErrors:true
        }
      },
      get_tokens: {
        options: {
          url: 'https://api.github.com/authorizations',
          headers: {'User-Agent': githubUser},
          method: 'GET',
          auth: {
            'user': githubUser,
            'pass': githubPassword
          }
        },
        dest:"tmp/all_tokens.json"
      }
    }
  // config:{
  //   grunt.file.readJSON('tmp/all_tokens.json',function(err,response){
  //     console.log(response)
  //   }
  // }

  })

    // Load in `grunt-http`
    grunt.loadNpmTasks('grunt-http');
    grunt.registerTask('config', 'config task.', function() {
       var response = grunt.file.readJSON('tmp/all_tokens.json');
       // function tokenExists()
       var target;
       for(var i = 0; i<response.length;i++){
          if(response[i]["note"]=="urban graphics"){
              target = response[i]["token"]
              break
          }
          else{
            target = null
          }
       }
       grunt.file.write('tmp/token.js',JSON.stringify(target));
    });
};







