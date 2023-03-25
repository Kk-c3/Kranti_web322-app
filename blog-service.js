const Sequelize = require('sequelize');
const fs = require('fs');

var sequelize = new Sequelize('axjdklxw', 'axjdklxw', 'myh5OCHjQ8yI77ltFD_Ly4cacUlMY0VW', {
host: 'fanny.db.elephantsql.com',
dialect: 'postgres',
port: 5432,
dialectOptions: {
ssl: { rejectUnauthorized: false }
},
query: { raw: true }
});

const Post = sequelize.define('post', {
body: {
type: Sequelize.TEXT,
allowNull: false
},
title: {
type: Sequelize.STRING,
allowNull: false
},
postDate: {
type: Sequelize.DATE,
allowNull: false
},
featureImage: {
type: Sequelize.STRING,
allowNull: true
},
published: {
type: Sequelize.BOOLEAN,
allowNull: false
}
});

// Define a function to delete a post by ID
module.exports.deletePostById = function(id) {
    return Post.destroy({
    where: {
    id: id
    }
    })
    .then((rowsDeleted) => {
    if(rowsDeleted === 1) {
    return Promise.resolve(true);
    }
    else {
    return Promise.reject("Post not found.");
    }
    })
    .catch((err) => {
    return Promise.reject(err);
    });
    }
    
const Category = sequelize.define('category', {
category: {
type: Sequelize.STRING,
allowNull: false
}
});

module.exports.addCategory = function(categoryData) {
    // Replace empty strings with null
    if (categoryData.category === '') {
      categoryData.category = null;
    }
  
    return new Promise((resolve, reject) => {
      Category.create(categoryData).then(() => {
        resolve();
      }).catch((error) => {
        reject("unable to create category");
      });
    });
  }

module.exports.deleteCategoryById=function(id) {
    return new Promise((resolve, reject) => {
        Category.destroy({
            where: {
                id: id
            }
        }).then(rowsDeleted => {
            if (rowsDeleted === 0) {
                reject(new Error("Category not found"));
            } else {
                resolve("Category deleted successfully");
            }
        }).catch(err => {
            reject(err);
        });
    });
}

module.exports.deletePostById = function(id) {
    return Post.destroy({ where: { id } });
}

Post.hasMany(Category, { foreignKey: 'post' });
// Category.hasMany(Post);

module.exports.initialize = function () {
return new Promise((resolve, reject) => {
sequelize.sync()
.then(() => {
resolve();
})
.catch((error) => {
reject("unable to sync the database");
});
});
}

module.exports.getAllPosts = function () {
return new Promise((resolve, reject) => {
Post.findAll()
.then((posts) => {
if (posts.length > 0) {
resolve(posts);
} else {
reject("no results returned");
}
})
.catch((error) => {
reject("no results returned");
});
});
}

module.exports.getPostsByCategory = function (category) {
return new Promise((resolve, reject) => {
Post.findAll({ where: { category: category } })
.then((posts) => {
if (posts.length > 0) {
resolve(posts);
} else {
reject("no results returned");
}
})
.catch((error) => {
reject("no results returned");
});
});
}

module.exports.getPostsByMinDate = function (minDateStr) {
return new Promise((resolve, reject) => {
Post.findAll({
where: {
postDate: {
[Sequelize.Op.gte]: new Date(minDateStr)
}
}
})
.then((posts) => {
if (posts.length > 0) {
resolve(posts);
} else {
reject("no results returned");
}
})
.catch((error) => {
reject("no results returned");
});
});
}

module.exports.getPostById = function (id) {
return new Promise((resolve, reject) => {
Post.findAll({ where: { id: id } })
.then((data) => {
if (data.length > 0) {
resolve(data[0]);
} else {
reject("no results returned");
}
})
.catch((error) => {
reject("no results returned");
});
});
}

module.exports.addPost = function (postData) {
for (const property in postData) {
if (postData[property] === '') {
postData[property] = null;
}
}
postData.published = (postData.published) ? true : false;
postData.postDate = new Date();

return new Promise((resolve, reject) => {
Post.create(postData)
.then(() => {
resolve();
})
.catch((error) => {
reject("unable to create post");
});
});
}

module.exports.getPublishedPosts = function () {
    return new Promise((resolve, reject) => {
      Post.findAll({ where: { published: true } })
        .then((posts) => {
          if (posts.length > 0) {
            resolve(posts);
          } else {
            reject("no results returned");
          }
        })
        .catch((error) => {
          reject("no results returned");
        });
    });
  }
  

  module.exports.getPublishedPostsByCategory = function (category) {
    return new Promise((resolve, reject) => {
      Post.findAll({
        where: {
          published: true,
          category: category
        }
      })
        .then((posts) => {
          if (posts.length > 0) {
            resolve(posts);
          } else {
            reject("no results returned");
          }
        })
        .catch((error) => {
          reject("no results returned");
        });
    });
  }
  
  module.exports.getCategories = function () {
    return new Promise((resolve, reject) => {
      Category.findAll()
        .then((categories) => {
          if (categories.length > 0) {
            resolve(categories);
          } else {
            reject("no results returned");
          }
        })
        .catch((error) => {
          reject("no results returned");
        });
    });
  }
  