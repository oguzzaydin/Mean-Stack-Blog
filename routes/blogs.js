const User = require('../models/user'); // Import User Model Schema
const Blog = require('../models/blog'); // Import User Model Schema
const jwt = require('jsonwebtoken');
const config = require('../config/database');

module.exports = (router) => {


    /* ===============================================================
       CREATE NEW BLOG
    =============================================================== */
    router.post('/newBlog', (req, res) => {
        // Check if blog title was provided
        if (!req.body.title) {
            res.json({ success: false, message: 'Blog title is required.' }); // Return error message
        } else {
            // Check if blog body was provided
            if (!req.body.body) {
                res.json({ success: false, message: 'Blog body is required.' }); // Return error message
            } else {
                // Check if blog's creator was provided
                if (!req.body.createdBy) {
                    res.json({ success: false, message: 'Blog creator is required.' }); // Return error
                } else {
                    // Create the blog object for insertion into database
                    const blog = new Blog({
                        title: req.body.title, // Title field
                        body: req.body.body, // Body field
                        createdBy: req.body.createdBy // CreatedBy field
                    });
                    // Save blog into database
                    blog.save((err) => {
                        // Check if error
                        if (err) {
                            // Check if error is a validation error
                            if (err.errors) {
                                // Check if validation error is in the title field
                                if (err.errors.title) {
                                    res.json({ success: false, message: err.errors.title.message }); // Return error message
                                } else {
                                    // Check if validation error is in the body field
                                    if (err.errors.body) {
                                        res.json({ success: false, message: err.errors.body.message }); // Return error message
                                    } else {
                                        res.json({ success: false, message: err }); // Return general error message
                                    }
                                }
                            } else {
                                res.json({ success: false, message: err }); // Return general error message
                            }
                        } else {
                            res.json({ success: true, message: 'Blog saved!' }); // Return success message
                        }
                    });
                }
            }
        }
    });

    router.get('/allBlogs', (req, res) => {
        Blog.find({}, (err, blogs) => {
            if (err) {
                res.json({ success: false, message: err });
            } else {
                if (!blogs) {
                    res.json({ success: false, message: 'No blog found' });
                } else {
                    res.json({ success: true, message: blogs });
                }
            }
        }).sort({ '_id': -1 });
    });

    router.get('/singleBlog/:id', (req, res) => {
        if (!req.params.id) {
            res.json({ success: false, message: 'No blog ID was provided' })
        } else {

            Blog.findOne({ _id: req.params.id }, (err, blog) => {
                if (err) {
                    res.json({ success: false, message: ' Not a valid blog id' });
                } else {
                    if (!blog) {
                        res.json({ success: false, message: 'Blog not found' });
                    } else {
                        User.findOne({ _id: req.decoded.userId }, (err, user) => {
                            if (err) {
                                res.json({ success: false, message: err });
                            } else {
                                if (!user) {
                                    res.json({ success: false, message: 'Unable to authenticate user' });
                                } else {
                                    if (user.username !== blog.createdBy) {
                                        res.json({ success: false, message: 'You are not authorized to edit this blog' });
                                    } else {
                                        res.json({ success: true, blog: blog });
                                    }
                                }
                            }
                        });
                    }
                }
            });
        }
    });

    /* ===============================================================
       UPDATE BLOG POST
    =============================================================== */
    router.put('/updateBlog', (req, res) => {
        // Check if id was provided
        if (!req.body._id) {
            res.json({ success: false, message: 'No blog id provided' }); // Return error message
        } else {
            // Check if id exists in database
            Blog.findOne({ _id: req.body._id }, (err, blog) => {
                // Check if id is a valid ID
                if (err) {
                    res.json({ success: false, message: 'Not a valid blog id' }); // Return error message
                } else {
                    // Check if id was found in the database
                    if (!blog) {
                        res.json({ success: false, message: 'Blog id was not found.' }); // Return error message
                    } else {
                        // Check who user is that is requesting blog update
                        User.findOne({ _id: req.decoded.userId }, (err, user) => {
                            // Check if error was found
                            if (err) {
                                res.json({ success: false, message: err }); // Return error message
                            } else {
                                // Check if user was found in the database
                                if (!user) {
                                    res.json({ success: false, message: 'Unable to authenticate user.' }); // Return error message
                                } else {
                                    // Check if user logged in the the one requesting to update blog post
                                    if (user.username !== blog.createdBy) {
                                        res.json({ success: false, message: 'You are not authorized to edit this blog post.' }); // Return error message
                                    } else {
                                        blog.title = req.body.title; // Save latest blog title
                                        blog.body = req.body.body; // Save latest body
                                        blog.save((err) => {
                                            if (err) {
                                                if (err.errors) {
                                                    res.json({ success: false, message: 'Please ensure form is filled out properly' });
                                                } else {
                                                    res.json({ success: false, message: err }); // Return error message
                                                }
                                            } else {
                                                res.json({ success: true, message: 'Blog Updated!' }); // Return success message
                                            }
                                        });
                                    }
                                }
                            }
                        });
                    }
                }
            });
        }
    });


    // ================================================
    //                DELETE BLOG
    // ================================================
    router.delete('/deleteBlog/:id', (req, res) => {
        if (!req.params.id) {
            res.json({ success: false, message: 'No id provided ' });
        } else {
            Blog.findOne({ _id: req.params.id }, (err, blog) => {
                if (err) {
                    res.json({ success: false, message: 'invalid id' });
                } else {
                    if (!blog) {
                        res.json({ success: false, message: 'Blog was not fond' });
                    } else {
                        User.findOne({ _id: req.decoded.userId }, (err, user) => {
                            if (err) {
                                res.json({ success: false, message: err });
                            } else {
                                if (!user) {
                                    res.json({ success: false, message: 'Unable to authenticate user.' });
                                } else {
                                    if (user.username !== blog.createdBy) {
                                        res.json({ success: false, message: 'You are not authorizet delete this blog post' });
                                    } else {
                                        blog.remove((err) => {
                                            if (err) {
                                                res.json({ success: false, message: err });
                                            } else {
                                                res.json({ success: true, message: 'Blog deleted!' });
                                            }
                                        })
                                    }
                                }
                            }
                        });
                    }
                }
            });
        }
    });


    // ================================================
    //                LİKE  BLOG
    // ================================================

    router.put('/likeBlog', (req, res) => {
        if (!req.body.id) {
            res.json({ success: false, message: 'No id was provided.' });
        } else {
            Blog.findOne({ _id: req.body.id }, (err, blog) => {
                if (err) {
                    res.json({ success: false, message: 'Invalid blog ID' });
                } else {
                    if (!blog) {
                        res.json({ success: false, message: 'That blog was not found.' });
                    } else {
                        User.findOne({ _id: req.decoded.userId }, (err, user) => {
                            if (err) {
                                res.json({ success: false, message: 'Something went wrong.' });
                            } else {
                                if (!user) {
                                    res.json({ success: false, message: 'Could not authenticate user.' });
                                } else {
                                    if (user.username === blog.createdBy) {
                                        res.json({ success: false, message: 'Cannot like your own post.' });
                                    } else {
                                        if (blog.likedBy.includes(user.username)) {
                                            res.json({ success: false, message: 'You aldready liked this post.' });
                                        } else {
                                            if (blog.dislikedBy.includes(user.username)) {
                                                blog.dislikes--;
                                                const arrayIndex = blog.dislikedBy.indexOf(user.username);
                                                blog.dislikedBy.splice(arrayIndex, 1);
                                                blog.likes++;
                                                blog.likedBy.push(user.username);
                                                blog.save((err) => {
                                                    if (err) {
                                                        res.json({ success: false, message: 'Something went wrong maann' });
                                                    } else {
                                                        res.json({ success: true, message: 'Blog liked!' });
                                                    }
                                                });
                                            } else {
                                                blog.likes++;
                                                blog.likedBy.push(user.username);
                                                blog.save((err) => {
                                                    if (err) {
                                                        res.json({ success: false, message: 'Something went wrong maann' });
                                                    } else {
                                                        res.json({ success: true, message: 'Blog liked!' });
                                                    }
                                                });
                                            }
                                        }
                                    }
                                }
                            }

                        });
                    }
                }
            });
        }
    });





    // ================================================
    //                DISLIKES  BLOG
    // ================================================


    router.put('/dislikeBlog', (req, res) => {
        if (!req.body.id) {
            res.json({ success: false, message: 'No id was provided.' });
        } else {
            Blog.findOne({ _id: req.body.id }, (err, blog) => {
                if (err) {
                    res.json({ success: false, message: 'Invalid blog ID' });
                } else {
                    if (!blog) {
                        res.json({ success: false, message: 'That blog was not found.' });
                    } else {
                        User.findOne({ _id: req.decoded.userId }, (err, user) => {
                            if (err) {
                                res.json({ success: false, message: 'Something went wrong.' });
                            } else {
                                if (!user) {
                                    res.json({ success: false, message: 'Could not authenticate user.' });
                                } else {
                                    if (user.username === blog.createdBy) {
                                        res.json({ success: false, message: 'Cannot like your own post.' });
                                    } else {
                                        if (blog.dislikedBy.includes(user.username)) {
                                            res.json({ success: false, message: 'You aldready disliked this post.' });
                                        } else {
                                            if (blog.likedBy.includes(user.username)) {
                                                blog.likes--;
                                                const arrayIndex = blog.likedBy.indexOf(user.username);
                                                blog.likedBy.splice(arrayIndex, 1);
                                                blog.dislikes++;
                                                blog.dislikedBy.push(user.username);
                                                blog.save((err) => {
                                                    if (err) {
                                                        res.json({ success: false, message: 'Something went wrong maann' });
                                                    } else {
                                                        res.json({ success: true, message: 'Blog disliked!' });
                                                    }
                                                });
                                            } else {
                                                blog.dislikes++;
                                                blog.dislikedBy.push(user.username);
                                                blog.save((err) => {
                                                    if (err) {
                                                        res.json({ success: false, message: 'Something went wrong maann' });
                                                    } else {
                                                        res.json({ success: true, message: 'Blog disliked!' });
                                                    }
                                                });
                                            }
                                        }
                                    }
                                }
                            }

                        });
                    }
                }
            });
        }
    });
    /* ===============================================================
     COMMENT ON BLOG POST
  =============================================================== */
    router.post('/comment', (req, res) => {
        // Check if comment was provided in request body
        if (!req.body.comment) {
            res.json({ success: false, message: 'No comment provided' }); // Return error message
        } else {
            // Check if id was provided in request body
            if (!req.body.id) {
                res.json({ success: false, message: 'No id was provided' }); // Return error message
            } else {
                // Use id to search for blog post in database
                Blog.findOne({ _id: req.body.id }, (err, blog) => {
                    // Check if error was found
                    if (err) {
                        res.json({ success: false, message: 'Invalid blog id' }); // Return error message
                    } else {
                        // Check if id matched the id of any blog post in the database
                        if (!blog) {
                            res.json({ success: false, message: 'Blog not found.' }); // Return error message
                        } else {
                            // Grab data of user that is logged in
                            User.findOne({ _id: req.decoded.userId }, (err, user) => {
                                // Check if error was found
                                if (err) {
                                    res.json({ success: false, message: 'Something went wrong' }); // Return error message
                                } else {
                                    // Check if user was found in the database
                                    if (!user) {
                                        res.json({ success: false, message: 'User not found.' }); // Return error message
                                    } else {
                                        // Add the new comment to the blog post's array
                                        blog.comments.push({
                                            comment: req.body.comment, // Comment field
                                            commentator: user.username // Person who commented
                                        });
                                        // Save blog post
                                        blog.save((err) => {
                                            // Check if error was found
                                            if (err) {
                                                res.json({ success: false, message: 'Something went wrong.' }); // Return error message
                                            } else {
                                                res.json({ success: true, message: 'Comment saved' }); // Return success message
                                            }
                                        });
                                    }
                                }
                            });
                        }
                    }
                });
            }
        }
    });


    return router;
}