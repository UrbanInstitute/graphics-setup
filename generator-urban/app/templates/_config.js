module.exports.params = {
	githubToken: <%= githubToken %>,
	githubUser: "<%= githubUser %>",
	urbanUser: "<%= urbanUser %>",
	projectPath: "<%= projectPath %>",
	googleAnalyticsID: "<%= googleAnalyticsID %>",

	staging:{
		port: "<%= stagingPort %>",
		IP: "<%= stagingIP %>"
	},
	production:{
		port: "<%= prodPort %>",
		IP: "<%= prodIP %>"
	}
}