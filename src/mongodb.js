const mongodb = require('mongodb');

const MongoClient = mongodb.MongoClient;

const ConnectionURL = 'mongodb://127.0.0.1:27017';
const DatabaseName = 'task-manager';

MongoClient.connect(
    ConnectionURL,
    { useNewUrlParser: true },
    (error, client) => {
        if (error) {
            return console.log('Database Connection Failed');
        }
        console.log('Database Conection Successful!');
        const db = client.db(DatabaseName);
        // db.collection('users').insertOne({
        //     name: 'Kushagra',
        //     age: 21,
        // });
        // db.collection('tasks').insertMany(
        //     [
        //         { description: 'Learn React', completed: true },
        //         { description: 'Learn NodeJS', completed: false },
        //         { description: 'Learn GRAPHQL', completed: false },
        //     ],
        //     (error, result) => {
        //         if (error) return console.log('Failed to insert Docs');
        //         console.log(result.ops);
        //     }
        // );
        db.collection('tasks').findOne(
            { _id: new mongodb.ObjectID('5fd9df1e713526038843d79c') },
            (error, task) => {
                if (error) return console.log('Failed to Read Doc');
                console.log(task);
            }
        );
        db.collection('tasks')
            .find({ completed: false })
            .toArray((error, tasks) => {
                if (error) return console.log('Failed to Read Doc');
                console.log(tasks);
            });
    }
);
