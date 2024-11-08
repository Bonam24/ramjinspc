const express = require('express');
const session = require('express-session'); // Import express-session
const app = express();
const fs = require('fs');
const port = process.env.PORT || 3000;
const path = require('path');



const hbs = require('hbs');

const bodyParser = require('body-parser');
const { log } = require('console');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


app.use(session({
  secret: 'secret',
  cookie: { maxAge: 1200000 },
  saveUninitialized: false
}));

app.set('view engine', 'hbs');
app.set('views', path.join(__dirname,'views'));
app.use(express.static(path.join(__dirname,'public')));



// Example of using session in a route
app.get('/', (req, res) => {
  const blogs = getAllBlogPosts();
    res.render('home', { blogs });
});
app.get('/admin', (req, res) => {
  const allblogs = getAllBlogPosts()
    res.render('admin', { allblogs });
  
});

//render login page
app.get('/login', (req, res) => {
    res.render('login');
  
});
//post login page
app.post('/getadmin', (req, res) => {
    const { username, password } = req.body;
    if (username === 'ramjin' && password === 'ramjin@2024') {
      res.redirect('/admin');
    } else {
      res.redirect('/');
    }
  });
  // post data into the blog.json file
  app.post('/blog', (req, res) => {
    const ID = Date.now().toString(); // Generate unique ID for each blog post
    const { heading, briefDescription, bodyContent } = req.body;

    // Initialize an empty blog object in case of empty or non-existent file
    let blog = {};

    // Read the existing data from 'blog.json' if it exists
    try {
        const data = fs.existsSync(path.join(__dirname,'blog.json')) ? fs.readFileSync(path.join(__dirname,'blog.json')) : '{}';
        blog = JSON.parse(data);
    } catch (err) {
        console.error("Error reading JSON file:", err);
        return res.status(500).send("An error occurred while reading the file.");
    }

    // Add the new blog post with the generated ID as a key
    blog[ID] = { heading, briefDescription, bodyContent, ID };

    // Write the updated data back to 'blog.json'
    try {
        fs.writeFileSync(path.join(__dirname,'blog.json'), JSON.stringify(blog, null, 2));
        res.redirect('/admin');
    } catch (err) {
        console.error("Error writing to JSON file:", err);
        res.status(500).send("An error occurred while saving the post.");
    }
  });

  //edit blog post
  app.post('/finalEdit', (req, res) => {
    
    const { heading, briefDescription, bodyContent, ID } = req.body;


    // Initialize an empty blog object in case of empty or non-existent file
    let blog = {};

    // Read the existing data from 'blog.json' if it exists
    try {
        const data = fs.existsSync(path.join(__dirname,'blog.json')) ? fs.readFileSync(path.join(__dirname,'blog.json')) : '{}';
        blog = JSON.parse(data);
    } catch (err) {
        console.error("Error reading JSON file:", err);
        return res.status(500).send("An error occurred while reading the file.");
    }

    // Add the new blog post with the generated ID as a key
    blog[ID] = { heading, briefDescription, bodyContent, ID };

    // Write the updated data back to 'blog.json'
    try {
        fs.writeFileSync(path.join(__dirname,'blog.json'), JSON.stringify(blog, null, 2));
        res.redirect('/admin');
    } catch (err) {
        console.error("Error writing to JSON file:", err);
        res.status(500).send("An error occurred while saving the post.");
    }
  });

  

  // code to edit the blog post
app.post('/edit', (req, res) => {
    const { ID } = req.body;
    let blog = {};
    try {
        const data = fs.existsSync(path.join(__dirname,'blog.json')) ? fs.readFileSync(path.join(__dirname,'blog.json')) : '{}';
        blog = JSON.parse(data);
    } catch (err) {
        console.error("Error reading JSON file:", err);
        return res.status(500).send("An error occurred while reading the file.");
    }
    const post = blog[ID];
    if (!post) {
        return res.status(404).send("Post not found.");
    }
    res.render('editBlog', { post });
}
);


app.listen(port, () => {
  console.log(`app listening at http://localhost:${port}`);
});

//read all blogpost
const getAllBlogPosts = () => {
  try {
    // Read the blog.json file
    const data = fs.readFileSync( path.join(__dirname,'blog.json'), 'utf-8');
    
    // Parse the JSON data
    const blogPosts = JSON.parse(data);

    // Convert the object into an array of blog posts
    const blogPostsArray = Object.values(blogPosts); // This will give an array of all posts

    // If no posts are available, return an empty array
    if (blogPostsArray.length === 0) {
      console.log('No blog posts available.');
      return [];
    }

    // Return the array of blog posts
    return blogPostsArray;
  } catch (err) {
    console.error("Error reading the blog.json file:", err);
    return []; // Return an empty array in case of an error
  }
};
//view blog
app.post('/view', (req, res) => {
  const { ID } = req.body;
  
  fs.readFile(path.join(__dirname,'blog.json'), 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading file:', err);
      return;
    }
  const jsonData = JSON.parse(data);
  const record = jsonData[ID];
  res.render('viewblog', { record });
  console.log(record);
  
});

});

//delete blog post
app.post('/delete', (req, res) => {
  const { ID } = req.body;
  let blog = {};
  try {
      const data = fs.existsSync(path.join(__dirname,'blog.json')) ? fs.readFileSync(path.join(__dirname,'blog.json')) : '{}';
      blog = JSON.parse(data);
  } catch (err) {
      console.error("Error reading JSON file:", err);
      return res.status(500).send("An error occurred while reading the file.");
  }
  delete blog[ID];
  try {
      fs.writeFileSync(path.join(__dirname,'blog.json'), JSON.stringify(blog, null, 2));
      res.redirect('/admin');
  } catch (err) {
      console.error("Error writing to JSON file:", err);
      res.status(500).send("An error occurred while saving the post.");
  }
});
