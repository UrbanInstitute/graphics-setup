module.exports.params = {
	githubToken: <%= githubToken %>,
	githubUser: "<%= githubUser %>",
	urbanUser: "<%= urbanUser %>",
	projectPath: "<%= projectPath %>",
	staging:{
		port: "<%= stagingPort %>",
		IP: "<%= stagingIP %>"
		// port: "20022",
		// IP: "192.188.252.160"
	},
	production:{
		port: "<%= prodPort %>",
		IP: "<%= prodIP %>"
	}
}