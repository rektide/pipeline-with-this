/** @license MIT License (c) copyright 2011-2013 original author or authors */

/**
 * pipeline2, derived from
 * https://github.com/cujojs/when/blob/master/pipeline.js
 *
 * Run a set of task functions in sequence, passing the result
 * of the previous as an argument to the next.  Like a shell
 * pipeline, e.g. `cat file.txt | grep 'foo' | sed -e 's/foo/bar/g'
 *
 * Modified from when.js implementation to accept a context
 * passed in as `this` to each task.
 *
 * @author Brian Cavalier
 * @author John Hann
 * @author rektide
 */

(function(define) {
define(function(require) {

	var when = require('when');
	var all = when.Promise.all;

	/**
	 * Run array of tasks in a pipeline where the next
	 * tasks receives the result of the previous.  The first task
	 * will receive the initialArgs as its argument list.
	 * @param tasks {Array|Promise} array or promise for array of task functions
	 * @param self context to use as this for all tasks
	 * @param args array of arguments to be passed to the first task
	 * @return {Promise} promise for return value of the final task
	 */
	return function pipeline(tasks, self, args) {
		// Self-optimizing function to run first task with multiple
		// args using apply, but subsequence tasks via direct invocation
		var runTask = function(args, task) {
			runTask = function(arg, task) {
				return task.call(self, arg);
			};

			return task.apply(self, args);
		};

		return all(args).then(function(args) {
			return when.reduce(tasks, function(arg, task) {
				return runTask(arg, task);
			}, args);
		});
	};

});
})(typeof define === 'function' && define.amd ? define : function (factory) { module.exports = factory(require); });
