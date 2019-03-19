const path = require("path")

exports.createPages = ({ graphql, boundActionCreators }) => {
  const { createPage } = boundActionCreators
  return new Promise((resolve, reject) => {
    graphql(`
      {
        allWordpressPage {
          edges {
            node {
              id
              slug
              title
            }
          }
        }
        allWordpressPost {
          edges {
            node {
              slug
            }
          }
        }
      }
    `).then(result => {
      // If messed up, stop it and log out what's going on
      if (result.errors) {
        console.log(result.errors)
        reject(result.errors)
      }

      result.data.allWordpressPage.edges.forEach(({ node }) => {
        createPage({
          path: node.slug,
          component: path.resolve("./src/templates/page.js"),
          context: {
            slug: node.slug,
          },
        })
      })

      result.data.allWordpressPost.edges.forEach(({ node }) => {
        createPage({
          path: `posts/${node.slug}`,
          component: path.resolve("./src/templates/post.js"),
          context: {
            slug: node.slug,
          },
        })
      })
      resolve()
    })
  })
}
