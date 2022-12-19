const express = require('express');
const mongoose = require('mongoose');
const app = express();
const Blog = require('./models/blog');
const { render } = require('ejs');
const morgan = require('morgan');
const { appendFile } = require('fs');

const dbURI = 'mongodb+srv://anee:papamangal@cluster0.k9eg6hz.mongodb.net/drop?retryWrites=true&w=majority';
mongoose.connect(dbURI, {useNewUrlParser : true, useUnifiedTopology: true})
.then(()=> console.log('Mongodb connected...'))
.catch(err => console.log(err));

mongoose.set('strictQuery', true);

app.set('view engine', 'ejs');

app.use(express.static('public'));
app.use(express.urlencoded({extended: true}));// middleware used to post the blogs
app.use(morgan('dev'))

app.get('/', (req, res) => {
    res.redirect('/blogs')
});

app.get('/about', (req, res) => {
    res.render('about')
});

app.get('/contact', (req, res) => {
    res.render('contact')
});

app.get('/allblogs', (req, res) => {
    Blog.find().sort({createdAt: -1})
    .then((result) => {
        res.render('allBlogs', {'blogs': result});
        })
        .catch((err) => {
            console.log(err);
        });
});

//blog routes

app.get('/blogs/create', (req, res) => {
    res.render('create');
});

app.get('/blogs', (req, res) => {
    Blog.find().sort({createdAt: -1})
    .then((result) => {
        res.render('index', {'blogs': result});
        })
        .catch((err) => {
            console.log(err);
        });
});
 

app.post('/blogs/create', (req, res) => {
    // console.log(req.body);
    const blog = new Blog(req.body)
    blog.save()
    .then((result) => {
        res.redirect('/blogs');
    })
    .catch((err) => {
        console.log(err);
    });
});

app.get('/blogs/:id', (req, res) => {
    const id = req.params.id;
    // console.log(id);
    Blog.findById(id)
        .then(result => {
            res.render('details', {'blog': result});
        })
        .catch((err) => {
            console.log(err);
        });
});

app.delete('/blogs/:id', (req, res) => {
    const id = req.params.id;
    Blog.findByIdAndDelete(id)
        .then(result => {
            res.json({redirect: '/blogs'})
        })
        .catch((err) => {
            console.log(err);
        });
})

app.use((req, res) => {
    res.status(404).render('404')
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, console.log(`Server started on ${PORT}`))