var fs = require('fs');
var db = require('./db');
var findById = function(collection, _id){
    var len = collection.length;

    for(var i = 0; i<len; i++){
        var item = collection[i];
        if(item._id.toString() === _id.toString()) return item;
    }

    return false;
};

function start(response) {
    console.log('GET: index');
    fs.readFile('./public/index.html', 'binary', function (err, data) {
        if (err) {
            response.writeHead(500);
            console.log(err);
            return response.end('Error loading page.');
        }

        response.writeHead(200, {'Content-Type': 'text/html'});
        response.write(data, 'binary');
        response.end();
    });
}

function scripts(response) {
    console.log('GET: scripts');
    fs.readFile('./public/js/scripts.js', 'binary', function (err, data) {
        if (err) {
            response.writeHead(500);
            console.log(err);
            return response.end('Error loading javascript.');
        }

        response.writeHead(200, {'Content-Type': 'text/javascript'});
        response.write(data, 'binary');
        response.end();
    });
}

function styles(response) {
    console.log('GET: styles');
    fs.readFile('./public/css/styles.css', 'binary', function (err, data) {
        if (err) {
            response.writeHead(500);
            console.log(err);
            return response.end('Error loading css.');
        }

        response.writeHead(200, {'Content-Type': 'text/css'});
        response.write(data, 'binary');
        response.end();
    });
}

function upload(response, postData) {
    response.writeHead(200, {'Content-Type': 'text/plain'});
    var posts = JSON.parse(postData),
        saveData = function(post, sectionId) {
            var sectionId = sectionId ? sectionId : null;
            db.tasks.save({ name: post.name, done: post.status, section: sectionId }, function(err, saved) {
                if(err || !saved) console.log('Task not saved');
                else console.log('Task: ' + post.name + ' saved');
            });
        };

    db.tasks.drop();
    db.sections.drop();

    posts.forEach(function(post) {
        post.status = (post.status === 'completed') ? true : false;

        if(post.section !== 'null') {
            console.log('look up section: ' + post.section);

            db.sections.findAndModify({
                    query: { name: post.section, type: post.sectiontype },
                    update: { $set: { name: post.section, type: post.sectiontype }},
                    new: true,
                    upsert: true
                }, function(err,saved) {
                    if(err || !saved) {
                        console.log('Section not saved');
                    } else {
                        console.log(saved.type + ': ' + saved.name + ' saved');
                        saveData(post, saved._id);
                    }
                }
            );
        } else {
            post.section = null;
            post.sectiontype = null;
            saveData(post);
        }
    });

    response.end();
}

function list(response, postData) {
    response.writeHead(200, {'Content-Type': 'text/plain'});
    db.tasks.find(function(err, tasks) {
        if(err || !tasks) {
            console.log('No tasks found in database!');
        } else {
            var result = {
                    unique: [],
                    project: [],
                    area: []
                },
                lock = tasks.length,
                finishRequest = function(result) {
                    response.write(JSON.stringify(result));
                    response.end();
                };

            tasks.forEach(function(task) {
                if(task.section === null) {
                    result.unique.push(task);
                    lock -= 1;

                    if(lock === 0) finishRequest(result);
                } else {
                    db.sections.find({ _id: task.section }, function(err, section) {
                        if(err || !section) {
                            console.log('No section found in database!');
                        } else {
                            var sectionName = section[0].name,
                                sectionType = section[0].type,
                                exists = findById(result[sectionType], section[0]._id);

                            if(exists) {
                                result[sectionType][result[sectionType].indexOf(exists)].tasks.push(task);
                            } else {
                                var res = {
                                        _id: task.section,
                                        name: sectionName,
                                        tasks: [task]
                                    };

                                result[sectionType].push(res);
                            }
                            lock -= 1;

                            if(lock === 0) finishRequest(result);
                        }
                    });
                }
            });
        }
    });
}

// little printer endpoints
function lpMeta(response) {
    console.log('GET: meta.json');
    fs.readFile('./public/meta.json', 'binary', function (err, data) {
        if (err) {
            response.writeHead(500);
            console.log(err);
            return response.end('Error loading page.');
        }

        response.writeHead(200, {'Content-Type': 'application/json'});
        response.write(data, 'binary');
        response.end();
    });
}

function lpEdition(response) {
    console.log('GET: little printer todo list');
    // fs.readFile('./public/meta.json', 'binary', function (err, data) {
    //     if (err) {
    //         response.writeHead(500);
    //         console.log(err);
    //         return response.end('Error loading page.');
    //     }

    //     response.writeHead(200, {'Content-Type': 'application/json'});
    //     response.write(data, 'binary');
    //     response.end();
    // });
}
function lpSample(response) {
    console.log('GET: little printer sample');
    fs.readFile('./public/sample.html', 'binary', function (err, data) {
        if (err) {
            response.writeHead(500);
            console.log(err);
            return response.end('Error loading page.');
        }

        response.writeHead(200, {'Content-Type': 'text/html'});
        response.write(data, 'binary');
        response.end();
    });
}
function lpIcon(response) {
    console.log('GET: little printer icon');
    fs.readFile('./public/imgs/lpicon.png', 'binary', function (err, data) {
        if (err) {
            response.writeHead(500);
            console.log(err);
            return response.end('Error loading page.');
        }

        response.writeHead(200, {'Content-Type': 'image/png'});
        response.write(data, 'binary');
        response.end();
    });
}

exports.start = start;
exports.scripts = scripts;
exports.styles = styles;
exports.upload = upload;
exports.list = list;

//little printer exports
exports.lpMeta = lpMeta;








